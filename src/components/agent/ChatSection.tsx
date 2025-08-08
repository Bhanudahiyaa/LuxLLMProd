import React from "react";

interface Message {
  id: string;
  content: string;
  role: "user" | "assistant";
  timestamp: Date;
}

interface Props {
  messages: Message[];
}

const ChatSection: React.FC<Props> = ({ messages }) => {
  return (
    <div className="space-y-4 bg-card border border-border p-6 rounded-xl">
      {messages.map(msg => (
        <div
          key={msg.id}
          className={`text-sm whitespace-pre-wrap ${
            msg.role === "user" ? "text-foreground" : "text-primary"
          }`}
        >
          <strong>{msg.role === "user" ? "You:" : "Agent:"}</strong>{" "}
          {msg.content}
        </div>
      ))}
    </div>
  );
};

export default ChatSection;
