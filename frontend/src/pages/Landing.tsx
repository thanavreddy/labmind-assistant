import { FlaskConical, ArrowRight, MessageSquare, ClipboardCheck, FileText, BarChart3, Users, Eye, Zap, Check, X, Minus, Plus } from "lucide-react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { useScrollReveal } from "@/hooks/useScrollReveal";
import { useCountUp } from "@/hooks/useCountUp";
import { useState, useEffect } from "react";
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
        className="overflow-hidden"
        style={{
          maxHeight: open ? "500px" : "0px",
          opacity: open ? 1 : 0,
          transition: "all 500ms cubic-bezier(0.4, 0, 0.2, 1)",
        }}
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
  // { label: "Cost", labmind: "Free", traditional: "$$", none: "Free" },
];

/* ─── FAQ data ─── */
const faqs = [
  { q: "What is LabMind?", a: "LabMind is an AI-powered lab completion system that guides college students through a 3-step workflow: Learn with AI, verify understanding through quizzes, and generate structured lab records." },
  { q: "Is LabMind free to use?", a: "Yes, LabMind is completely free for students. Guest access is also available so you can explore the platform without creating an account." },
  { q: "Does LabMind write my lab record for me?", a: "No. LabMind ensures you understand the concepts first through a comprehension quiz (with paste disabled). Only after you prove understanding does it help you draft a structured record." },
  { q: "Can professors track student progress?", a: "Yes. The Professor Dashboard shows completion stats, experiment status, and allows professors to assign experiments to students." },
  { q: "What subjects does LabMind support?", a: "LabMind currently supports Data Structures, Operating Systems, and Database Systems labs, with more courses being added regularly." },
  { q: "How does the AI assistant work?", a: "The AI assistant explains concepts step-by-step, provides code walkthroughs, and answers questions about your current experiment. It's like having a teaching assistant  24/7." },
];

const Landing = () => {
  useEffect(() => {
    document.documentElement.style.scrollBehavior = "smooth";
    return () => {
      document.documentElement.style.scrollBehavior = "auto";
    };
  }, []);

  return (
    <div className="min-h-screen bg-background overflow-x-hidden py-16">
      {/* ═══ Navbar ═══ */}
      <nav className="fixed top-0 inset-x-0 z-50 border-b border-border/50 bg-background/90 backdrop-blur-md">
        <div className="max-w-6xl mx-auto px-6 h-16 flex items-center justify-between">
          <Link to="/" className="flex items-center gap-2.5 hover:opacity-80 transition-opacity">
            <FlaskConical className="h-5 w-5 text-primary" />
            <span className="text-lg font-bold tracking-tight text-foreground">LabMind</span>
          </Link>
          <div className="hidden md:flex items-center gap-8">
            <a href="#features" className="text-sm text-muted-foreground hover:text-foreground transition-colors">Features</a>
            <a href="#stats" className="text-sm text-muted-foreground hover:text-foreground transition-colors">Impact</a>
            <a href="#faq" className="text-sm text-muted-foreground hover:text-foreground transition-colors">FAQs</a>
          </div>
          <div className="flex items-center gap-3">
            <Link to="/login">
              <Button size="sm" variant="ghost" className="text-muted-foreground hover:text-foreground">
                Login
              </Button>
            </Link>
            <Link to="/dashboard">
              <Button size="sm" className="bg-primary text-primary-foreground hover:bg-primary/90 transition-colors">
                Get Started
              </Button>
            </Link>
          </div>
        </div>
      </nav>

      {/* ═══ Hero ═══ */}
      <section className="pt-32 pb-20 px-6 text-center relative overflow-hidden">
        {/* Gradient background */}
        <div className="absolute inset-0 bg-gradient-to-b from-primary/5 to-transparent pointer-events-none" />
        
        <div className="max-w-4xl mx-auto relative">
          <Reveal>
            <h1 className="text-5xl sm:text-6xl md:text-7xl font-bold tracking-tight leading-[1.08] text-foreground">
              Lab Work,{" "}
              <span className="text-primary">Simplified.</span>
            </h1>
          </Reveal>

          <Reveal delay={120}>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto mt-8 leading-relaxed">
              Manage experiments, track progress, and streamline lab workflows — all in one place. 
              Built for students and faculty to work smarter.
            </p>
          </Reveal>

          <Reveal delay={240}>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mt-12">
              <Link to="/dashboard">
                <Button size="lg" className="bg-primary text-primary-foreground hover:bg-primary/90 transition-colors gap-2">
                  Get Started <ArrowRight className="h-4 w-4" />
                </Button>
              </Link>
              <Link to="/login">
                <Button size="lg" variant="outline" className="border-border hover:bg-muted hover:border-border/50 transition-all">
                  Login
                </Button>
              </Link>
            </div>
          </Reveal>

          <Reveal delay={360}>
            <div className="flex flex-wrap items-center justify-center gap-3 mt-12">
              {[
                { icon: Zap, label: "AI Guidance" },
                { icon: ClipboardCheck, label: "Experiment Tracking" },
                { icon: Users, label: "Faculty Tools" },
              ].map((pill) => (
                <div key={pill.label} className="flex items-center gap-2 px-4 py-2 rounded-full border border-border/50 bg-muted/20 text-sm text-muted-foreground hover:border-border/80 transition-all">
                  <pill.icon className="h-3.5 w-3.5 text-primary" />
                  {pill.label}
                </div>
              ))}
            </div>
          </Reveal>
        </div>
      </section>

      {/* ═══ Marquee ═══ */}
      <div className="border-y border-border/50 bg-muted/10 py-6 overflow-hidden">
        <div className="flex animate-marquee whitespace-nowrap">
          {[...marqueeItems, ...marqueeItems].map((item, i) => (
            <span key={i} className="flex items-center gap-4 mx-6 text-sm font-medium text-muted-foreground">
              {item}
              <span className="text-primary/50">◆</span>
            </span>
          ))}
        </div>
      </div>

      {/* ═══ Stats ═══ */}
      <section id="stats" className="py-16 md:py-24 px-6 bg-gradient-to-b from-transparent via-muted/5 to-transparent">
        <div className="max-w-6xl mx-auto">
          <Reveal>
            <h2 className="text-3xl md:text-4xl font-bold tracking-tight text-center mb-4 text-foreground">Impact & Stats</h2>
            <p className="text-muted-foreground text-center max-w-lg mx-auto mb-12">See how LabMind is transforming the lab experience.</p>
          </Reveal>
          <Reveal>
            <div className="border border-border/50 rounded-lg overflow-hidden grid md:grid-cols-3 bg-muted/5 backdrop-blur-sm">
              <StatCard value={500} suffix="+" scrollTexts={["Students", "Guided", "Experiments", "Completed"]} desc="Students completing labs with LabMind" />
              <StatCard value={3} suffix="-Step" scrollTexts={["Learn", "Verify", "Record"]} desc="Clear workflow from start to finish" />
              <StatCard value={48} suffix="hr" scrollTexts={["Average", "Lab Time", "Streamlined"]} desc="Typical lab completion time" />
            </div>
          </Reveal>
        </div>
      </section>

      {/* ═══ Benefits Bento ═══ */}
      <section id="features" className="py-16 md:py-24 px-6">
        <div className="max-w-6xl mx-auto">
          <Reveal>
            <h2 className="text-3xl md:text-4xl font-bold tracking-tight text-center mb-4 text-foreground">Track Your Lab Progress</h2>
            <p className="text-muted-foreground text-center max-w-lg mx-auto mb-12">Everything you need to manage experiments and stay on track.</p>
          </Reveal>
          <div className="grid md:grid-cols-3 gap-4">
            {benefits.map((b, i) => (
              <Reveal key={b.title} delay={i * 80} className={b.span === 2 ? "md:col-span-2" : ""}>
                <div className="h-full p-6 rounded-lg border border-border/50 bg-muted/5 hover:bg-muted/10 hover:border-border/80 hover:scale-[1.02] transition-all duration-300 group backdrop-blur-sm">
                  <div className="h-10 w-10 rounded-lg bg-primary/10 flex items-center justify-center mb-4 group-hover:bg-primary/20 transition-colors">
                    <b.icon className="h-5 w-5 text-primary" />
                  </div>
                  <h3 className="font-semibold text-foreground mb-2">{b.title}</h3>
                  <p className="text-sm text-muted-foreground leading-relaxed">{b.desc}</p>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* ═══ How It Works ═══ */}
      <section className="py-16 md:py-24 px-6 bg-gradient-to-b from-muted/5 to-transparent">
        <div className="max-w-6xl mx-auto">
          <Reveal>
            <h2 className="text-3xl md:text-4xl font-bold tracking-tight text-center mb-4 text-foreground">Guided Experiments</h2>
            <p className="text-muted-foreground text-center max-w-lg mx-auto mb-12">Three simple steps to complete your lab work with confidence.</p>
          </Reveal>
          <Reveal>
            <div className="border border-border/50 rounded-lg overflow-hidden grid md:grid-cols-3 bg-muted/5 backdrop-blur-sm">
              {[
                { step: "01", title: "Learn with AI", desc: "Get clear explanations with code examples tailored to your experiment." },
                { step: "02", title: "Verify Understanding", desc: "Complete a quiz to demonstrate genuine understanding before proceeding." },
                { step: "03", title: "Draft Your Record", desc: "Generate a structured lab record with all required sections pre-formatted." },
              ].map((s, i) => (
                <div key={s.step} className={cn("p-8 md:p-10", i < 2 && "border-r border-border/50")}>
                  <span className="font-mono text-xs text-primary tracking-widest uppercase">Step {s.step}</span>
                  <h3 className="text-xl font-semibold mt-3 mb-3 text-foreground">{s.title}</h3>
                  <p className="text-sm text-muted-foreground leading-relaxed">{s.desc}</p>
                </div>
              ))}
            </div>
          </Reveal>
        </div>
      </section>

      {/* ═══ Comparison Table ═══ */}
      <section className="py-16 md:py-24 px-6">
        <div className="max-w-6xl mx-auto">
          <Reveal>
            <h2 className="text-3xl md:text-4xl font-bold tracking-tight text-center mb-4 text-foreground">Faculty Insights & Evaluation</h2>
            <p className="text-muted-foreground text-center max-w-lg mx-auto mb-12">Tools designed to help faculty manage and evaluate student work.</p>
          </Reveal>
          <Reveal>
            <div className="border border-border/50 rounded-lg overflow-x-auto bg-muted/5 backdrop-blur-sm">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-border/50 bg-muted/10">
                    <th className="text-left p-4 font-medium text-muted-foreground" />
                    <th className="p-4 font-semibold text-primary">LabMind</th>
                    <th className="p-4 font-medium text-muted-foreground">Traditional Lab</th>
                    <th className="p-4 font-medium text-muted-foreground">Manual Tracking</th>
                  </tr>
                </thead>
                <tbody>
                  {compRows.map((row) => (
                    <tr key={row.label} className="border-b border-border/50 last:border-b-0 hover:bg-muted/10 transition-colors">
                      <td className="p-4 font-medium text-foreground">{row.label}</td>
                      {[row.labmind, row.traditional, row.none].map((val, i) => (
                        <td key={i} className={cn("p-4 text-center", i === 0 && "bg-primary/10")}>
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
        </div>
      </section>

      {/* ═══ FAQ ═══ */}
      <section id="faq" className="py-16 md:py-24 px-6 bg-gradient-to-b from-transparent via-muted/5 to-transparent">
        <div className="max-w-3xl mx-auto">
          <Reveal>
            <h2 className="text-3xl md:text-4xl font-bold tracking-tight text-center mb-4 text-foreground">Common Questions</h2>
            <p className="text-muted-foreground text-center max-w-md mx-auto mb-12">Find answers to questions about LabMind.</p>
          </Reveal>
          <Reveal>
            <div className="border border-border/50 rounded-lg px-6 bg-muted/5 backdrop-blur-sm">
              {faqs.map((faq) => (
                <FaqItem key={faq.q} q={faq.q} a={faq.a} />
              ))}
            </div>
          </Reveal>
        </div>
      </section>

      {/* ═══ CTA Banner ═══ */}
      <section className="py-16 md:py-24 px-6">
        <div className="max-w-6xl mx-auto">
          <Reveal>
            <div className="rounded-2xl border border-border/50 bg-gradient-to-b from-muted/10 to-muted/5 backdrop-blur-sm p-12 md:p-16 text-center">
              <h2 className="text-3xl md:text-4xl font-bold tracking-tight text-foreground mb-4">
                Ready to simplify your lab workflow?
              </h2>
              <p className="text-muted-foreground max-w-md mx-auto mb-10 text-lg">
                Get started today. Complete your next lab with confidence and clarity.
              </p>
              <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                <Link to="/dashboard">
                  <Button size="lg" className="bg-primary text-primary-foreground hover:bg-primary/90 transition-colors gap-2">
                    Get Started <ArrowRight className="h-4 w-4" />
                  </Button>
                </Link>
                <Link to="/login">
                  <Button size="lg" variant="outline" className="border-border/50 hover:bg-muted hover:border-border transition-all">
                    Login
                  </Button>
                </Link>
              </div>
            </div>
          </Reveal>
        </div>
      </section>
      
      {/* ═══ Footer ═══ */}
      <footer className="border-t border-border/50 bg-muted/5">
        <div className="max-w-6xl mx-auto px-6 py-8 flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <FlaskConical className="h-4 w-4 text-primary" />
            <span className="text-sm font-semibold text-foreground">LabMind</span>
          </div>
          <p className="text-xs text-muted-foreground">© 2026 LabMind. Streamline your lab work.</p>
          <div className="flex items-center gap-6">
            <Link to="/dashboard" className="text-xs text-muted-foreground hover:text-foreground transition-colors">Dashboard</Link>
            <Link to="/profile" className="text-xs text-muted-foreground hover:text-foreground transition-colors">Profile</Link>
            <a href="#faq" className="text-xs text-muted-foreground hover:text-foreground transition-colors">Support</a>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Landing;
