/**
 * CourseDetails.tsx
 * 
 * Detailed view of a specific course with experiments and submissions.
 * Shows course analytics, experiments, and student submissions.
 */

import AppLayout from "@/components/AppLayout";
import { useAuth } from "@/contexts/AuthContext";
import { useParams, useNavigate } from "react-router-dom";
import { ArrowLeft, FlaskConical, Users, CheckSquare } from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

// Static course data
const courseDatabase: Record<string, any> = {
  cs201: {
    id: "cs201",
    code: "CS201",
    name: "Data Structures",
    description: "Study of fundamental data structures and their applications",
    students: 42,
    experiments: 8,
    status: "Active",
    experiments_list: [
      {
        id: "exp1",
        title: "Bubble Sort Implementation",
        submissions: "35/42",
        avgScore: "82%",
        status: "Active",
      },
      {
        id: "exp2",
        title: "Linked List Operations",
        submissions: "28/42",
        avgScore: "75%",
        status: "In Progress",
      },
      {
        id: "exp3",
        title: "Binary Tree Traversal",
        submissions: "40/42",
        avgScore: "88%",
        status: "Active",
      },
      {
        id: "exp4",
        title: "Stack and Queue Implementation",
        submissions: "38/42",
        avgScore: "85%",
        status: "Active",
      },
    ],
    students_list: [
      { id: "s1", name: "Alice Johnson", email: "alice@example.com", submissions: 7, avgScore: "85%" },
      { id: "s2", name: "Bob Smith", email: "bob@example.com", submissions: 6, avgScore: "78%" },
      { id: "s3", name: "Carol White", email: "carol@example.com", submissions: 8, avgScore: "92%" },
      { id: "s4", name: "David Brown", email: "david@example.com", submissions: 5, avgScore: "72%" },
      { id: "s5", name: "Eva Wilson", email: "eva@example.com", submissions: 8, avgScore: "88%" },
    ],
  },
  cs301: {
    id: "cs301",
    code: "CS301",
    name: "Operating Systems",
    description: "Principles of operating systems design and implementation",
    students: 38,
    experiments: 6,
    status: "Active",
    experiments_list: [
      {
        id: "exp1",
        title: "Process Scheduling",
        submissions: "32/38",
        avgScore: "80%",
        status: "Active",
      },
      {
        id: "exp2",
        title: "Memory Management",
        submissions: "28/38",
        avgScore: "77%",
        status: "In Progress",
      },
      {
        id: "exp3",
        title: "File System Implementation",
        submissions: "35/38",
        avgScore: "84%",
        status: "Active",
      },
    ],
    students_list: [
      { id: "s1", name: "Frank Miller", email: "frank@example.com", submissions: 5, avgScore: "82%" },
      { id: "s2", name: "Grace Lee", email: "grace@example.com", submissions: 6, avgScore: "88%" },
      { id: "s3", name: "Henry Davis", email: "henry@example.com", submissions: 4, avgScore: "70%" },
    ],
  },
};

export default function CourseDetails() {
  const { user } = useAuth();
  const { courseId } = useParams();
  const navigate = useNavigate();

  const course = courseDatabase[courseId || ""];

  if (!course) {
    return (
      <AppLayout>
        <div className="px-6 py-8 max-w-6xl mx-auto">
          <button
            onClick={() => navigate("/faculty-courses")}
            className="flex items-center gap-2 text-muted-foreground hover:text-foreground mb-6 transition-colors"
          >
            <ArrowLeft className="h-4 w-4" />
            Back to Courses
          </button>
          <div className="text-center py-12">
            <p className="text-muted-foreground">Course not found</p>
          </div>
        </div>
      </AppLayout>
    );
  }

  return (
    <AppLayout>
      <div className="px-6 py-8 max-w-6xl mx-auto">
        {/* Back Button */}
        <button
          onClick={() => navigate("/faculty-courses")}
          className="flex items-center gap-2 text-muted-foreground hover:text-foreground mb-6 transition-colors"
        >
          <ArrowLeft className="h-4 w-4" />
          Back to Courses
        </button>

        {/* Header */}
        <div className="mb-8 opacity-0 animate-fade-up">
          <h1 className="text-3xl md:text-4xl font-bold tracking-tight">{course.code}</h1>
          <p className="text-lg text-muted-foreground mt-2">{course.name}</p>
          <p className="text-sm text-muted-foreground mt-1">{course.description}</p>
        </div>

        {/* Course Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8 opacity-0 animate-fade-up" style={{ animationDelay: "0.1s" }}>
          <div className="glass-card p-4 border rounded-lg">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Enrolled Students</p>
                <p className="text-2xl font-bold mt-1">{course.students}</p>
              </div>
              <Users className="h-8 w-8 text-primary opacity-60" />
            </div>
          </div>
          <div className="glass-card p-4 border rounded-lg">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Active Experiments</p>
                <p className="text-2xl font-bold mt-1">{course.experiments}</p>
              </div>
              <FlaskConical className="h-8 w-8 text-primary opacity-60" />
            </div>
          </div>
          <div className="glass-card p-4 border rounded-lg">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Course Status</p>
                <p className="text-2xl font-bold mt-1 text-emerald-600">{course.status}</p>
              </div>
              <CheckSquare className="h-8 w-8 text-primary opacity-60" />
            </div>
          </div>
        </div>

        {/* Tabs */}
        <Tabs defaultValue="experiments" className="opacity-0 animate-fade-up" style={{ animationDelay: "0.2s" }}>
          <TabsList className="grid w-full max-w-md grid-cols-2">
            <TabsTrigger value="experiments">Experiments</TabsTrigger>
            <TabsTrigger value="students">Students</TabsTrigger>
          </TabsList>

          {/* Experiments Tab */}
          <TabsContent value="experiments" className="mt-6 space-y-4">
            <p className="text-sm text-muted-foreground mb-4">
              View and manage all experiments for this course
            </p>
            {course.experiments_list.map((experiment: any) => (
              <div
                key={experiment.id}
                className="glass-card p-4 border rounded-lg hover:border-primary/50 transition-all duration-300 cursor-pointer hover:shadow-lg hover:bg-accent/5"
              >
                <div className="flex items-start justify-between gap-4">
                  <div className="flex-1">
                    <h3 className="font-semibold text-base">{experiment.title}</h3>
                    <div className="grid grid-cols-3 gap-4 mt-3 text-sm">
                      <div>
                        <p className="text-muted-foreground">Submissions</p>
                        <p className="font-semibold mt-1">{experiment.submissions}</p>
                      </div>
                      <div>
                        <p className="text-muted-foreground">Avg Score</p>
                        <p className="font-semibold mt-1">{experiment.avgScore}</p>
                      </div>
                      <div>
                        <p className="text-muted-foreground">Status</p>
                        <p className={`font-semibold mt-1 ${experiment.status === "Active" ? "text-emerald-600" : "text-amber-600"}`}>
                          {experiment.status}
                        </p>
                      </div>
                    </div>
                  </div>
                  <FlaskConical className="h-5 w-5 text-primary shrink-0 mt-1" />
                </div>
              </div>
            ))}
          </TabsContent>

          {/* Students Tab */}
          <TabsContent value="students" className="mt-6">
            <p className="text-sm text-muted-foreground mb-4">
              View enrolled students and their progress
            </p>
            <div className="space-y-2">
              {course.students_list.map((student: any) => (
                <div
                  key={student.id}
                  className="glass-card p-4 border rounded-lg hover:border-primary/50 transition-all duration-300"
                >
                  <div className="flex items-center justify-between gap-4">
                    <div className="flex-1">
                      <h3 className="font-semibold">{student.name}</h3>
                      <p className="text-sm text-muted-foreground mt-1">{student.email}</p>
                    </div>
                    <div className="text-right text-sm">
                      <p className="text-muted-foreground">Submissions</p>
                      <p className="font-semibold">{student.submissions}</p>
                    </div>
                    <div className="text-right text-sm">
                      <p className="text-muted-foreground">Avg Score</p>
                      <p className="font-semibold">{student.avgScore}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </AppLayout>
  );
}
