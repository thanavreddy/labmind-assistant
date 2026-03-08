import { FlaskConical, ArrowRight, BookOpen, Brain, FileText } from "lucide-react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";

const courses = [
  { title: "Data Structures Lab", code: "CS201", experiments: 12, icon: BookOpen },
  { title: "Operating Systems Lab", code: "CS301", experiments: 10, icon: Brain },
  { title: "Database Systems Lab", code: "CS302", experiments: 8, icon: FileText },
];

const Landing = () => {
  return (
    <div className="min-h-screen bg-background dot-pattern">
      {/* Nav */}
      <nav className="border-b border-border glass-card">
        <div className="max-w-6xl mx-auto px-6 h-16 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <FlaskConical className="h-6 w-6 text-primary" />
            <span className="text-lg font-bold tracking-tight">LabMind</span>
          </div>
          <div className="flex items-center gap-3">
            <Link to="/dashboard">
              <Button variant="ghost" size="sm" className="text-muted-foreground hover:text-foreground">
                Guest Access
              </Button>
            </Link>
            <Link to="/dashboard">
              <Button size="sm" className="bg-primary text-primary-foreground hover:sapphire-glow transition-shadow">
                Login
              </Button>
            </Link>
          </div>
        </div>
      </nav>

      {/* Hero */}
      <section className="max-w-6xl mx-auto px-6 pt-24 pb-16">
        <div className="max-w-3xl opacity-0 animate-fade-up">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-border glass-card mb-6">
            <div className="h-1.5 w-1.5 rounded-full bg-primary" />
            <span className="font-mono text-xs text-muted-foreground tracking-wider uppercase">
              Guided AI Lab Completion
            </span>
          </div>
          <h1 className="text-5xl md:text-6xl font-bold tracking-tight leading-[1.1] mb-6">
            Your AI Lab
            <br />
            <span className="text-primary">Companion</span>
          </h1>
          <p className="text-lg text-muted-foreground max-w-xl mb-10 leading-relaxed">
            Complete lab experiments with AI guidance. Learn concepts, verify understanding, 
            and generate structured lab records — all in one intelligent workflow.
          </p>
          <div className="flex items-center gap-4">
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
        </div>

        {/* Flow indicator */}
        <div className="mt-20 opacity-0 animate-fade-up animate-stagger-2">
          <p className="font-mono text-[11px] text-muted-foreground tracking-widest uppercase mb-4">
            Three-stage lab flow
          </p>
          <div className="flex items-center gap-2">
            {[
              { label: "Learn", desc: "AI explains concepts" },
              { label: "Verify", desc: "Concept check quiz" },
              { label: "Record", desc: "Generate lab record" },
            ].map((step, i) => (
              <div key={step.label} className="flex items-center gap-2">
                <div className="glass-card-strong p-4 min-w-[140px]">
                  <span className="font-mono text-xs text-primary">{`0${i + 1}`}</span>
                  <p className="font-semibold text-sm mt-1">{step.label}</p>
                  <p className="text-xs text-muted-foreground mt-0.5">{step.desc}</p>
                </div>
                {i < 2 && <div className="w-8 h-px bg-border hidden md:block" />}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Course Cards */}
      <section className="max-w-6xl mx-auto px-6 pb-24">
        <p className="font-mono text-[11px] text-muted-foreground tracking-widest uppercase mb-6 opacity-0 animate-fade-up animate-stagger-3">
          Available Courses
        </p>
        <div className="grid md:grid-cols-3 gap-4">
          {courses.map((course, i) => (
            <div
              key={course.code}
              className={`glass-card p-6 hover:sapphire-glow transition-shadow duration-300 cursor-pointer opacity-0 animate-fade-up animate-stagger-${i + 3}`}
            >
              <course.icon className="h-5 w-5 text-primary mb-4" />
              <p className="font-mono text-[10px] text-muted-foreground tracking-wider uppercase">
                {course.code}
              </p>
              <h3 className="font-semibold mt-1 mb-2">{course.title}</h3>
              <p className="text-sm text-muted-foreground">
                {course.experiments} experiments
              </p>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
};

export default Landing;
