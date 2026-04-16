/**
 * FacultyExperiments.tsx
 * 
 * Faculty experiment management page.
 * View, create, and manage experiments across all courses.
 */

import AppLayout from "@/components/AppLayout";
import { useAuth } from "@/contexts/AuthContext";
import { FlaskConical } from "lucide-react";

export default function FacultyExperiments() {
  const { user } = useAuth();

  return (
    <AppLayout>
      <div className="px-6 py-8 max-w-6xl mx-auto">
        {/* Header */}
        <div className="mb-12 opacity-0 animate-fade-up">
          <p className="font-mono text-[10px] text-muted-foreground tracking-widest uppercase">Experiment Management</p>
          <h1 className="text-3xl md:text-4xl font-bold tracking-tight mt-2">All Experiments</h1>
          <p className="text-muted-foreground mt-2">Create and manage lab experiments for your courses</p>
        </div>

        {/* Placeholder Content */}
        <div className="grid md:grid-cols-2 gap-6">
          <div className="glass-card relative p-6 opacity-0 animate-fade-up border transition-all duration-300 cursor-pointer hover:border-primary/50" style={{ animationDelay: "0.1s" }}>
            <div className="flex items-start justify-between gap-4 mb-4">
              <div>
                <h3 className="font-semibold text-base">Bubble Sort Implementation</h3>
                <p className="text-xs text-muted-foreground mt-1">CS201 • Data Structures</p>
              </div>
              <FlaskConical className="h-5 w-5 text-primary shrink-0" />
            </div>
            <div className="space-y-3 text-sm">
              <div className="flex justify-between">
                <span className="text-muted-foreground">Submissions</span>
                <span className="font-semibold">35/42</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Average Score</span>
                <span className="font-semibold">82%</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Status</span>
                <span className="font-semibold text-emerald-600">Active</span>
              </div>
            </div>
          </div>

          <div className="glass-card relative p-6 opacity-0 animate-fade-up border transition-all duration-300 cursor-pointer hover:border-primary/50" style={{ animationDelay: "0.2s" }}>
            <div className="flex items-start justify-between gap-4 mb-4">
              <div>
                <h3 className="font-semibold text-base">Linked List Operations</h3>
                <p className="text-xs text-muted-foreground mt-1">CS201 • Data Structures</p>
              </div>
              <FlaskConical className="h-5 w-5 text-primary shrink-0" />
            </div>
            <div className="space-y-3 text-sm">
              <div className="flex justify-between">
                <span className="text-muted-foreground">Submissions</span>
                <span className="font-semibold">28/42</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Average Score</span>
                <span className="font-semibold">75%</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Status</span>
                <span className="font-semibold text-amber-600">In Progress</span>
              </div>
            </div>
          </div>
        </div>

        {/* Info message */}
        <div className="mt-8 p-4 rounded-lg bg-accent/40 dark:bg-slate-800/60 border border-border dark:border-slate-700 opacity-0 animate-fade-up" style={{ animationDelay: "0.3s" }}>
          <p className="text-sm text-muted-foreground">
            View student submissions, provide feedback, and track completion rates for each experiment.
          </p>
        </div>
      </div>
    </AppLayout>
  );
}
