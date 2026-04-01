import React, { useState } from "react";
import { MessageCircle, X, Send } from "lucide-react";

export default function Chatbot() {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([
    {
      role: "ai",
      text: "Hi! I'm ParkZen AI Assistant. How can I help you today?",
    },
  ]);
  const [input, setInput] = useState("");

  const generateResponse = (userInput) => {
    const text = userInput.toLowerCase();
    
    // Parking availability queries
    if (text.includes("available") || text.includes("spot") || text.includes("free")) {
      return "I can help you check parking availability! Which location are you interested in - Airport, Shopping Mall, or Temple?";
    }
    
    // Location specific queries
    if (text.includes("airport")) {
      return "Airport parking currently has 15 available spots out of 200. Premium slots cost ₹80/hour, regular slots ₹50/hour. Would you like me to reserve one?";
    }
    
    if (text.includes("mall") || text.includes("shopping")) {
      return "City Mall has 45 available spots right now. Ground floor: ₹40/hour, Basement: ₹30/hour. EV charging available on level 2.";
    }
    
    if (text.includes("temple")) {
      return "Temple parking is free for the first 30 minutes today. After that, it's ₹20/hour. Weekend rates are higher at ₹30/hour.";
    }
    
    // Pricing queries
    if (text.includes("price") || text.includes("cost") || text.includes("rate")) {
      return "Our parking rates vary by location: Airport (₹50-80/hr), Mall (₹30-40/hr), Temple (₹20/hr, free 30min). EV charging adds ₹15/hr. Would you like specific pricing for any location?";
    }
    
    // Booking queries
    if (text.includes("book") || text.includes("reserve") || text.includes("reserve")) {
      return "I can help you book a parking spot! Please tell me: 1) Which location, 2) Date and time, 3) Duration needed. I'll find the best available slot for you.";
    }
    
    // Time/Duration queries
    if (text.includes("time") || text.includes("hours") || text.includes("duration")) {
      return "Most locations are open 24/7. Airport has 4-hour maximum stay, Mall allows 12 hours, Temple has no time limit. Extended stays may incur additional charges.";
    }
    
    // Payment queries
    if (text.includes("payment") || text.includes("pay") || text.includes("upi")) {
      return "We accept UPI, credit/debit cards, and digital wallets. Payment is required before entry. You can also pre-pay for guaranteed spots. Need help with payment?";
    }
    
    // EV charging queries
    if (text.includes("ev") || text.includes("electric") || text.includes("charging")) {
      return "EV charging stations are available at Airport (10 slots) and Mall (8 slots). Charging costs ₹15/hour plus parking fees. Full charge takes 2-4 hours depending on vehicle.";
    }
    
    // Help/Support queries
    if (text.includes("help") || text.includes("support") || text.includes("issue")) {
      return "I'm here to help! You can ask me about: parking availability, booking, pricing, payment, EV charging, or location details. What specific information do you need?";
    }
    
    // Greeting responses
    if (text.includes("hello") || text.includes("hi") || text.includes("hey")) {
      return "Hello! Welcome to ParkZen! I'm your AI parking assistant. Ask me anything about parking availability, booking, rates, or locations!";
    }
    
    // Default intelligent response
    return "I understand you're asking about parking. Could you be more specific? You can ask me about availability, booking, pricing, locations (Airport/Mall/Temple), EV charging, or payment options.";
  };

  const handleSend = () => {
    if (!input.trim()) return;
    
    const userMsg = { role: "user", text: input };
    setMessages((prev) => [...prev, userMsg]);
    setInput("");

    // Generate AI response based on user input
    setTimeout(() => {
      const aiResponse = generateResponse(input);
      setMessages((prev) => [...prev, { role: "ai", text: aiResponse }]);
    }, 800);
  };

  return (
    <div className="fixed bottom-6 right-6 z-[9999]">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="bg-emerald-500 hover:bg-emerald-600 text-white p-4 rounded-full shadow-2xl transition-all"
      >
        {isOpen ? <X size={24} /> : <MessageCircle size={24} />}
      </button>

      {isOpen && (
        <div className="absolute bottom-20 right-0 w-80 bg-white rounded-2xl shadow-2xl border flex flex-col overflow-hidden">
          <div className="bg-emerald-500 p-4 text-white font-bold">
            ParkZen AI Support
          </div>
          <div className="h-80 overflow-y-auto p-4 space-y-3 bg-gray-50 text-sm">
            {messages.map((m, i) => (
              <div
                key={i}
                className={`flex ${m.role === "user" ? "justify-end" : "justify-start"}`}
              >
                <div
                  className={`p-2 rounded-lg ${m.role === "user" ? "bg-emerald-500 text-white" : "bg-white border text-gray-700"}`}
                >
                  {m.text}
                </div>
              </div>
            ))}
          </div>
          <div className="p-3 border-t flex gap-2">
            <input
              className="flex-1 text-sm outline-none"
              placeholder="Type a message..."
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handleSend()}
            />
            <button onClick={handleSend} className="text-emerald-500">
              <Send size={20} />
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
