/**
 * FacultySubmissions.tsx
 * 
 * Faculty submission review page.
 * Review and grade student lab record submissions and experiment work.
 */

import AppLayout from "@/components/AppLayout";
import { useAuth } from "@/contexts/AuthContext";
import { ClipboardCheck } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";

export default function FacultySubmissions() {
  const { user } = useAuth();

  return (
    <AppLayout>
      <div className="px-6 py-8 max-w-6xl mx-auto">
        {/* Header */}
        <div className="mb-12 opacity-0 animate-fade-up">
          <p className="font-mono text-[10px] text-muted-foreground tracking-widest uppercase">Submission Review</p>
          <h1 className="text-3xl md:text-4xl font-bold tracking-tight mt-2">Student Submissions</h1>
          <p className="text-muted-foreground mt-2">Review, evaluate, and provide feedback on student work</p>
        </div>

        {/* Stats */}
        <div className="grid md:grid-cols-4 gap-4 mb-8">
          <Card className="opacity-0 animate-fade-up" style={{ animationDelay: "0.05s" }}>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium">Pending Review</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-2xl font-bold">12</p>
            </CardContent>
          </Card>

          <Card className="opacity-0 animate-fade-up" style={{ animationDelay: "0.1s" }}>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium">Under Review</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-2xl font-bold">8</p>
            </CardContent>
          </Card>

          <Card className="opacity-0 animate-fade-up" style={{ animationDelay: "0.15s" }}>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium">Completed</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-2xl font-bold">145</p>
            </CardContent>
          </Card>

          <Card className="opacity-0 animate-fade-up" style={{ animationDelay: "0.2s" }}>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium">Avg. Score</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-2xl font-bold">81%</p>
            </CardContent>
          </Card>
        </div>

        {/* Submissions List */}
        <div className="glass-card relative p-6 opacity-0 animate-fade-up border transition-all duration-300" style={{ animationDelay: "0.25s" }}>
          <h2 className="font-semibold text-lg mb-2">Recent Submissions</h2>
          <p className="text-sm text-muted-foreground mb-6">Latest student submissions awaiting review</p>
          <div className="space-y-4">
              {[
                { student: "Aarushi Patel", exp: "Bubble Sort", status: "pending", submitted: "2 hours ago" },
                { student: "Rohan Kumar", exp: "Linked List", status: "under-review", submitted: "4 hours ago" },
                { student: "Priya Singh", exp: "Binary Tree", status: "completed", submitted: "1 day ago" },
              ].map((sub, i) => (
                <div key={i} className="flex items-center justify-between p-4 rounded-lg bg-accent/40 dark:bg-slate-800/60 border border-border dark:border-slate-700 hover:border-primary/50 dark:hover:border-primary/40 transition-colors cursor-pointer">
                  <div className="flex-1">
                    <p className="font-semibold text-sm">{sub.student}</p>
                    <p className="text-xs text-muted-foreground mt-1">{sub.exp}</p>
                  </div>
                  <div className="flex items-center gap-4">
                    <div className="text-right">
                      <Badge
                        variant={
                          sub.status === "completed"
                            ? "default"
                            : sub.status === "under-review"
                              ? "secondary"
                              : "outline"
                        }
                      >
                        {sub.status === "pending" && "Pending"}
                        {sub.status === "under-review" && "Under Review"}
                        {sub.status === "completed" && "Reviewed"}
                      </Badge>
                      <p className="text-xs text-muted-foreground mt-2">{sub.submitted}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
        </div>

        {/* Info message */}
        <div className="mt-8 p-4 rounded-lg bg-accent/40 dark:bg-slate-800/60 border border-border dark:border-slate-700 opacity-0 animate-fade-up" style={{ animationDelay: "0.3s" }}>
          <p className="text-sm text-muted-foreground">
            Click on a submission to view the full lab record, provide feedback, and assign a grade.
          </p>
        </div>
      </div>
    </AppLayout>
  );
}
