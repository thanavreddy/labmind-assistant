import { FlaskConical, ArrowRight, MessageSquare, ClipboardCheck, FileText, BarChart3, Code2, Users, Eye, Zap, Shield, Check, X, Minus, Plus, ChevronRight } from "lucide-react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { useScrollReveal } from "@/hooks/useScrollReveal";
import { useCountUp } from "@/hooks/useCountUp";
import { useState } from "react";
import { cn } from "@/lib/utils";

/* ─── Scroll-reveal wrapper ─── */
const Reveal = ({ children, className, delay = 0 }: { children: React.ReactNode; className?: string; delay?: number }) => {
  const { ref, visible } = useScrollReveal();
  return (
    <div
      ref={ref}
      className={cn("transition-all duration-700 ease-out", visible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8", className)}
      style={{ transitionDelay: `${delay}ms` }}
    >
      {children}
    </div>
  );
};

/* ─── Stat card with count-up ─── */
const StatCard = ({ value, suffix, scrollTexts, desc }: { value: number; suffix: string; scrollTexts: string[]; desc: string }) => {
  const { ref, visible } = useScrollReveal();
  const count = useCountUp(value, 1400, visible);
  return (
    <div ref={ref} className="p-8 md:p-10 border-r border-b border-border last:border-r-0">
      <p className="text-4xl md:text-5xl font-bold tracking-tight text-foreground">{count}{suffix}</p>
      <div className="h-6 overflow-hidden mt-3 relative">
        <div className={cn("flex gap-4 whitespace-nowrap", visible && "animate-marquee")} style={{ animationDuration: "12s" }}>
          {[...scrollTexts, ...scrollTexts].map((t, i) => (
            <span key={i} className="text-xs font-mono text-primary tracking-wider uppercase">{t}</span>
          ))}
        </div>
      </div>
      <p className="text-sm text-muted-foreground mt-2">{desc}</p>
    </div>
  );
};

/* ─── FAQ Item ─── */
const FaqItem = ({ q, a }: { q: string; a: string }) => {
  const [open, setOpen] = useState(false);
  return (
    <div className="border-b border-border">
      <button onClick={() => setOpen(!open)} className="w-full flex items-center justify-between py-5 text-left group">
        <span className="font-semibold text-foreground pr-4">{q}</span>
        <span className="shrink-0 h-6 w-6 rounded-full border border-border flex items-center justify-center text-muted-foreground group-hover:border-primary group-hover:text-primary transition-colors">
          {open ? <Minus className="h-3.5 w-3.5" /> : <Plus className="h-3.5 w-3.5" />}
        </span>
      </button>
      <div
        className="overflow-hidden transition-all duration-500"
        style={{ maxHeight: open ? "300px" : "0px", opacity: open ? 1 : 0 }}
      >
        <p className="text-sm text-muted-foreground pb-5 leading-relaxed">{a}</p>
      </div>
    </div>
  );
};

/* ─── Marquee items ─── */
const marqueeItems = ["AI Assistant", "Concept Quiz", "Lab Records", "Activity Tracking", "Code Execution", "Professor Dashboard", "Guest Access", "Experiment Guidance"];

/* ─── Benefits data ─── */
const benefits = [
  { icon: MessageSquare, title: "AI Chat Assistant", desc: "Get instant explanations, code walkthroughs, and conceptual clarity from your AI lab partner.", span: 2 },
  { icon: ClipboardCheck, title: "Comprehension Quiz", desc: "Prove you understand before you write. Paste-disabled, concept-first verification.", span: 1 },
  { icon: FileText, title: "Lab Record Editor", desc: "Structured templates with Aim, Theory, Algorithm, Code, Output, and Conclusion sections.", span: 1 },
  { icon: Users, title: "Professor Dashboard", desc: "Track student progress, assign experiments, and review completion stats at a glance.", span: 2 },
  { icon: BarChart3, title: "Activity Tracking", desc: "Monitor experiment progress with status chips and completion rings.", span: 1 },
  { icon: Eye, title: "Guest Mode", desc: "Try LabMind without signing up. Explore the workflow before committing.", span: 1 },
];

/* ─── Comparison data ─── */
const compRows = [
  { label: "AI Support", labmind: true, traditional: false, none: false },
  { label: "Record Drafting", labmind: true, traditional: false, none: false },
  { label: "Plagiarism Prevention", labmind: true, traditional: false, none: false },
  { label: "Professor Tracking", labmind: true, traditional: true, none: false },
  { label: "Guest Access", labmind: true, traditional: false, none: false },
  { label: "Cost", labmind: "Free", traditional: "$$", none: "Free" },
];

/* ─── FAQ data ─── */
const faqs = [
  { q: "What is LabMind?", a: "LabMind is an AI-powered lab completion system that guides college students through a 3-step workflow: Learn with AI, verify understanding through quizzes, and generate structured lab records." },
  { q: "Is LabMind free to use?", a: "Yes, LabMind is completely free for students. Guest access is also available so you can explore the platform without creating an account." },
  { q: "Does LabMind write my lab record for me?", a: "No. LabMind ensures you understand the concepts first through a comprehension quiz (with paste disabled). Only after you prove understanding does it help you draft a structured record." },
  { q: "Can professors track student progress?", a: "Yes. The Professor Dashboard shows completion stats, experiment status, and allows professors to assign experiments to students." },
  { q: "What subjects does LabMind support?", a: "LabMind currently supports Data Structures, Operating Systems, and Database Systems labs, with more courses being added regularly." },
  { q: "How does the AI assistant work?", a: "The AI assistant explains concepts step-by-step, provides code walkthroughs, and answers questions about your current experiment. It's like having a teaching assistant available 24/7." },
];

const Landing = () => {
  return (
    <div className="min-h-screen bg-background overflow-x-hidden">
      {/* ═══ Navbar ═══ */}
      <nav className="fixed top-0 inset-x-0 z-50 border-b border-border bg-background/80 backdrop-blur-xl">
        <div className="max-w-6xl mx-auto px-6 h-16 flex items-center justify-between">
          <Link to="/" className="flex items-center gap-2.5">
            <FlaskConical className="h-5 w-5 text-primary" />
            <span className="text-lg font-bold tracking-tight">LabMind</span>
          </Link>
          <div className="hidden md:flex items-center gap-8">
            <a href="#stats" className="text-sm text-muted-foreground hover:text-foreground transition-colors">Achievements</a>
            <a href="#benefits" className="text-sm text-muted-foreground hover:text-foreground transition-colors">Benefits</a>
            <a href="#compare" className="text-sm text-muted-foreground hover:text-foreground transition-colors">Compare</a>
            <a href="#faq" className="text-sm text-muted-foreground hover:text-foreground transition-colors">FAQs</a>
          </div>
          <div className="flex items-center gap-3">
            <Link to="/dashboard">
              <Button size="sm" className="bg-primary text-primary-foreground hover:sapphire-glow transition-shadow">
                Get Started <ChevronRight className="h-3.5 w-3.5" />
              </Button>
            </Link>
          </div>
        </div>
      </nav>

      {/* ═══ Hero ═══ */}
      <section className="pt-32 pb-20 max-w-6xl mx-auto px-6 text-center">
        <Reveal>
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-border bg-card mb-8">
            <div className="h-2 w-2 rounded-full bg-green-500 animate-pulse" />
            <span className="font-mono text-xs text-muted-foreground tracking-wider">Available for Students</span>
          </div>
        </Reveal>

        <div className="max-w-4xl mx-auto">
          {["A Guided AI Lab", "Companion for Students"].map((line, i) => (
            <Reveal key={i} delay={i * 120}>
              <h1 className="text-5xl sm:text-6xl md:text-7xl font-bold tracking-tight leading-[1.08]">
                {line.split(" ").map((word, j) => (
                  <span
                    key={j}
                    className={cn("inline-block mr-[0.3em] opacity-0 animate-fade-up", word === "AI" && "text-primary")}
                    style={{ animationDelay: `${(i * 4 + j) * 80 + 200}ms`, animationFillMode: "forwards" }}
                  >
                    {word}
                  </span>
                ))}
              </h1>
            </Reveal>
          ))}
        </div>

        <Reveal delay={500}>
          <p className="text-lg text-muted-foreground max-w-xl mx-auto mt-8 leading-relaxed">
            Complete lab experiments with AI guidance. Learn concepts, verify understanding, and generate structured lab records — all in one intelligent workflow.
          </p>
        </Reveal>

        <Reveal delay={600}>
          <div className="flex items-center justify-center gap-4 mt-10">
            <Link to="/assistant">
              <Button size="lg" className="bg-primary text-primary-foreground hover:sapphire-glow transition-shadow gap-2">
                Start Lab Session <ArrowRight className="h-4 w-4" />
              </Button>
            </Link>
            <Link to="/dashboard">
              <Button size="lg" variant="outline" className="border-border text-foreground hover:bg-muted">
                View Dashboard
              </Button>
            </Link>
          </div>
        </Reveal>

        <Reveal delay={750}>
          <div className="flex flex-wrap items-center justify-center gap-3 mt-10">
            {[
              { icon: Zap, label: "Instant AI Help" },
              { icon: FileText, label: "Smart Record Editor" },
              { icon: Users, label: "Professor Dashboard" },
            ].map((pill) => (
              <div key={pill.label} className="flex items-center gap-2 px-4 py-2 rounded-full border border-border bg-card text-sm text-muted-foreground">
                <pill.icon className="h-3.5 w-3.5 text-primary" />
                {pill.label}
              </div>
            ))}
          </div>
        </Reveal>
      </section>

      {/* ═══ Marquee ═══ */}
      <div className="border-y border-border bg-card py-4 overflow-hidden">
        <div className="flex animate-marquee whitespace-nowrap">
          {[...marqueeItems, ...marqueeItems].map((item, i) => (
            <span key={i} className="flex items-center gap-4 mx-4 text-sm font-medium text-muted-foreground">
              {item}
              <span className="text-primary">◆</span>
            </span>
          ))}
        </div>
      </div>

      {/* ═══ Stats ═══ */}
      <section id="stats" className="max-w-6xl mx-auto px-6 py-24">
        <Reveal>
          <div className="border border-border rounded-lg overflow-hidden grid md:grid-cols-3">
            <StatCard value={500} suffix="+" scrollTexts={["Data Structures", "Operating Systems", "Database Systems", "Algorithms"]} desc="Students guided through lab experiments with AI assistance" />
            <StatCard value={3} suffix="-Step" scrollTexts={["Learn", "Verify", "Record", "Complete"]} desc="Streamlined workflow from concept to completion" />
            <StatCard value={48} suffix="hr" scrollTexts={["Fast", "Efficient", "Structured", "Complete"]} desc="Average lab completion time with LabMind guidance" />
          </div>
        </Reveal>
      </section>

      {/* ═══ Benefits Bento ═══ */}
      <section id="benefits" className="max-w-6xl mx-auto px-6 pb-24">
        <Reveal>
          <h2 className="text-3xl md:text-4xl font-bold tracking-tight text-center mb-4">Benefits of LabMind</h2>
          <p className="text-muted-foreground text-center max-w-lg mx-auto mb-12">Why settle for less? Here's why LabMind is the game-changer your lab work needs.</p>
        </Reveal>
        <div className="grid md:grid-cols-3 gap-4">
          {benefits.map((b, i) => (
            <Reveal key={b.title} delay={i * 80} className={b.span === 2 ? "md:col-span-2" : ""}>
              <div className="h-full p-6 rounded-lg border border-border bg-card hover:-translate-y-1 hover:border-primary/50 transition-all duration-300 group">
                <div className="h-10 w-10 rounded-lg bg-primary/10 flex items-center justify-center mb-4 group-hover:bg-primary/20 transition-colors">
                  <b.icon className="h-5 w-5 text-primary" />
                </div>
                <h3 className="font-semibold text-foreground mb-2">{b.title}</h3>
                <p className="text-sm text-muted-foreground leading-relaxed">{b.desc}</p>
              </div>
            </Reveal>
          ))}
        </div>
      </section>

      {/* ═══ How It Works ═══ */}
      <section className="max-w-6xl mx-auto px-6 pb-24">
        <Reveal>
          <h2 className="text-3xl md:text-4xl font-bold tracking-tight text-center mb-4">How Simple It Is</h2>
          <p className="text-muted-foreground text-center max-w-lg mx-auto mb-12">Three steps. That's all it takes to go from confused to confident.</p>
        </Reveal>
        <Reveal>
          <div className="border border-border rounded-lg overflow-hidden grid md:grid-cols-3">
            {[
              { step: "01", title: "Learn with AI", desc: "Ask your AI assistant any concept question. Get clear, structured explanations with code examples." },
              { step: "02", title: "Prove You Understand", desc: "Complete a short comprehension quiz. No pasting allowed — demonstrate genuine understanding." },
              { step: "03", title: "Draft Your Record", desc: "Generate a structured lab record with all sections: Aim, Theory, Algorithm, Code, Output, Conclusion." },
            ].map((s, i) => (
              <div key={s.step} className={cn("p-8 md:p-10", i < 2 && "border-r border-border")}>
                <span className="font-mono text-xs text-primary tracking-widest">Step {s.step}</span>
                <h3 className="text-xl font-semibold mt-3 mb-3">{s.title}</h3>
                <p className="text-sm text-muted-foreground leading-relaxed">{s.desc}</p>
              </div>
            ))}
          </div>
        </Reveal>
      </section>

      {/* ═══ Comparison Table ═══ */}
      <section id="compare" className="max-w-6xl mx-auto px-6 pb-24">
        <Reveal>
          <h2 className="text-3xl md:text-4xl font-bold tracking-tight text-center mb-4">Why Choose LabMind?</h2>
          <p className="text-muted-foreground text-center max-w-lg mx-auto mb-12">See how LabMind stacks up against traditional methods.</p>
        </Reveal>
        <Reveal>
          <div className="border border-border rounded-lg overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-border">
                  <th className="text-left p-4 font-medium text-muted-foreground" />
                  <th className="p-4 font-semibold text-primary bg-primary/5">LabMind</th>
                  <th className="p-4 font-medium text-muted-foreground">Traditional Lab</th>
                  <th className="p-4 font-medium text-muted-foreground">No Tool</th>
                </tr>
              </thead>
              <tbody>
                {compRows.map((row) => (
                  <tr key={row.label} className="border-b border-border last:border-b-0">
                    <td className="p-4 font-medium text-foreground">{row.label}</td>
                    {[row.labmind, row.traditional, row.none].map((val, i) => (
                      <td key={i} className={cn("p-4 text-center", i === 0 && "bg-primary/5")}>
                        {typeof val === "boolean" ? (
                          val ? <Check className="h-4 w-4 text-primary mx-auto" /> : <X className="h-4 w-4 text-muted-foreground/40 mx-auto" />
                        ) : (
                          <span className={i === 0 ? "text-primary font-semibold" : "text-muted-foreground"}>{val}</span>
                        )}
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Reveal>
      </section>

      {/* ═══ FAQ ═══ */}
      <section id="faq" className="max-w-3xl mx-auto px-6 pb-24">
        <Reveal>
          <h2 className="text-3xl md:text-4xl font-bold tracking-tight text-center mb-4">Frequently Asked Questions</h2>
          <p className="text-muted-foreground text-center max-w-md mx-auto mb-12">Got questions? We've got answers.</p>
        </Reveal>
        <Reveal>
          <div className="border border-border rounded-lg px-6">
            {faqs.map((faq) => (
              <FaqItem key={faq.q} q={faq.q} a={faq.a} />
            ))}
          </div>
        </Reveal>
      </section>

      {/* ═══ CTA Banner ═══ */}
      <section className="max-w-6xl mx-auto px-6 pb-24">
        <Reveal>
          <div className="rounded-2xl border border-border bg-card p-12 md:p-16 text-center">
            <h2 className="text-3xl md:text-5xl font-bold tracking-tight leading-tight mb-6">
              If you made it here,<br />your lab record is <span className="text-primary">overdue.</span>
            </h2>
            <p className="text-muted-foreground max-w-md mx-auto mb-10">
              Stop procrastinating. Start your lab session now and have your record ready before the deadline.
            </p>
            <div className="flex items-center justify-center gap-4">
              <Link to="/assistant">
                <Button size="lg" className="bg-primary text-primary-foreground hover:sapphire-glow transition-shadow gap-2">
                  Start Now <ArrowRight className="h-4 w-4" />
                </Button>
              </Link>
              <Link to="/dashboard">
                <Button size="lg" variant="outline" className="border-border text-foreground hover:bg-muted">
                  Guest Access
                </Button>
              </Link>
            </div>
          </div>
        </Reveal>
      </section>

      {/* ═══ Footer ═══ */}
      <footer className="border-t border-border">
        <div className="max-w-6xl mx-auto px-6 py-6 flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <FlaskConical className="h-4 w-4 text-primary" />
            <span className="text-sm font-semibold">LabMind</span>
          </div>
          <p className="text-xs text-muted-foreground">© 2026 LabMind. All rights reserved.</p>
          <div className="flex items-center gap-6">
            <Link to="/assistant" className="text-xs text-muted-foreground hover:text-foreground transition-colors">AI Assistant</Link>
            <Link to="/dashboard" className="text-xs text-muted-foreground hover:text-foreground transition-colors">Dashboard</Link>
            <Link to="/professor" className="text-xs text-muted-foreground hover:text-foreground transition-colors">Professor</Link>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Landing;
