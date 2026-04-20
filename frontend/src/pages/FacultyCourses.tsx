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
import { useNavigate } from "react-router-dom";

export default function FacultyCourses() {
  const { user } = useAuth();
  const navigate = useNavigate();

  // Static course data
  const courses = [
    {
      id: "cs201",
      code: "CS201",
      name: "Data Structures",
      students: 42,
      experiments: 8,
      status: "Active",
    },
    {
      id: "cs301",
      code: "CS301",
      name: "Operating Systems",
      students: 38,
      experiments: 6,
      status: "Active",
    },
  ];

  const handleCourseClick = (courseId: string) => {
    navigate(`/faculty-courses/${courseId}`);
  };

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
          {courses.map((course, index) => (
            <div 
              key={course.id}
              onClick={() => handleCourseClick(course.id)}
              className="glass-card relative p-6 opacity-0 animate-fade-up border transition-all duration-300 cursor-pointer hover:border-primary/50 hover:shadow-lg hover:bg-accent/5" 
              style={{ animationDelay: `${0.1 + index * 0.1}s` }}
            >
              <div className="flex items-start justify-between gap-4 mb-4">
                <div>
                  <h3 className="font-semibold text-lg">{course.code}</h3>
                  <p className="text-sm text-muted-foreground">{course.name}</p>
                </div>
                <BookOpen className="h-5 w-5 text-primary shrink-0" />
              </div>
              <div className="space-y-3 text-sm">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Enrolled Students</span>
                  <span className="font-semibold">{course.students}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Experiments</span>
                  <span className="font-semibold">{course.experiments}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Current Status</span>
                  <span className="font-semibold text-emerald-600">{course.status}</span>
                </div>
              </div>
            </div>
          ))}
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
