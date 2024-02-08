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

const webHookHandlers = {
  "checkout.session.completed": (data) => {
    console.log("Checkout completed successfully", data);
    // other business logic
  },

  "payment_intent.succeeded": (data) => {
    console.log("Payment succeeded", data);
  },
  "payment_intent.payment_failed": (data) => {
    console.log("Payment Failed", data);
  },
};

exports.handleWebhook = async (req, res) => {
  const endpointSecret = process.env.STRIPE_WEBHOOK_SECRET ;

  const sig = req.headers["stripe-signature"];
  let event;

  try {
    event = stripeAPI.webhooks.constructEvent(
      req.rawBody,
      sig,
      endpointSecret
    );
  } catch (err) {
    console.error("Webhook Error:", err.message);
    return res.status(400).json({ error: `Webhook Error: ${err.message}` });
  }

  // Handle the event
  switch (event.type) {
    case "payment_intent.succeeded":
      const paymentIntent = event.data.object;
      // Handle successful payment
      // Update your database, fulfill the order, send confirmation email, etc.
      break;
    case "payment_intent.payment_failed":
      const paymentFailedIntent = event.data.object;
      // Handle failed payment
      // Update your database, notify the user, etc.
      break;
    // Handle other event types as needed

    default:
      // Unexpected event type
      return res.status(400).end();
  }

  // Return a 200 response to acknowledge receipt of the event
  res.json({ received: true });
};