import { useState, useEffect } from "react";
import { Save, Download, AlertCircle, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Alert, AlertDescription } from "@/components/ui/alert";
import AppLayout from "@/components/AppLayout";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/lib/supabase";
import jsPDF from "jspdf";
import html2canvas from "html2canvas";
import { toast } from "sonner";

const sections = [
  { key: "aim", label: "Aim", placeholder: "State the objective of the experiment...", rows: 3 },
  { key: "theory", label: "Theory", placeholder: "Explain the theoretical background...", rows: 5 },
  { key: "algorithm", label: "Algorithm", placeholder: "Step 1: ...\nStep 2: ...\nStep 3: ...", rows: 5 },
  { key: "code", label: "Code", placeholder: "#include <stdio.h>\n\nint main() {\n    // Your code here\n    return 0;\n}", rows: 10, isCode: true },
  { key: "output", label: "Output", placeholder: "Expected output of the program...", rows: 4, isCode: true },
  { key: "conclusion", label: "Conclusion", placeholder: "Summarize findings and observations...", rows: 3 },
];

const LabRecordEditor = () => {
  const { user } = useAuth();
  const [title, setTitle] = useState<string>("");
  const [values, setValues] = useState<Record<string, string>>({});
  const [isSaving, setIsSaving] = useState(false);
  const [isExporting, setIsExporting] = useState(false);
  const [error, setError] = useState<string>("");

  // Validate title
  const isValid = title.trim().length > 0;

  // Handle PDF Export
  const handleExport = async () => {
    if (!isValid) {
      setError("Please enter a record title before exporting");
      return;
    }

    try {
      setIsExporting(true);
      setError("");

      // Create a temporary container for PDF content
      const element = document.createElement("div");
      element.style.padding = "40px";
      element.style.backgroundColor = "white";
      element.style.fontFamily = "Arial, sans-serif";
      element.style.color = "#000000";
      element.style.lineHeight = "1.6";

      // Add title
      const titleElement = document.createElement("h1");
      titleElement.textContent = title;
      titleElement.style.fontSize = "16pt";
      titleElement.style.fontWeight = "bold";
      titleElement.style.marginBottom = "30px";
      titleElement.style.textAlign = "center";
      titleElement.style.color = "#000000";
      titleElement.style.fontFamily = "Arial, sans-serif";
      element.appendChild(titleElement);

      // Add timestamp
      const dateElement = document.createElement("p");
      dateElement.textContent = `Date: ${new Date().toLocaleDateString()}`;
      dateElement.style.fontSize = "12pt";
      dateElement.style.marginBottom = "30px";
      dateElement.style.color = "#000000";
      dateElement.style.fontFamily = "Arial, sans-serif";
      element.appendChild(dateElement);

      // Add content sections
      sections.forEach((section) => {
        const sectionTitle = document.createElement("h2");
        sectionTitle.textContent = section.label;
        sectionTitle.style.fontSize = "14pt";
        sectionTitle.style.fontWeight = "bold";
        sectionTitle.style.marginTop = "20px";
        sectionTitle.style.marginBottom = "10px";
        sectionTitle.style.borderBottom = "2px solid #000000";
        sectionTitle.style.paddingBottom = "5px";
        sectionTitle.style.color = "#000000";
        sectionTitle.style.fontFamily = "Arial, sans-serif";
        element.appendChild(sectionTitle);

        const content = document.createElement("div");
        content.textContent = values[section.key] || "(Not filled)";
        content.style.fontSize = "12pt";
        content.style.fontFamily = section.isCode ? "Courier New, monospace" : "Arial, sans-serif";
        content.style.whiteSpace = "pre-wrap";
        content.style.wordWrap = "break-word";
        content.style.marginBottom = "15px";
        content.style.padding = "10px";
        content.style.backgroundColor = "#ffffff";
        content.style.color = "#000000";
        content.style.border = "1px solid #e0e0e0";
        content.style.borderRadius = "4px";
        content.style.lineHeight = "1.5";
        element.appendChild(content);
      });

      document.body.appendChild(element);

      // Convert to canvas and PDF
      const canvas = await html2canvas(element, {
        scale: 2,
        useCORS: true,
        backgroundColor: "#ffffff",
        logging: false,
      });

      const imgData = canvas.toDataURL("image/png");
      const pdf = new jsPDF({
        orientation: "portrait",
        unit: "mm",
        format: "a4",
      });

      const pdfWidth = pdf.internal.pageSize.getWidth();
      const pdfHeight = pdf.internal.pageSize.getHeight();
      const imgWidth = pdfWidth - 20; // 10mm margins
      const imgHeight = (canvas.height * imgWidth) / canvas.width;

      let yOffset = 10;

      // Add image to PDF with pagination
      let heightLeft = imgHeight;
      while (heightLeft > 0) {
        pdf.addImage(imgData, "PNG", 10, yOffset, imgWidth, imgHeight);
        heightLeft -= pdfHeight - 20;
        if (heightLeft > 0) {
          pdf.addPage();
          yOffset = -imgHeight + pdfHeight - 20;
        }
      }

      // Download PDF
      pdf.save(`${title.replace(/\s+/g, "_")}_lab_record.pdf`);

      document.body.removeChild(element);
      toast.success("Record exported as PDF successfully!");
    } catch (err) {
      console.error("Export error:", err);
      setError("Failed to export PDF. Please try again.");
      toast.error("Failed to export PDF");
    } finally {
      setIsExporting(false);
    }
  };

  // Handle Save to Database
  const handleSave = async () => {
    if (!isValid) {
      setError("Please enter a record title");
      return;
    }

    if (!user?.id) {
      setError("User not authenticated");
      return;
    }

    try {
      setIsSaving(true);
      setError("");

      // Combine all values into a single content field
      const content = sections.map((section) => {
        return `## ${section.label}\n${values[section.key] || ""}`;
      }).join("\n\n");

      // Save to Supabase
      const { error: saveError } = await supabase
        .from("experiments")
        .insert([
          {
            title: title,
            description: content,
            course_id: user.id, // Using user.id as placeholder, should be actual course_id
            created_at: new Date().toISOString(),
          },
        ]);

      if (saveError) {
        throw saveError;
      }

      toast.success("Lab record saved successfully!");
      // Clear form after saving
      setTitle("");
      setValues({});
    } catch (err) {
      console.error("Save error:", err);
      setError("Failed to save the record. Please try again.");
      toast.error("Failed to save record");
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <AppLayout>
      <div className="max-w-4xl mx-auto px-6 py-8">
        {/* Header */}
        <div className="flex items-center justify-between mb-8 opacity-0 animate-fade-up">
          <div className="flex-1">
            <p className="font-mono text-[10px] text-muted-foreground tracking-widest uppercase">
              Lab Record Editor
            </p>
            <div className="flex items-center gap-3 mt-3">
              <Input
                type="text"
                placeholder="Enter record title (e.g., Bubble Sort Implementation)"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className="text-2xl font-bold h-auto py-2 border-0 bg-transparent focus-visible:ring-1 focus-visible:ring-primary px-0"
              />
            </div>
            {!isValid && (
              <p className="text-xs text-amber-600 mt-2">Record title is required</p>
            )}
          </div>
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={handleExport}
              disabled={!isValid || isExporting}
              className="border-border text-foreground hover:bg-muted gap-2"
            >
              {isExporting ? (
                <Loader2 className="h-3.5 w-3.5 animate-spin" />
              ) : (
                <Download className="h-3.5 w-3.5" />
              )}
              Export
            </Button>
            <Button
              size="sm"
              onClick={handleSave}
              disabled={!isValid || isSaving}
              className="bg-primary text-primary-foreground hover:sapphire-glow transition-shadow gap-2"
            >
              {isSaving ? (
                <Loader2 className="h-3.5 w-3.5 animate-spin" />
              ) : (
                <Save className="h-3.5 w-3.5" />
              )}
              Save
            </Button>
          </div>
        </div>

        {/* Error Alert */}
        {error && (
          <Alert variant="destructive" className="mb-6 opacity-0 animate-fade-up">
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}

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
