import { useState } from "react";
import { Save, Download } from "lucide-react";
import { Button } from "@/components/ui/button";
import AppLayout from "@/components/AppLayout";

const sections = [
  { key: "aim", label: "Aim", placeholder: "State the objective of the experiment...", rows: 3 },
  { key: "theory", label: "Theory", placeholder: "Explain the theoretical background...", rows: 5 },
  { key: "algorithm", label: "Algorithm", placeholder: "Step 1: ...\nStep 2: ...\nStep 3: ...", rows: 5 },
  { key: "code", label: "Code", placeholder: "#include <stdio.h>\n\nint main() {\n    // Your code here\n    return 0;\n}", rows: 10, isCode: true },
  { key: "output", label: "Output", placeholder: "Expected output of the program...", rows: 4, isCode: true },
  { key: "conclusion", label: "Conclusion", placeholder: "Summarize findings and observations...", rows: 3 },
];

const LabRecordEditor = () => {
  const [values, setValues] = useState<Record<string, string>>({});

  return (
    <AppLayout>
      <div className="max-w-4xl mx-auto px-6 py-8">
        {/* Header */}
        <div className="flex items-center justify-between mb-8 opacity-0 animate-fade-up">
          <div>
            <p className="font-mono text-[10px] text-muted-foreground tracking-widest uppercase">
              Lab Record Editor
            </p>
            <h1 className="text-2xl font-bold mt-1">Experiment #1 — Bubble Sort</h1>
          </div>
          <div className="flex items-center gap-2">
            <Button variant="outline" size="sm" className="border-border text-foreground hover:bg-muted gap-2">
              <Download className="h-3.5 w-3.5" /> Export
            </Button>
            <Button size="sm" className="bg-primary text-primary-foreground hover:sapphire-glow transition-shadow gap-2">
              <Save className="h-3.5 w-3.5" /> Save
            </Button>
          </div>
        </div>

        {/* Sections */}
        <div className="space-y-4">
          {sections.map((section, i) => (
            <div
              key={section.key}
              className="glass-card overflow-hidden opacity-0 animate-fade-up"
              style={{ animationDelay: `${i * 0.08}s` }}
            >
              <div className="px-5 py-3 border-b border-border flex items-center gap-3">
                <span className="font-mono text-xs text-primary tracking-wider uppercase">
                  {section.label}
                </span>
              </div>
              <textarea
                value={values[section.key] || ""}
                onChange={(e) =>
                  setValues((prev) => ({ ...prev, [section.key]: e.target.value }))
                }
                placeholder={section.placeholder}
                rows={section.rows}
                className={`w-full bg-transparent px-5 py-4 text-sm placeholder:text-muted-foreground/40 focus:outline-none resize-none ${
                  section.isCode ? "font-mono text-xs leading-relaxed" : "leading-relaxed"
                }`}
              />
            </div>
          ))}
        </div>
      </div>
    </AppLayout>
  );
};

export default LabRecordEditor;
