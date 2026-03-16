import { NextResponse } from "next/server";
import Stripe from "stripe";

// Initialize Stripe gracefully, erroring nicely if omitted
const stripe = process.env.STRIPE_SECRET_KEY 
  ? new Stripe(process.env.STRIPE_SECRET_KEY) 
  : null;

export async function POST(req) {
  try {
    if (!stripe) {
      console.warn("Stripe is not configured. Missing STRIPE_SECRET_KEY.");
      return NextResponse.json(
        { error: "Stripe API keys are missing. Please configure them in .env.local" },
        { status: 500 }
      );
    }

    const { items, orderId } = await req.json();

    // Map the cart items into Stripe's required format
    const lineItems = items.map((item) => ({
      price_data: {
        currency: "inr",
        product_data: {
          name: item.title,
          images: item.image ? [item.image] : [],
          description: `Color: ${item.color || 'Default'}`,
        },
        // Remove currency symbols, parse as float, convert to paise (Stripe's smallest INR unit)
        unit_amount: Math.round(parseFloat(item.price.replace(/[^0-9.]/g, "")) * 100),
      },
      quantity: item.qty,
    }));

    // Generate the full URL of the host for our success/cancel redirect links
    const origin = req.headers.get("origin") || process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000";

    // Create the Stripe Checkout Session
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ["card"],
      line_items: lineItems,
      mode: "payment",
      success_url: `${origin}/checkout/success?order_id=${orderId}&session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${origin}/checkout`,
      metadata: { orderId },
    });

    return NextResponse.json({ id: session.id, url: session.url });
  } catch (error) {
    console.error("Stripe Session Error:", error);
    return NextResponse.json(
      { error: error.message || "Failed to create checkout session" },
      { status: 500 }
    );
  }
}
