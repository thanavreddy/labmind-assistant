import { useState } from "react";
import { CheckCircle, AlertCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import AppLayout from "@/components/AppLayout";

const questions = [
  {
    id: 1,
    question: "What is the time complexity of Bubble Sort in the worst case?",
    hint: "Think about nested iterations over the array.",
  },
  {
    id: 2,
    question: "Explain the difference between a stable and unstable sorting algorithm.",
    hint: "Consider what happens to equal elements.",
  },
  {
    id: 3,
    question: "What data structure does BFS use internally?",
    hint: "FIFO ordering is key.",
  },
  {
    id: 4,
    question: "Write the recurrence relation for Merge Sort.",
    hint: "Divide the problem into two halves.",
  },
  {
    id: 5,
    question: "What is the purpose of a hash function in a hash table?",
    hint: "Mapping keys to indices.",
  },
];

const ConceptCheck = () => {
  const [answers, setAnswers] = useState<Record<number, string>>({});
  const [submitted, setSubmitted] = useState(false);
  const answered = Object.keys(answers).filter((k) => answers[Number(k)]?.trim()).length;
  const progress = (answered / questions.length) * 100;

  return (
    <AppLayout>
      <div className="max-w-3xl mx-auto px-6 py-8">
        {/* Progress */}
        <div className="mb-8 opacity-0 animate-fade-up">
          <div className="flex items-center justify-between mb-2">
            <span className="font-mono text-[10px] text-muted-foreground tracking-widest uppercase">
              Concept Verification
            </span>
            <span className="font-mono text-xs text-muted-foreground">
              {answered}/{questions.length} answered
            </span>
          </div>
          <div className="h-1.5 bg-muted rounded-full overflow-hidden">
            <div
              className="h-full bg-primary rounded-full transition-all duration-500 ease-out"
              style={{ width: `${progress}%` }}
            />
          </div>
        </div>

        {/* Questions */}
        <div className="space-y-4">
          {questions.map((q, i) => (
            <div
              key={q.id}
              className={`glass-card p-6 opacity-0 animate-fade-up`}
              style={{ animationDelay: `${i * 0.1}s` }}
            >
              <div className="flex items-start justify-between gap-4 mb-4">
                <div>
                  <span className="font-mono text-xs text-primary">{`Q${q.id}`}</span>
                  <h3 className="text-sm font-medium mt-1">{q.question}</h3>
                </div>
                {submitted && answers[q.id]?.trim() && (
                  <CheckCircle className="h-5 w-5 text-emerald-400 shrink-0" />
                )}
              </div>
              <textarea
                value={answers[q.id] || ""}
                onChange={(e) =>
                  setAnswers((prev) => ({ ...prev, [q.id]: e.target.value }))
                }
                onPaste={(e) => e.preventDefault()}
                placeholder="Type your answer here (paste disabled)..."
                rows={3}
                disabled={submitted}
                className="w-full bg-background/50 border border-border rounded-lg px-4 py-3 text-sm font-mono placeholder:text-muted-foreground/50 focus:outline-none focus:ring-2 focus:ring-primary/50 transition-shadow resize-none"
              />
              <div className="flex items-center gap-2 mt-2">
                <AlertCircle className="h-3 w-3 text-muted-foreground" />
                <span className="text-[11px] text-muted-foreground">{q.hint}</span>
              </div>
              <div className="flex items-center gap-2 mt-2">
                <div className="h-1 w-1 rounded-full bg-destructive/50" />
                <span className="font-mono text-[10px] text-destructive/70">Paste disabled</span>
              </div>
            </div>
          ))}
        </div>

        {/* Submit */}
        <div className="mt-8 flex justify-end opacity-0 animate-fade-up animate-stagger-5">
          <Button
            onClick={() => setSubmitted(true)}
            disabled={answered < questions.length || submitted}
            className="bg-primary text-primary-foreground hover:sapphire-glow transition-shadow"
          >
            {submitted ? "Submitted ✓" : "Submit Answers"}
          </Button>
        </div>
      </div>
    </AppLayout>
  );
};

export default ConceptCheck;
