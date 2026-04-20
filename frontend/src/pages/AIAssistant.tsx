import { useState, useEffect } from "react";
import { Send, Bot, User, Copy } from "lucide-react";
import { Button } from "@/components/ui/button";
import AppLayout from "@/components/AppLayout";

interface Message {
  role: "assistant" | "user";
  content: string;
}

const AIAssistant = () => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");

  const [stage, setStage] = useState<"subject" | "experiment" | "chat">("subject");
  const [subjects, setSubjects] = useState<string[]>([]);
  const [experiments, setExperiments] = useState<string[]>([]);
  const [selectedSubject, setSelectedSubject] = useState("");
  const [selectedExperiment, setSelectedExperiment] = useState("");

  // -------------------------------
  // Load Subjects
  // -------------------------------
  useEffect(() => {
    fetch("http://localhost:8000/dem/subjects")
      .then(res => res.json())
      .then(data => {
        setSubjects(data.subjects);

        setMessages([
          {
            role: "assistant",
            content: "Hi! I'm LabMind, your personal Lab Assistant. Choose a subject to begin:"
          }
        ]);
      });
  }, []);

  // -------------------------------
  // Select Subject
  // -------------------------------
  const handleSubjectSelect = async (subject: string) => {
    setSelectedSubject(subject);

    setMessages(prev => [...prev, { role: "user", content: subject }]);

    const res = await fetch(`http://localhost:8000/dem/experiments/${subject}`);
    const data = await res.json();

    setExperiments(data.experiments);
    setStage("experiment");

    setMessages(prev => [
      ...prev,
      { role: "assistant", content: "Select an experiment:" }
    ]);
  };

  // -------------------------------
  // Select Experiment
  // -------------------------------
  const handleExperimentSelect = (exp: string) => {
    setSelectedExperiment(exp);

    setMessages(prev => [
      ...prev,
      { role: "user", content: exp },
      {
        role: "assistant",
        content: "Great! You can now start asking questions about this experiment."
      }
    ]);

    setStage("chat");
  };

  // -------------------------------
  // Send Chat Message
  // -------------------------------
  const handleSend = async () => {
    if (!input.trim()) return;

    const userMsg: Message = { role: "user", content: input };

    setMessages(prev => [...prev, userMsg]);
    setInput("");

    const res = await fetch("http://localhost:8000/dem/chat", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        subject: selectedSubject,
        experiment: selectedExperiment,
        message: input
      })
    });

    const data = await res.json();

    setMessages(prev => [
      ...prev,
      { role: "assistant", content: data.reply }
    ]);
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
              }`}
            >
              {/* Avatar */}
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

              {/* Message Bubble */}
              <div
                className={`rounded-lg p-4 text-sm leading-relaxed ${
                  msg.role === "assistant"
                    ? "glass-card-strong"
                    : "bg-muted"
                }`}
              >
                {msg.content.split("\n").map((line, j) => (
                  <p key={j} className={j > 0 ? "mt-1" : ""}>
                    {line}
                  </p>
                ))}

                {/* SUBJECT BUTTONS */}
                {stage === "subject" && i === messages.length - 1 && (
                  <div className="flex flex-wrap gap-2 mt-3">
                    {subjects.map((sub) => (
                      <Button
                        key={sub}
                        variant="outline"
                        size="sm"
                        onClick={() => handleSubjectSelect(sub)}
                      >
                        {sub}
                      </Button>
                    ))}
                  </div>
                )}

                {/* EXPERIMENT BUTTONS */}
                {stage === "experiment" && i === messages.length - 1 && (
                  <div className="flex flex-wrap gap-2 mt-3">
                    {experiments.map((exp) => (
                      <Button
                        key={exp}
                        variant="outline"
                        size="sm"
                        onClick={() => handleExperimentSelect(exp)}
                      >
                        {exp}
                      </Button>
                    ))}
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>

        {/* Input */}
        <div className="px-6 pb-6">
          <div className="max-w-3xl mx-auto flex gap-3">
            <input
              type="text"
              value={input}
              disabled={stage !== "chat"}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handleSend()}
              placeholder={
                stage !== "chat"
                  ? "Select subject & experiment first..."
                  : "Ask about your lab experiment..."
              }
              className="flex-1 bg-muted border border-border rounded-lg px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-primary/50"
            />
            <Button
              onClick={handleSend}
              disabled={stage !== "chat"}
              className="bg-primary text-primary-foreground px-4"
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