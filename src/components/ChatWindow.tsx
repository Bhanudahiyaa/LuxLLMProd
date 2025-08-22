import { useState } from "react";
import { Send } from "lucide-react";

export default function ChatWindow({ agentName }) {
  const [messages, setMessages] = useState([
    { role: "agent", content: `Hi! I am ${agentName}, how can I help?` },
  ]);
  const [input, setInput] = useState("");

  const sendMessage = () => {
    if (!input.trim()) return;
    setMessages([...messages, { role: "user", content: input }]);
    setInput("");

    // Placeholder: simulate agent reply
    setTimeout(() => {
      setMessages(prev => [
        ...prev,
        { role: "agent", content: "This is a mock response." },
      ]);
    }, 600);
  };

  return (
    <div className="flex flex-col h-full">
      {/* Messages */}
      <div className="flex-1 overflow-y-auto space-y-3 mb-3">
        {messages.map((msg, idx) => (
          <div
            key={idx}
            className={`max-w-[75%] px-4 py-2 rounded-2xl ${
              msg.role === "user"
                ? "bg-primary text-primary-foreground self-end"
                : "bg-muted text-muted-foreground self-start"
            }`}
          >
            {msg.content}
          </div>
        ))}
      </div>

      {/* Input */}
      <div className="flex gap-2">
        <input
          value={input}
          onChange={e => setInput(e.target.value)}
          placeholder="Type your message..."
          className="flex-1 px-3 py-2 rounded-lg border border-border bg-background"
        />
        <button
          onClick={sendMessage}
          className="px-3 py-2 rounded-lg bg-primary text-primary-foreground hover:bg-primary/80"
        >
          <Send size={16} />
        </button>
      </div>
    </div>
  );
}
