import { Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { StatusChip } from "@/components/StatusChip";
import AppLayout from "@/components/AppLayout";
import { cn } from "@/lib/utils";

interface Student {
  id: number;
  name: string;
  initials: string;
  roll: string;
  done: number;
  total: number;
  status: "pending" | "in-progress" | "done";
}

const students: Student[] = [
  { id: 1, name: "Arjun Mehta", initials: "AM", roll: "CS21B001", done: 4, total: 6, status: "in-progress" },
  { id: 2, name: "Priya Sharma", initials: "PS", roll: "CS21B002", done: 6, total: 6, status: "done" },
  { id: 3, name: "Rahul Verma", initials: "RV", roll: "CS21B003", done: 2, total: 6, status: "in-progress" },
  { id: 4, name: "Sneha Patel", initials: "SP", roll: "CS21B004", done: 0, total: 6, status: "pending" },
  { id: 5, name: "Karthik Nair", initials: "KN", roll: "CS21B005", done: 3, total: 6, status: "in-progress" },
  { id: 6, name: "Ananya Reddy", initials: "AR", roll: "CS21B006", done: 5, total: 6, status: "in-progress" },
];

const getStatAccentColor = (index: number) => {
  const colors = ["border-t-sapphire", "border-t-emerald-500", "border-t-amber-500", "border-t-red-500"];
  return colors[index];
};

const getAvatarBg = (initials: string) => {
  const colors = [
    "bg-sapphire/20 text-sapphire",
    "bg-emerald-500/20 text-emerald-400",
    "bg-amber-500/20 text-amber-400",
    "bg-purple-500/20 text-purple-400",
  ];
  const index = initials.charCodeAt(0) % colors.length;
  return colors[index];
};

const ProfessorDashboard = () => {
  const totalStudents = students.length;
  const avgCompletion = Math.round(
    (students.reduce((sum, s) => sum + (s.done / s.total) * 100, 0) / students.length) || 0
  );
  const submittedToday = 3;
  const pendingReviews = students.filter((s) => s.status === "in-progress").length;

  return (
    <AppLayout>
      <div className="px-6 py-8 max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-12 opacity-0 animate-fade-up">
          <div>
            <p className="font-mono text-[10px] text-muted-foreground tracking-widest uppercase">Professor Dashboard</p>
            <h1 className="text-3xl md:text-4xl font-bold tracking-tight mt-2">CS201 — Data Structures Lab</h1>
          </div>
          <Button className="bg-primary text-primary-foreground hover:sapphire-glow transition-shadow gap-2">
            <Plus className="h-4 w-4" /> Assign Experiment
          </Button>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-4 gap-4 mb-12">
          {[
            { label: "Total Students", value: totalStudents.toString() },
            { label: "Avg. Completion", value: `${avgCompletion}%` },
            { label: "Submitted Today", value: submittedToday.toString() },
            { label: "Pending Reviews", value: pendingReviews.toString() },
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
              <p className="text-3xl font-bold mt-2 tracking-tight">{stat.value}</p>
            </div>
          ))}
        </div>

        {/* Table */}
        <div
          className="glass-card overflow-hidden opacity-0 animate-fade-up border"
          style={{ animationDelay: "600ms" }}
        >
          <div className="px-6 py-4 border-b border-border">
            <span className="font-mono text-[10px] text-muted-foreground tracking-widest uppercase font-medium">
              Student Progress
            </span>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-border">
                  <th className="px-6 py-4 text-left text-xs font-mono text-muted-foreground tracking-wider uppercase">
                    Student
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-mono text-muted-foreground tracking-wider uppercase">
                    Roll No
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-mono text-muted-foreground tracking-wider uppercase">
                    Progress
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-mono text-muted-foreground tracking-wider uppercase">
                    Status
                  </th>
                </tr>
              </thead>
              <tbody>
                {students.map((s) => {
                  const progressPercent = (s.done / s.total) * 100;
                  return (
                    <tr
                      key={s.id}
                      className="border-b border-border/50 hover:bg-muted/30 transition-colors cursor-pointer"
                    >
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-3">
                          <Avatar className="h-9 w-9">
                            <AvatarFallback className={cn("font-mono text-xs font-semibold", getAvatarBg(s.initials))}>
                              {s.initials}
                            </AvatarFallback>
                          </Avatar>
                          <span className="font-medium text-sm">{s.name}</span>
                        </div>
                      </td>
                      <td className="px-6 py-4 font-mono text-xs text-muted-foreground">{s.roll}</td>
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-3">
                          <div className="w-24 h-1.5 bg-muted rounded-full overflow-hidden">
                            <div className="h-full bg-sapphire rounded-full transition-all" style={{ width: `${progressPercent}%` }} />
                          </div>
                          <span className="font-mono text-xs text-muted-foreground whitespace-nowrap">
                            {s.done}/{s.total}
                          </span>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <StatusChip status={s.status} />
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </AppLayout>
  );
};

export default ProfessorDashboard;