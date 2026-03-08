import { FlaskConical } from "lucide-react";
import { StatusChip } from "@/components/StatusChip";
import { ProgressRing } from "@/components/ProgressRing";
import AppLayout from "@/components/AppLayout";

const experiments = [
  { id: 1, title: "Bubble Sort Implementation", course: "CS201", status: "done" as const, progress: 100 },
  { id: 2, title: "Linked List Operations", course: "CS201", status: "in-progress" as const, progress: 65 },
  { id: 3, title: "Binary Search Tree", course: "CS201", status: "in-progress" as const, progress: 30 },
  { id: 4, title: "Process Scheduling (FCFS)", course: "CS301", status: "pending" as const, progress: 0 },
  { id: 5, title: "Page Replacement Algorithms", course: "CS301", status: "pending" as const, progress: 0 },
  { id: 6, title: "SQL Joins and Subqueries", course: "CS302", status: "pending" as const, progress: 0 },
];

const StudentDashboard = () => {
  return (
    <AppLayout>
      <div className="px-6 py-8 max-w-6xl mx-auto">
        {/* Header */}
        <div className="mb-8 opacity-0 animate-fade-up">
          <p className="font-mono text-[10px] text-muted-foreground tracking-widest uppercase">
            Student Dashboard
          </p>
          <h1 className="text-2xl font-bold mt-1">My Experiments</h1>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-3 gap-4 mb-8">
          {[
            { label: "Completed", value: "1", sub: "of 6 experiments" },
            { label: "In Progress", value: "2", sub: "active sessions" },
            { label: "Average Score", value: "87%", sub: "concept checks" },
          ].map((stat, i) => (
            <div
              key={stat.label}
              className={`glass-card p-5 opacity-0 animate-fade-up`}
              style={{ animationDelay: `${(i + 1) * 0.1}s` }}
            >
              <p className="font-mono text-[10px] text-muted-foreground tracking-widest uppercase">
                {stat.label}
              </p>
              <p className="text-3xl font-bold mt-1">{stat.value}</p>
              <p className="text-xs text-muted-foreground mt-0.5">{stat.sub}</p>
            </div>
          ))}
        </div>

        {/* Experiment Grid */}
        <div className="grid md:grid-cols-2 gap-4">
          {experiments.map((exp, i) => (
            <div
              key={exp.id}
              className="glass-card p-5 hover:sapphire-glow transition-shadow duration-300 cursor-pointer opacity-0 animate-fade-up"
              style={{ animationDelay: `${(i + 4) * 0.08}s` }}
            >
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-2">
                    <FlaskConical className="h-4 w-4 text-primary" />
                    <span className="font-mono text-[10px] text-muted-foreground tracking-wider">
                      {exp.course}
                    </span>
                  </div>
                  <h3 className="font-semibold text-sm mb-3">{exp.title}</h3>
                  <StatusChip status={exp.status} />
                </div>
                <ProgressRing progress={exp.progress} />
              </div>
            </div>
          ))}
        </div>
      </div>
    </AppLayout>
  );
};

export default StudentDashboard;
