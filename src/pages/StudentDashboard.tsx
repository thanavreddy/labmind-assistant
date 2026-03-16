import { StatusChip } from "@/components/StatusChip";
import { ProgressRing } from "@/components/ProgressRing";
import AppLayout from "@/components/AppLayout";
import { cn } from "@/lib/utils";

interface Experiment {
  id: number;
  title: string;
  course: string;
  status: "pending" | "in-progress" | "done";
  progress: number;
}

const experiments: Experiment[] = [
  { id: 1, title: "Bubble Sort Implementation", course: "CS201", status: "done", progress: 100 },
  { id: 2, title: "Linked List Operations", course: "CS201", status: "in-progress", progress: 65 },
  { id: 3, title: "Binary Search Tree", course: "CS201", status: "in-progress", progress: 30 },
  { id: 4, title: "Process Scheduling (FCFS)", course: "CS301", status: "pending", progress: 0 },
  { id: 5, title: "Page Replacement Algorithms", course: "CS301", status: "pending", progress: 0 },
  { id: 6, title: "SQL Joins and Subqueries", course: "CS302", status: "pending", progress: 0 },
];

const courseColors: Record<string, { dot: string }> = {
  CS201: { dot: "bg-sapphire" },
  CS301: { dot: "bg-emerald-500" },
  CS302: { dot: "bg-amber-500" },
};

const getStatAccentColor = (index: number) => {
  const colors = ["border-t-sapphire", "border-t-emerald-500", "border-t-amber-500"];
  return colors[index];
};

const StudentDashboard = () => {
  const completedCount = experiments.filter((e) => e.status === "done").length;
  const inProgressCount = experiments.filter((e) => e.status === "in-progress").length;

  return (
    <AppLayout>
      <div className="px-6 py-8 max-w-6xl mx-auto">
        {/* Header */}
        <div className="mb-12 opacity-0 animate-fade-up">
          <p className="font-mono text-[10px] text-muted-foreground tracking-widest uppercase">Student Dashboard</p>
          <h1 className="text-3xl md:text-4xl font-bold tracking-tight mt-2">My Experiments</h1>
        </div>

        {/* Stats - with top gradient borders */}
        <div className="grid grid-cols-3 gap-4 mb-12">
          {[
            { label: "Completed", value: completedCount.toString(), sub: `of ${experiments.length} experiments` },
            { label: "In Progress", value: inProgressCount.toString(), sub: "active sessions" },
            { label: "Average Score", value: "87%", sub: "concept checks" },
          ].map((stat, i) => (
            <div
              key={stat.label}
              className={cn(
                "glass-card relative p-6 opacity-0 animate-fade-up overflow-hidden",
                "border-t-2 border-b border-l border-r",
                getStatAccentColor(i)
              )}
              style={{ animationDelay: `${(i + 1) * 0.1}s` }}
            >
              <p className="font-mono text-[9px] text-muted-foreground tracking-widest uppercase font-medium">
                {stat.label}
              </p>
              <p className="text-4xl font-bold mt-2 tracking-tight">{stat.value}</p>
              <p className="text-xs text-muted-foreground mt-1">{stat.sub}</p>
            </div>
          ))}
        </div>

        {/* Experiment Grid */}
        <div className="grid md:grid-cols-2 gap-6">
          {experiments.map((exp, i) => {
            const courseColor = courseColors[exp.course] || courseColors.CS201;
            const isDone = exp.status === "done";

            return (
              <div
                key={exp.id}
                className={cn(
                  "glass-card relative p-6 opacity-0 animate-fade-up",
                  "border transition-all duration-300 cursor-pointer",
                  "hover:-translate-y-1 hover:border-primary/50",
                  isDone && "bg-emerald-500/5 border-emerald-500/30"
                )}
                style={{ animationDelay: `${(i + 4) * 0.08}s` }}
              >
                <div className="flex items-start justify-between gap-4">
                  <div className="flex-1 min-w-0">
                    {/* Course tag */}
                    <div className="flex items-center gap-2 mb-3">
                      <div className={cn("h-2 w-2 rounded-full", courseColor.dot)} />
                      <span className="font-mono text-[10px] text-muted-foreground tracking-wider uppercase">
                        {exp.course}
                      </span>
                    </div>

                    {/* Experiment name */}
                    <h3 className="font-semibold text-sm md:text-base mb-4 leading-snug">{exp.title}</h3>

                    {/* Status badge */}
                    <StatusChip status={exp.status} />
                  </div>

                  {/* Progress ring - 38px */}
                  <ProgressRing progress={exp.progress} size={38} strokeWidth={3} />
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </AppLayout>
  );
};

export default StudentDashboard;