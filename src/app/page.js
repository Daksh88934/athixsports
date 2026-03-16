import HeroSection from "@/components/home/HeroSection";
import ProcessSection from "@/components/home/ProcessSection";
import Script from "next/script";

export default function Home() {
  return (
    <>
      <link href="https://cdn.jsdelivr.net/npm/@n8n/chat/dist/style.css" rel="stylesheet" precedence="default" />

      {/* n8n AI Chatbot Integration for Home Page Only */}
      <Script
        id="n8n-chat-script-home"
        type="module"
        strategy="lazyOnload"
        dangerouslySetInnerHTML={{
          __html: `
            import { createChat } from 'https://cdn.jsdelivr.net/npm/@n8n/chat/dist/chat.bundle.es.js';
            createChat({
              webhookUrl: 'https://kaushikayushh.app.n8n.cloud/webhook/de93928d-f006-4773-87ed-003110912271/chat'
            });
          `
        }}
      />

      <HeroSection />
      
      {/* Mini Feature Highlight before Process */}
      <section className="container" style={{ padding: "4rem 1.5rem", textAlign: "center" }}>
        <h2 className="heading-2" style={{ marginBottom: "1rem" }}>
          Engineered for <span className="text-gradient">Performance</span>
        </h2>
        <p style={{ color: "var(--text-secondary)", maxWidth: "800px", margin: "0 auto 3rem", fontSize: "1.125rem" }}>
          Discover our premium collections ranging from teamwear kits to promotional corporate apparel.
        </p>
      </section>

      <ProcessSection />
    </>
  );
}
