/**
 * FacultyCourses.tsx
 * 
 * Faculty course management page.
 * Displays courses taught by the faculty member with options to view students,
 * experiments, and class statistics.
 */

import AppLayout from "@/components/AppLayout";
import { useAuth } from "@/contexts/AuthContext";
import { BookOpen } from "lucide-react";

export default function FacultyCourses() {
  const { user } = useAuth();

  return (
    <AppLayout>
      <div className="px-6 py-8 max-w-6xl mx-auto">
        {/* Header */}
        <div className="mb-12 opacity-0 animate-fade-up">
          <p className="font-mono text-[10px] text-muted-foreground tracking-widest uppercase">Course Management</p>
          <h1 className="text-3xl md:text-4xl font-bold tracking-tight mt-2">My Courses</h1>
          <p className="text-muted-foreground mt-2">Manage and monitor the courses you teach</p>
        </div>

        {/* Placeholder Content */}
        <div className="grid md:grid-cols-2 gap-6">
          <div className="glass-card relative p-6 opacity-0 animate-fade-up border transition-all duration-300 cursor-pointer hover:border-primary/50" style={{ animationDelay: "0.1s" }}>
            <div className="flex items-start justify-between gap-4 mb-4">
              <div>
                <h3 className="font-semibold text-lg">CS201</h3>
                <p className="text-sm text-muted-foreground">Data Structures</p>
              </div>
              <BookOpen className="h-5 w-5 text-primary shrink-0" />
            </div>
            <div className="space-y-3 text-sm">
              <div className="flex justify-between">
                <span className="text-muted-foreground">Enrolled Students</span>
                <span className="font-semibold">42</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Experiments</span>
                <span className="font-semibold">8</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Current Status</span>
                <span className="font-semibold text-emerald-600">Active</span>
              </div>
            </div>
          </div>

          <div className="glass-card relative p-6 opacity-0 animate-fade-up border transition-all duration-300 cursor-pointer hover:border-primary/50" style={{ animationDelay: "0.2s" }}>
            <div className="flex items-start justify-between gap-4 mb-4">
              <div>
                <h3 className="font-semibold text-lg">CS301</h3>
                <p className="text-sm text-muted-foreground">Operating Systems</p>
              </div>
              <BookOpen className="h-5 w-5 text-primary shrink-0" />
            </div>
            <div className="space-y-3 text-sm">
              <div className="flex justify-between">
                <span className="text-muted-foreground">Enrolled Students</span>
                <span className="font-semibold">38</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Experiments</span>
                <span className="font-semibold">6</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Current Status</span>
                <span className="font-semibold text-emerald-600">Active</span>
              </div>
            </div>
          </div>
        </div>

        {/* Info message */}
        <div className="mt-8 p-4 rounded-lg bg-accent/40 dark:bg-slate-800/60 border border-border dark:border-slate-700 opacity-0 animate-fade-up" style={{ animationDelay: "0.3s" }}>
          <p className="text-sm text-muted-foreground">
            Click on a course to view and manage experiments, student submissions, and class analytics.
          </p>
        </div>
      </div>
    </AppLayout>
  );
}
