const bodyParser = require("body-parser");
const { logger } = require("../../middlewares/logger");
const stripeAPI = require("../../utils/stripe");
const { getUserByUserId } = require("../../services/admin/userService");

exports.getCards = async (req, res) => {
  try {
    const { userId } = req;
    const customer = await getUserByUserId(userId);
    let cards;

    try {
      cards = await stripeAPI.paymentMethods.list({
        customer: customer._id,
        type: "card",
      });
      res.status(200).json(cards.data);
    } catch (error) {
      logger.error("getCards Error:", error);
      res.status(400).json({ error: "an error occured, unable to get cards" });
    }
  } catch (error) {}
};

exports.paymentIntent = async (req, res) => {
  const {
    bookingdetails,
    payment_method_types,
    amount,
    currency,
    description,
    receipt_email,
    shipping,
  } = req.body;
  let paymentIntent;

  try {
    paymentIntent = await stripeAPI.paymentIntents.create({
      bookingdetails,
      amount: amount,
      currency: currency,
      description,
      payment_method_types: payment_method_types,
      receipt_email,
      shipping,
    });

    res.status(200).json({
      clientSecret: paymentIntent.client_secret,
      id: paymentIntent.id,
    });
  } catch (error) {
    logger.error("paymentIntent Error:", error);
    res
      .status(400)
      .json({ error: "an error occured, unable to create payment intent" });
  }
};

exports.PaymentSetupIntent = async (req, res) => {
  const { userId } = req;
  const customer = await getUserByUserId(userId);
  let setupIntent;

  try {
    setupIntent = await stripeAPI.setupIntents.create({
      customer: customer._id,
    });
    res.status(200).json(setupIntent);
  } catch (error) {
    logger.error("PaymentSetupIntent Error:", error);
    res
      .status(400)
      .json({ error: "an error occured, unable to create setup intent" });
  }
};

exports.PaymentUpdateIntent = async (req, res) => {
  const {
    userId,
    body: { paymentIntentId },
  } = req;

  const customer = await getUserByUserId(userId);
  let paymentIntent;

  try {
    paymentIntent = await stripeAPI.paymentIntents.update(paymentIntentId, {
      customer: customer._id,
    });
    res.status(200).json({ clientSecret: paymentIntent.client_secret });
  } catch (error) {
    logger.error("PaymentUpdateIntent Error:", error);
    res.status(400).json({ error: "unable to update payment intent" });
  }
};

exports.createCheckoutSession = async (req, res) => {
  try {
    const domainUrl = process.env.CLIENT_URL;
    const { line_items, customer_email } = req.body;

    // check req body has line items and email
    if (!line_items || !customer_email) {
      return res
        .status(400)
        .json({ error: "missing required session parameters" });
    }

    let session;

    session = await stripeAPI.checkout.sessions.create({
      payment_method_types: ["card"],
      mode: "payment",
      line_items,
      customer_email,
      success_url: `${domainUrl}/success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${domainUrl}/canceled`,
      shipping_address_collection: { allowed_countries: ["GB", "US"] },
    });
    res.status(200).json({ sessionId: session.id });
  } catch (error) {
    logger.error("createCheckoutSession:", error);
    res
      .status(500)
      .json({ error: "Internal server error (createCheckoutSession)" });
  }
};

exports.getPaymentMethods = async (req, res) => {
  const { currentUser } = req;
  const customer = await getCustomer(currentUser.uid);

  let cards;

  try {
    cards = await stripeAPI.paymentMethods.list({
      customer: customer.id,
      type: "card",
    });
    res.status(200).json(cards.data);
  } catch (error) {
    logger.error("getPaymentMethods:", error);
    res.status(400).json({ error: "an error occured, unable to get cards" });
  }
};
