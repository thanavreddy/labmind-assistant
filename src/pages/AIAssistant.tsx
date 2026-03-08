import { useState } from "react";
import { Send, Bot, User, Copy } from "lucide-react";
import { Button } from "@/components/ui/button";
import AppLayout from "@/components/AppLayout";

interface Message {
  role: "assistant" | "user";
  content: string;
  isCode?: boolean;
}

const initialMessages: Message[] = [
  {
    role: "assistant",
    content: "Welcome to LabMind AI Assistant! I'm here to help you understand lab concepts. Which experiment would you like to explore today?",
  },
];

const AIAssistant = () => {
  const [messages, setMessages] = useState<Message[]>(initialMessages);
  const [input, setInput] = useState("");

  const handleSend = () => {
    if (!input.trim()) return;
    const userMsg: Message = { role: "user", content: input };
    setMessages((prev) => [
      ...prev,
      userMsg,
      {
        role: "assistant",
        content: `Great question about "${input}". Let me explain the key concepts:\n\n1. **Core Theory**: This involves understanding the fundamental principles behind the experiment.\n2. **Implementation**: The practical steps needed to execute the lab.\n3. **Analysis**: How to interpret your results.\n\nWould you like me to dive deeper into any of these?`,
      },
    ]);
    setInput("");
  };

  return (
    <AppLayout>
      <div className="flex flex-col h-[calc(100vh-3.5rem)]">
        {/* Messages */}
        <div className="flex-1 overflow-auto px-6 py-6 space-y-4">
          {messages.map((msg, i) => (
            <div
              key={i}
              className={`flex gap-3 max-w-3xl ${
                msg.role === "user" ? "ml-auto flex-row-reverse" : ""
              } opacity-0 animate-fade-up`}
              style={{ animationDelay: `${i * 0.1}s` }}
            >
              <div
                className={`h-8 w-8 rounded-lg flex items-center justify-center shrink-0 ${
                  msg.role === "assistant"
                    ? "bg-primary/20 text-primary"
                    : "bg-muted text-muted-foreground"
                }`}
              >
                {msg.role === "assistant" ? (
                  <Bot className="h-4 w-4" />
                ) : (
                  <User className="h-4 w-4" />
                )}
              </div>
              <div
                className={`rounded-lg p-4 text-sm leading-relaxed ${
                  msg.role === "assistant"
                    ? "glass-card-strong"
                    : "bg-muted"
                }`}
              >
                {msg.content.split("\n").map((line, j) => (
                  <p key={j} className={j > 0 ? "mt-1" : ""}>
                    {line.startsWith("```") ? (
                      <code className="font-mono text-xs bg-background/50 px-2 py-1 rounded">
                        {line.replace(/```/g, "")}
                      </code>
                    ) : (
                      line
                    )}
                  </p>
                ))}
              </div>
            </div>
          ))}
        </div>

        {/* Code Preview */}
        <div className="px-6">
          <div className="max-w-3xl mx-auto glass-card p-4 mb-3">
            <div className="flex items-center justify-between mb-2">
              <span className="font-mono text-[10px] text-muted-foreground tracking-wider uppercase">
                Code Example
              </span>
              <Button variant="ghost" size="sm" className="h-6 px-2 text-muted-foreground hover:text-foreground">
                <Copy className="h-3 w-3" />
              </Button>
            </div>
            <pre className="font-mono text-xs text-foreground/80 overflow-x-auto">
{`#include <stdio.h>
void bubbleSort(int arr[], int n) {
    for (int i = 0; i < n-1; i++)
        for (int j = 0; j < n-i-1; j++)
            if (arr[j] > arr[j+1])
                swap(&arr[j], &arr[j+1]);
}`}
            </pre>
          </div>
        </div>

        {/* Input */}
        <div className="px-6 pb-6">
          <div className="max-w-3xl mx-auto flex gap-3">
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handleSend()}
              placeholder="Ask about your lab experiment..."
              className="flex-1 bg-muted border border-border rounded-lg px-4 py-3 text-sm placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/50 transition-shadow"
            />
            <Button
              onClick={handleSend}
              className="bg-primary text-primary-foreground hover:sapphire-glow transition-shadow px-4"
            >
              <Send className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </div>
    </AppLayout>
  );
};

export default AIAssistant;
