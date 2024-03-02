// // Import necessary modules
// const stripeAPI = require('../../utils/stripe')
// const sendEmail = require('../../utils/sendEmail')
// const { sendSMS } = require('../../utils/sendSMS')
// const { logger } = require('../../middlewares/logger')

// //testing purpose not added in real time please ignore this file as of now
// const webHookHandlers = {
//   'checkout.session.completed': async (data) => {
//     try {
//       console.log('Checkout completed successfully', data)
//       const customerEmail = 'shashikanth033@gmail.com'
//       const lineItems = {}

//       // Send SMS
//       const smsResult = await sendSMS('+918123192799', 'Payment succeeded')

//       // Send Email
//       const emailResult = await sendEmail(
//         customerEmail,
//         'Payment Confirmation',
//         'Thank you for your payment.',
//       )

//       // Update MongoDB
//       const mongoDBUpdateResult = await updateMongoDB(customerEmail, lineItems)

//     } catch (error) {
//       console.error('Error processing checkout.session.completed event:', error)
//     }
//   },

//   'payment_intent.succeeded': async (data) => {
//     try {
//       console.log('Payment succeeded', data)
//       // Get relevant data from the event
//       const paymentIntent = data

//       // Additional logic for successful payment intent
//     } catch (error) {
//       console.error('Error processing payment_intent.succeeded event:', error)
//     }
//   },

//   'payment_intent.payment_failed': async (data) => {
//     try {
//       console.log('Payment Failed', data)
//       // Get relevant data from the event
//       const paymentFailedIntent = data

//       // Additional logic for failed payment intent
//     } catch (error) {
//       console.error(
//         'Error processing payment_intent.payment_failed event:',
//         error,
//       )
//     }
//   },
//   // Handle other event types as needed
// }

// exports.handleWebhook = async (req, res) => {
//   const endpointSecret = process.env.STRIPE_WEBHOOK_SECRET

//   const sig = req.headers['stripe-signature']
//   let event

//   try {
//     event = stripeAPI.webhooks.constructEvent(req.rawBody, sig, endpointSecret)
//   } catch (err) {
//     console.error('Webhook Error:', err.message)
//     return res.status(400).json({ error: `Webhook Error: ${err.message}` })
//   }

//   // Handle the event
//   const eventType = event.type
//   if (webHookHandlers[eventType]) {
//     await webHookHandlers[eventType](event)
//   } else {
//     // Unexpected event type
//     console.warn(`Unhandled webhook event type: ${eventType}`)
//   }

//   // Return a 200 response to acknowledge receipt of the event
//   res.json({ received: true })
// }
