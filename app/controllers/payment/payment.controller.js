const bodyParser = require("body-parser");
const { logger } = require("../../middlewares/logger");
const stripeAPI = require("../../utils/stripe");
const {getUserByUserId} = require("../../services/user/user.service");

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

exports.paymentIntent = async(req,res) => {
    const { cartItems, description, receipt_email, shipping } = req.body;
    let paymentIntent;
  
    try {
      paymentIntent = await stripeAPI.paymentIntents.create({
        amount: 124, //later will change it
        currency: 'usd',
        description,
        payment_method_types: ['card'],
        receipt_email,
        shipping,
      });
      
      res.status(200).json({ clientSecret: paymentIntent.client_secret, id: paymentIntent.id})
    } catch (error) {
      logger.error("paymentIntent Error:", error);
      res.status(400).json({ error: 'an error occured, unable to create payment intent' })
    }
}

exports.PaymentSetupIntent = async(req,res) => {
    const { userId } = req;
    const customer = await getUserByUserId(userId);
    let setupIntent; 
  
    try {
      setupIntent = await stripeAPI.setupIntents.create({
        customer: customer._id
      });
      res.status(200).json(setupIntent);
    } catch (error) {
      logger.error("PaymentSetupIntent Error:", error);
      res.status(400).json({ error: 'an error occured, unable to create setup intent' });
    }
}

exports.PaymentUpdateIntent = async(req,res) => {
    const { userId, body: { paymentIntentId } } = req;

    const customer = await getUserByUserId(userId);
    let paymentIntent;
  
    try {
      paymentIntent = await stripeAPI.paymentIntents.update(
        paymentIntentId,
        { customer: customer._id, }
      );
      res.status(200).json({ clientSecret: paymentIntent.client_secret });
    } catch(error) {
      logger.error("PaymentUpdateIntent Error:", error);
      res.status(400).json({ error: 'unable to update payment intent' });
    }
}
