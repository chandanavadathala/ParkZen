import React, { useState } from "react";
import { MessageCircle, X, Send } from "lucide-react";

export default function Chatbot() {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([
    {
      role: "ai",
      text: "Welcome to ParkZen! Need help finding a spot at the Airport or Mall?",
    },
  ]);
  const [input, setInput] = useState("");

  const handleSend = () => {
    if (!input.trim()) return;
    const userMsg = { role: "user", text: input };
    setMessages((prev) => [...prev, userMsg]);
    setInput("");

    // AI logic for locations
    setTimeout(() => {
      let reply =
        "I'm not sure about that place. Try asking about the Airport, Shopping Mall, or Temple!";
      const text = input.toLowerCase();

      if (text.includes("airport"))
        reply =
          "Airport parking is nearly full! I recommend booking Slot A-12 now.";
      if (text.includes("mall"))
        reply = "The City Mall has 45 open spots. Rates start at ₹40/hour.";
      if (text.includes("temple"))
        reply = "Temple parking is free for the first 30 mins today.";

      setMessages((prev) => [...prev, { role: "ai", text: reply }]);
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
