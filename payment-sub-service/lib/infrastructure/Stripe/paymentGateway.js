import Stripe from "stripe";
import dotenv from "dotenv";

dotenv.config();
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

export default class paymentGateway {
  async processPayment({ amount, currency, userId, planId }) {
    console.log(amount, currency);
    try {
      const paymentIntent = await stripe.paymentIntents.create({
        amount: amount * 100,
        currency,
        metadata: {
          user_id: userId,
          plan_id: planId,
        },
        automatic_payment_methods: { enabled: true },
      });

      return paymentIntent.client_secret;
    } catch (error) {
      console.error("Stripe payment error:", error);
      throw new Error(error);
    }
  }


  async createPaymentIntent({ amount, currency }) {
    try {
      const paymentIntent = await stripe.paymentIntents.create({
        amount,
        currency,
      });

      return paymentIntent.client_secret;
    } catch (error) {
      console.error("Stripe create payment intent error:", error);
      return {
        success: false,
        error: error.message,
      };
    }
  }


  async retrievePaymentIntent(paymentIntentId) {
    try {
      const paymentIntent = await stripe.paymentIntents.retrieve(
        paymentIntentId
      );

      return paymentIntent;
    } catch (error) {
      console.error("Stripe retrieve payment intent error:", error);
      return {
        success: false,
        error: error.message,
      };
    }
  }

  async productGateway(userId, plan) {
    console.log("ProductGateway")
    console.log("userId", userId,plan)
    try {
      if (!plan || !plan.name || !plan.price) {
        throw new Error("Invalid plan details provided");
      }

      // Create a product in Stripe
      const planPayment = await stripe.products.create({
        name: plan.name, // User-selected plan name
      });

      if (!planPayment) {
        throw new Error("Failed to create product in Stripe");
      }

      // Create a price for the product
      const price = await stripe.prices.create({
        product: planPayment.id,
        currency: "inr",
        unit_amount: plan.price * 100, // Convert to paise (Stripe requires smallest unit)
      });

      if (!price.id) {
        throw new Error("Failed to create price in Stripe");
      }

      // Create a checkout session
      const session = await stripe.checkout.sessions.create({
        payment_method_types: ["card"],
        line_items: [
          {
            price: price.id,
            quantity: 1,
          },
        ],
        mode: "payment", // Use "payment" for one-time purchase
        success_url: `http://localhost:5173/payment-success?session_id={CHECKOUT_SESSION_ID}&amount=${plan.price}`,
        cancel_url: `http://localhost:5173/cancel`,
        metadata: {
          userId: userId,
          planId: plan.id.toString(),
          planName: plan.name,
          planPrice: plan.price,
        },
      });

      return session;
    } catch (error) {
      console.error("Stripe Payment Error:", error.message);
      throw new Error("Payment processing failed");
    }
  }
}
