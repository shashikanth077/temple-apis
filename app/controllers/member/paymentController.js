const { logger } = require("../../middlewares/logger");
const stripeAPI = require("../../utils/stripe");

/**
 * Handles the payment request.
 *
 * @param {Object} req - The request object.
 * @param {Object} req.body - The request body.
 * @param {Object} req.body.bookingdetails - The booking details.
 * @param {Array} req.body.payment_method_types - The payment method types.
 * @param {number} req.body.amount - The payment amount.
 * @param {string} req.body.currency - The currency of the payment.
 * @param {string} req.body.description - The description of the payment.
 * @param {string} req.body.receipt_email - The email address for receipt.
 * @param {Object} req.body.shipping - The shipping details.
 */
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
