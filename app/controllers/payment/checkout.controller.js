const bodyParser = require("body-parser");
const { logger } = require("../../middlewares/logger");
const stripeAPI = require("../../utils/stripe");

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
    console.log(error);
    res
      .status(500)
      .json({ error: "Internal server error (createCheckoutSession)" });
  }
};

exports.getPaymentMethods = async (req, res) => {
  const { currentUser } = req;
  const customer = await getCustomer(currentUser.uid); //userId

  let cards;

  try {
    cards = await stripeAPI.paymentMethods.list({
      customer: customer.id,
      type: "card",
    });
    res.status(200).json(cards.data);
  } catch (error) {
    console.log(error);
    res.status(400).json({ error: "an error occured, unable to get cards" });
  }
};



