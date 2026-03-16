"use client";

import { useState, useRef, useEffect } from "react";
import { MessageSquare, X, Send, Bot, User } from "lucide-react";
import styles from "./ChatBot.module.css";

export default function ChatBot() {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([
    { role: "assistant", text: "Hi! I am the ATHIX AI. Need help choosing the right fabric or designing your custom team kit?" }
  ]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef(null);

  const toggleChat = () => setIsOpen(!isOpen);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    if (isOpen) scrollToBottom();
  }, [messages, isOpen]);

  const handleSend = async (e) => {
    e.preventDefault();
    if (!input.trim() || isLoading) return;

    const userMessage = input.trim();
    setInput("");
    setMessages((prev) => [...prev, { role: "user", text: userMessage }]);
    setIsLoading(true);

    try {
      const res = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message: userMessage }),
      });

      const data = await res.json();
      setMessages((prev) => [...prev, { role: "assistant", text: data.response }]);
    } catch (error) {
      setMessages((prev) => [...prev, { role: "assistant", text: "Failed to connect to AI. Please try again later." }]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      <button 
        className={styles.triggerBtn} 
        onClick={toggleChat}
        title="Chat with ATHIX AI"
      >
        {isOpen ? <X size={24} /> : <MessageSquare size={24} />}
      </button>

      {isOpen && (
        <div className={styles.chatWindow}>
          <div className={styles.header}>
            <div style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
              <Bot size={20} color="var(--primary)" />
              <h3 style={{ fontSize: "1rem", fontWeight: 600 }}>ATHIX AI Guide</h3>
            </div>
            <button className={styles.closeBtn} onClick={toggleChat}>
              <X size={18} />
            </button>
          </div>

          <div className={styles.messageList}>
            {messages.map((msg, index) => (
              <div 
                key={index} 
                className={`${styles.messageWrapper} ${msg.role === 'user' ? styles.userWrapper : styles.botWrapper}`}
              >
                {msg.role === 'assistant' && (
                  <div className={styles.avatar}><Bot size={14} /></div>
                )}
                <div className={`${styles.messageBubble} ${msg.role === 'user' ? styles.userBubble : styles.botBubble}`}>
                  {msg.text}
                </div>
              </div>
            ))}
            {isLoading && (
              <div className={`${styles.messageWrapper} ${styles.botWrapper}`}>
                <div className={styles.avatar}><Bot size={14} /></div>
                <div className={`${styles.messageBubble} ${styles.botBubble} ${styles.typing}`}>
                  <span></span><span></span><span></span>
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          <form onSubmit={handleSend} className={styles.inputArea}>
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Ask me anything..."
              className={styles.input}
            />
            <button 
              type="submit" 
              className={styles.sendBtn}
              disabled={!input.trim() || isLoading}
            >
              <Send size={18} />
            </button>
          </form>
        </div>
      )}
    </>
  );
}
