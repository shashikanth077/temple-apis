const Product = require("../../models/member/cartModel");
const BookingHistoryModel = require("../../models/member/bookingHistory/bookingHistoryModel");
const User = require("../../models/auth/userModel");
const {
  isNullOrUndefined,
  generateUniqueNumber,
} = require("../../utils/index");
const { sendSMS } = require("../../utils/sendSMS");
const Email = require("../../utils/sendEmail");
const AdminTranscationModel = require("../../models/admin/adminTranscationModel");
const { CLIENT_URL } = require("../../utils/constants");

const addCart = async (req) => {
  const owner = req.user._id;
  const { productId, quantity } = req.body;
  const cart = await Cart.findOne({ owner });

  const product = await Product.findOne({ _id: productId });
  if (!product) {
    res.status(404).send({ message: "product not found" });
  }
  const { name, images, price } = product;
  const image = images[0];

  //If cart already exists for user,
  if (cart) {
    const itemIndex = cart.items.findIndex(
      (item) => item.productId == productId
    );

    //check if product exists or not
    if (itemIndex > -1) {
      cart.items[itemIndex].quantity += quantity;
    } else {
      cart.items.push({ productId, name, image, quantity, price });
    }

    cart.bill = cart.items.reduce((acc, curr) => {
      return acc + curr.quantity * curr.price;
    }, 0);

    await cart.save();
    res.status(200).send(cart);
  } else {
    //no cart exists, create one
    const newCart = await Cart.create({
      owner,
      items: [{ productId, name, image, quantity, price }],
      bill: quantity * price,
    });

    return res.status(201).send(newCart);
  }
};

const AddBookingHistory = async (req) => {
  if (isNullOrUndefined(req) || isNullOrUndefined(req.body)) {
    const data = { success: false, message: "invalid request" };
    return { data, status: 400 };
  }

  const user = await User.findOne({ _id: req.body.userId, activated: true });

  if (!user) {
    const data = { success: false, message: "User not found" };
    return { data, status: 404 };
  }

  let message;
  if (req.body.transStatus === "succeeded") {
    message = "Payment was successfull. Thank you for purchasing";
  } else {
    message =
      "Payment was unsuccessfull. If amount debited it will refund to same account withing 3 to 4 days";
  }

  let OrderId = "prod_" + req.body.devoteeId + "/" + generateUniqueNumber();
  const messageText = `Hello ${req.body.devoteeName}. ${message}. Order Id:${OrderId}`;
  sendSMS(req.body.devoteePhoneNumber, messageText);

  let EmailObject = {
    name: req.body.devoteeName,
    email: req.body.devoteeEmail,
    message: message,
    bodyData: req.body,
    url: `${CLIENT_URL}/mybookings/list`,
  };

  SendConfirmationEmail(EmailObject, "");

  const ShopData = {
    userId: req.body.userId,
    OrderId: OrderId,
    devoteeId: req.body.devoteeId,
    orderType: req.body.orderType,
    amount: req.body.amount,
    Items: req.body.Items,
    billingAddress: req.body.billingAddress,
    devoteeName: req.body.devoteeName,
    devoteePhoneNumber: req.body.devoteePhoneNumber,
    devoteeEmail: req.body.devoteeEmail,
    transStatus: req.body.transStatus,
    stripeReferenceId: req.body.stripeReferenceId,
    paymentMode: req.body.paymentMode,
    orderNotes: req.body.orderNotes,
    OrderDate: Date.now(),
    createdAt: Date.now(),
    modifiedAt: Date.now(),
  };

  const serHistory = new BookingHistoryModel(ShopData);
  const savedService = await serHistory.save();
  const lastInsertedId = savedService._id;

  const adminTransData = {
    userId: user._id,
    tabelRefId: lastInsertedId,
    orderType: "shoporders",
    serviceName: "Products",
    devoteeName: req.body.devoteeName,
    devoteeId: req.body.devoteeId,
    devoteeEmail: req.body.devoteeEmail,
    devoteePhoneNumber: req.body.devoteePhoneNumber,
    orderNotes: req.body.orderNotes,
    billingAddress: req.body.billingAddress,
    stripeReferenceId: req.body.stripeReferenceId,
    amount: req.body.amount,
    transStatus: req.body.transStatus,
    paymentMode: req.body.paymentMode,
    ticketId: OrderId,
    items: req.body.Items,
    createdAt: Date.now(),
    modifiedAt: Date.now(),
  };

  await AdminTranscationModel.create(adminTransData);

  const data = {
    success: true,
    message: "Shop details added successfully",
  };

  return { data, status: 200 };
};

const SendConfirmationEmail = async (user, activationLink) => {
  new Email(
    user,
    activationLink,
    "shopping confirmation email"
  ).ShopConfirmation();
};

module.exports = {
  addCart,
  AddBookingHistory,
};
