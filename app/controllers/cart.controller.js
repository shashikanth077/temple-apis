const { logger } = require("../middlewares");
const Cart = require("../models/cart.model");
const User = require("../models/user.model");
const Product = require("../models/product.model");

//get cart
exports.getCart = async (req, res) => {
  const userId = req.headers["userid"];

  const user = await User.findOne({ _id: userId });
  const sessionId = req.headers["session"]; //req.session;

  const owner = user != null ? user._id : null;
  console.log(owner);
  try {
    let cart;
    if (owner != null) {
      cart = await Cart.findOne({ owner: userId });
    } else {
      cart = await Cart.findOne({ sessionId: sessionId });
    }

    if (cart && cart.items.length > 0) {
      res.status(200).send(cart);
    } else {
      res.send(null);
    }
  } catch (error) {
    res.status(500).send();
  }
};

//add item to cart (and create cart [in db] if it's the first item)
exports.addCart = async (req, res) => {
  const userId = req.headers["userid"];
  const user = await User.findOne({ _id: userId });
  const sessionId = req.headers["session"]; //req.session;
  const owner = user != null ? user._id : null;

  const { productId, quantity } = req.body;

  try {
    const product = await Product.findOne({ _id: productId });

    if (!product) {
      res.status(404).send({ message: "product not found" });
      return;
    }
    const price = product.price;
    const name = product.name;
    const stock = product.stock;

    let cart = await setHeaderQuery(owner, sessionId);

    if (quantity > stock) {
      res.status(400).send({ message: `Only ${stock} quantity available` });
      return;
    }

    //If cart already exists for user,
    if (cart) {
      const itemIndex = cart.items.findIndex(
        (item) => item.productId == productId
      );
      //check if product exists or not
      if (itemIndex > -1) {
        let item = cart.items[itemIndex];
        item.quantity += quantity;

        cart.totalPrice = cart.items.reduce((acc, curr) => {
          return acc + curr.quantity * curr.price;
        }, 0);

        cart.sessionId = sessionId;
        cart.items[itemIndex] = item;
        await cart.save();
        res.status(200).send(cart);
      } else {
        cart.items.push({ productId, name, quantity, price });
        cart.totalPrice = cart.items.reduce((acc, curr) => {
          return acc + curr.quantity * curr.price;
        }, 0);
        cart.sessionId = sessionId;

        await cart.save();
        res.status(200).send(cart);
      }
    } else {
      //no cart exists, create one
      const newCart = await Cart.create({
        owner,
        sessionId: sessionId,
        items: [{ productId, name, quantity, price }],
        totalPrice: quantity * price,
      });
      return res.status(201).send(newCart);
    }
  } catch (error) {
    console.log(error);
    res.status(500).send("something went wrong");
  }
};

exports.deleteCart = async (req, res) => {
  const userId = req.headers["userid"];
  const user = await User.findOne({ _id: userId });
  const sessionId = req.headers["session"]; //req.session;
  const owner = user != null ? user._id : null;
  const productId = req.body.productId;
  console.log(productId);

  try {
    let cart = await setHeaderQuery(owner, sessionId);

    const itemIndex = cart.items.findIndex(
      (item) => item.productId == productId
    );
    console.log(itemIndex);
    if (itemIndex > -1) {
      cart.items.splice(itemIndex, 1);
      console.log(cart);
      console.log(cart.items);
      cart.totalPrice = cart.items.reduce((acc, curr) => {
        return acc + curr.quantity * curr.price;
      }, 0);

      cart = await cart.save();
      res.status(200).send(cart);
    } else {
      res.status(404).send("item not found");
    }
  } catch (error) {
    console.log(error);
    res.status(400).send();
  }
};

async function setHeaderQuery(owner, sessionId) {
  let cart;
  if (owner != null) {
    cart = await Cart.findOne({ owner });
  } else {
    cart = await Cart.findOne({ sessionId: sessionId });
  }

  return cart;
}
