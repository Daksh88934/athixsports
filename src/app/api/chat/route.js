import { NextResponse } from "next/server";

export async function POST(req) {
  try {
    const { message } = await req.json();

    // Since we don't have access to an OpenAI key, we provide a sophisticated mock response
    // based on common sportswear and ATHIX-related keywords.
    const lowerMsg = message.toLowerCase();
    let responseText = "Thanks for reaching out! To get the best help with your custom design or bulk order, please contact our team via WhatsApp at +91 8755022067.";

    if (lowerMsg.includes("fabric") || lowerMsg.includes("material")) {
      responseText = "At ATHIX Sports, we use premium, moisture-wicking and breathable fabrics such as Dri-FIT polyester and Lycra blends. These are designed to keep athletes cool and comfortable during intense performance.";
    } else if (lowerMsg.includes("time") || lowerMsg.includes("delivery") || lowerMsg.includes("fast")) {
      responseText = "Our standard delivery time is very quick, usually ranging from 3 to 10 days depending on the customization and order volume. We manufacture directly in Meerut, India!";
    } else if (lowerMsg.includes("price") || lowerMsg.includes("cost") || lowerMsg.includes("bulk")) {
      responseText = "Prices vary depending on the fabric and level of customization. For bulk orders (like academy or corporate kits), we offer highly competitive pricing. Want me to redirect you to our sales team?";
    } else if (lowerMsg.includes("design") || lowerMsg.includes("custom") || lowerMsg.includes("logo")) {
      responseText = "You can use our Custom Builder page to visualize your colors and text. For advanced bespoke designs involving complex patterns or multiple sponsor logos, our digital design team will create a 3D mockup for you before manufacturing!";
    }

    // Artificial delay to simulate AI typing
    await new Promise((resolve) => setTimeout(resolve, 1000));

    return NextResponse.json({ response: responseText });
  } catch (error) {
    console.error("Chat API error:", error);
    return NextResponse.json(
      { error: "Failed to process chat message" },
      { status: 500 }
    );
  }
}
