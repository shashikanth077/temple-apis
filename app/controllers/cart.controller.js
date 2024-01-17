const { logger } = require("../middlewares");
const Cart = require("../models/cart.model");
const User = require("../models/user.model");
const Product = require("../models/product.model");

//get cart
exports.getCart = async (req, res) => {

  const userId = req.params.id;
  const user = await User.findOne({ _id: userId });
  const sessionId = req.headers["session"]; 

  const owner = user != null ? user._id : null;
  
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
  const userId = req.body["userid"];
  const user = await User.findOne({ _id: userId });
  const sessionId = req.headers["session"]; 
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
    const image = product.image;

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
      if (itemIndex != -1) {
        let item = cart.items[itemIndex];
       
        if(req.body.type){
          console.log("minus");
          item.quantity -= quantity;
        } else {
          item.quantity += quantity;
        }

        cart.totalPrice = cart.items.reduce((acc, curr) => {
          return acc + curr.quantity * curr.price;
        }, 0);

        cart.totalQuantity = cart.items.reduce((acc, curr) => {
          return acc + curr.quantity ;
        }, 0);

        console.log("item",cart);
        cart.sessionId = sessionId;
        cart.items[itemIndex] = item;
        await cart.save();
        res.status(200).send(cart);
      } else {
        cart.items.push({ productId, name, quantity, price,image });

        cart.totalQuantity = cart.items.reduce((acc, curr) => {
          return acc + curr.quantity ;
        }, 0);

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
        items: [{ productId, name, quantity, price,image }],
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
  const userId = req.params.userid;
  const user = await User.findOne({ _id: userId });
  const sessionId = req.headers["session"]; 
  const owner = user != null ? user._id : null;
  const productId = req.params.productId;
  console.log(productId);

  try {
    let cart = await setHeaderQuery(owner, sessionId);

    if(req.params.productId ==0) {
      cart.items = [];
      cart.totalPrice = 0;
      cart.totalQuantity = 0;

      cart = await cart.save();
      res.status(200).send(cart);
    } else {
      const itemIndex = cart.items.findIndex(
        (item) => item.productId == productId
      );
  
      if (itemIndex > -1) {
        cart.items = cart.items.filter((item) => item.productId != productId)
  
        cart.totalPrice = cart.items.reduce((acc, curr) => {
          return acc + curr.quantity * curr.price;
        }, 0);
  
        cart.totalQuantity = cart.items.reduce((acc, curr) => {
          return acc + curr.quantity ;
        }, 0);
  
        cart = await cart.save();
        res.status(200).send(cart);
      } else {
        res.status(404).send("item not found");
      }
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
