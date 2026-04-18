/**
 * FacultyStudents.tsx
 * 
 * Faculty student management page.
 * View and manage students enrolled in your courses.
 */

import AppLayout from "@/components/AppLayout";
import { useAuth } from "@/contexts/AuthContext";
import { Users } from "lucide-react";

export default function FacultyStudents() {
  const { user } = useAuth();

  return (
    <AppLayout>
      <div className="px-6 py-8 max-w-6xl mx-auto">
        {/* Header */}
        <div className="mb-12 opacity-0 animate-fade-up">
          <p className="font-mono text-[10px] text-muted-foreground tracking-widest uppercase">Student Management</p>
          <h1 className="text-3xl md:text-4xl font-bold tracking-tight mt-2">My Students</h1>
          <p className="text-muted-foreground mt-2">Monitor and manage student progress across all courses</p>
        </div>

        {/* Placeholder Content */}
        <div className="grid md:grid-cols-3 gap-6 mb-8">
          <div className="glass-card relative p-6 opacity-0 animate-fade-up border transition-all duration-300" style={{ animationDelay: "0.1s" }}>
            <p className="font-mono text-[9px] text-muted-foreground tracking-widest uppercase font-medium">Total Students</p>
            <p className="text-4xl font-bold mt-2 tracking-tight">80</p>
            <p className="text-xs text-muted-foreground mt-2">Across all courses</p>
          </div>

          <div className="glass-card relative p-6 opacity-0 animate-fade-up border transition-all duration-300" style={{ animationDelay: "0.15s" }}>
            <p className="font-mono text-[9px] text-muted-foreground tracking-widest uppercase font-medium">Active Sessions</p>
            <p className="text-4xl font-bold mt-2 tracking-tight">23</p>
            <p className="text-xs text-muted-foreground mt-2">Currently working</p>
          </div>

          <div className="glass-card relative p-6 opacity-0 animate-fade-up border transition-all duration-300" style={{ animationDelay: "0.2s" }}>
            <p className="font-mono text-[9px] text-muted-foreground tracking-widest uppercase font-medium">Submission Rate</p>
            <p className="text-4xl font-bold mt-2 tracking-tight">87%</p>
            <p className="text-xs text-muted-foreground mt-2">On-time submissions</p>
          </div>
        </div>

        {/* Student List Placeholder */}
        <div className="glass-card relative p-6 opacity-0 animate-fade-up border transition-all duration-300" style={{ animationDelay: "0.25s" }}>
          <h2 className="font-semibold text-lg mb-2">Student List</h2>
          <p className="text-sm text-muted-foreground mb-6">View detailed progress for individual students</p>
          <div className="space-y-4">
            {[1, 2, 3].map((i) => (
              <div key={i} className="flex items-center justify-between p-3 rounded-lg bg-accent/40 dark:bg-slate-800/60 border border-border dark:border-slate-700 hover:border-primary/50 dark:hover:border-primary/40 transition-all cursor-pointer">
                <div>
                  <p className="font-semibold text-sm">Student {i}</p>
                  <p className="text-xs text-muted-foreground">student{i}@cbit.org.in</p>
                </div>
                <div className="text-right">
                  <p className="text-sm font-medium">85%</p>
                  <p className="text-xs text-muted-foreground">Progress</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Info message */}
        <div className="mt-8 p-4 rounded-lg bg-accent/40 dark:bg-slate-800/60 border border-border dark:border-slate-700 opacity-0 animate-fade-up" style={{ animationDelay: "0.3s" }}>
          <p className="text-sm text-muted-foreground">
            Click on a student to view their detailed progress, submissions, and performance metrics.
          </p>
        </div>
      </div>
    </AppLayout>
  );
}
