const Product = require("../../models/shop/cart.model");
const { logger } = require("../../middlewares");

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

module.exports = {
  addCart,
};
