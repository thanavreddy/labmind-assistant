import { Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { StatusChip } from "@/components/StatusChip";
import AppLayout from "@/components/AppLayout";

const students = [
  { id: 1, name: "Arjun Mehta", rollNo: "CS21B001", completed: 4, total: 6, status: "in-progress" as const },
  { id: 2, name: "Priya Sharma", rollNo: "CS21B002", completed: 6, total: 6, status: "done" as const },
  { id: 3, name: "Rahul Verma", rollNo: "CS21B003", completed: 2, total: 6, status: "in-progress" as const },
  { id: 4, name: "Sneha Patel", rollNo: "CS21B004", completed: 0, total: 6, status: "pending" as const },
  { id: 5, name: "Karthik Nair", rollNo: "CS21B005", completed: 3, total: 6, status: "in-progress" as const },
  { id: 6, name: "Ananya Reddy", rollNo: "CS21B006", completed: 5, total: 6, status: "in-progress" as const },
];

const ProfessorDashboard = () => {
  return (
    <AppLayout>
      <div className="px-6 py-8 max-w-6xl mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-8 opacity-0 animate-fade-up">
          <div>
            <p className="font-mono text-[10px] text-muted-foreground tracking-widest uppercase">
              Professor Dashboard
            </p>
            <h1 className="text-2xl font-bold mt-1">CS201 — Data Structures Lab</h1>
          </div>
          <Button className="bg-primary text-primary-foreground hover:sapphire-glow transition-shadow gap-2">
            <Plus className="h-4 w-4" /> Assign Experiment
          </Button>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-4 gap-4 mb-8">
          {[
            { label: "Total Students", value: "6" },
            { label: "Avg. Completion", value: "55%" },
            { label: "Submitted Today", value: "3" },
            { label: "Pending Reviews", value: "4" },
          ].map((stat, i) => (
            <div
              key={stat.label}
              className={`glass-card p-4 opacity-0 animate-fade-up`}
              style={{ animationDelay: `${(i + 1) * 0.1}s` }}
            >
              <p className="font-mono text-[10px] text-muted-foreground tracking-widest uppercase">
                {stat.label}
              </p>
              <p className="text-2xl font-bold mt-1">{stat.value}</p>
            </div>
          ))}
        </div>

        {/* Table */}
        <div className="glass-card overflow-hidden opacity-0 animate-fade-up animate-stagger-5">
          <div className="px-5 py-3 border-b border-border">
            <span className="font-mono text-[10px] text-muted-foreground tracking-widest uppercase">
              Student Progress
            </span>
          </div>
          <table className="w-full">
            <thead>
              <tr className="border-b border-border">
                <th className="px-5 py-3 text-left text-xs font-mono text-muted-foreground tracking-wider uppercase">
                  Student
                </th>
                <th className="px-5 py-3 text-left text-xs font-mono text-muted-foreground tracking-wider uppercase">
                  Roll No
                </th>
                <th className="px-5 py-3 text-left text-xs font-mono text-muted-foreground tracking-wider uppercase">
                  Progress
                </th>
                <th className="px-5 py-3 text-left text-xs font-mono text-muted-foreground tracking-wider uppercase">
                  Status
                </th>
              </tr>
            </thead>
            <tbody>
              {students.map((s) => (
                <tr
                  key={s.id}
                  className="border-b border-border/50 hover:bg-muted/30 transition-colors cursor-pointer"
                >
                  <td className="px-5 py-4 text-sm font-medium">{s.name}</td>
                  <td className="px-5 py-4 font-mono text-xs text-muted-foreground">
                    {s.rollNo}
                  </td>
                  <td className="px-5 py-4">
                    <div className="flex items-center gap-3">
                      <div className="w-24 h-1.5 bg-muted rounded-full overflow-hidden">
                        <div
                          className="h-full bg-primary rounded-full"
                          style={{
                            width: `${(s.completed / s.total) * 100}%`,
                          }}
                        />
                      </div>
                      <span className="font-mono text-xs text-muted-foreground">
                        {s.completed}/{s.total}
                      </span>
                    </div>
                  </td>
                  <td className="px-5 py-4">
                    <StatusChip status={s.status} />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </AppLayout>
  );
};

export default ProfessorDashboard;
