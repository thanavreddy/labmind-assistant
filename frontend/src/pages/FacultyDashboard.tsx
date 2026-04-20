import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";
import { useAuth } from "@/contexts/AuthContext";
import AppLayout from "@/components/AppLayout";
import { toast } from "@/components/ui/sonner";
import { useNavigate } from "react-router-dom";

// shadcn/ui components
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";

// icons
import { BookOpen, Users, FlaskConical } from "lucide-react";

// -----------------------------------------------------------------------------
// Types
// -----------------------------------------------------------------------------

interface Course {
  id: string;
  name: string;
  code: string;
  description?: string;
}

interface FacultyCourse {
  course_id: string;
  courses: Course[];
}

// ─── Static fallback data ─────────────────────────────────────────────────────

const DEMO_COURSES: Course[] = [
  {
    id: "1",
    name: "Data Structures",
    code: "CS201",
    description: "Study of fundamental data structures and their applications",
  },
  {
    id: "2",
    name: "Operating Systems",
    code: "CS301",
    description: "Principles of operating systems design and implementation",
  },
  {
    id: "3",
    name: "Database Management",
    code: "CS202",
    description: "Database design and management concepts",
  },
];

const DEMO_COUNTS = {
  "1": { students: 42, experiments: 8 },
  "2": { students: 38, experiments: 6 },
  "3": { students: 35, experiments: 7 },
};

// -----------------------------------------------------------------------------
// Component
// -----------------------------------------------------------------------------

export default function FacultyDashboard() {
  const { user } = useAuth();
  const navigate = useNavigate();

  const [courses, setCourses] = useState<Course[]>([]);
  const [studentCounts, setStudentCounts] = useState<Record<string, number>>(
    {}
  );
  const [experimentCounts, setExperimentCounts] = useState<
    Record<string, number>
  >({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) return;

    const fetchFacultyCourses = async () => {
      try {
        setLoading(true);

        // Fetch courses taught by faculty
       const { data, error } = await supabase
  .from("teaches")
  .select(`
    course_id,
    courses (
      id,
      name,
      code,
      description
    )
  `)
  .eq("faculty_id", user.id);

if (error) throw error;

let courseList: Course[] =
  (data as FacultyCourse[])
    ?.map((item) => item.courses?.[0])
    .filter((course): course is Course => Boolean(course)) || [];

// Use fallback data if no courses found
if (courseList.length === 0) {
  courseList = DEMO_COURSES;
  console.log("No courses found, using demo data");
}

setCourses(courseList);

        // Fetch student counts for each course
        const studentCountMap: Record<string, number> = {};
        const experimentCountMap: Record<string, number> = {};

        await Promise.all(
          courseList.map(async (course) => {
            // Student count
            const { count: studentCount } = await supabase
              .from("enrollments")
              .select("*", { count: "exact", head: true })
              .eq("course_id", course.id);

            studentCountMap[course.id] = studentCount || DEMO_COUNTS[course.id as keyof typeof DEMO_COUNTS]?.students || 0;

            // Experiment count
            const { count: experimentCount } = await supabase
              .from("experiments")
              .select("*", { count: "exact", head: true })
              .eq("course_id", course.id);

            experimentCountMap[course.id] = experimentCount || DEMO_COUNTS[course.id as keyof typeof DEMO_COUNTS]?.experiments || 0;
          })
        );

        setStudentCounts(studentCountMap);
        setExperimentCounts(experimentCountMap);
      } catch (error) {
        console.error("Error fetching faculty courses:", error);
        // Use demo data on error
        setCourses(DEMO_COURSES);
        const demoStudentCounts: Record<string, number> = {};
        const demoExperimentCounts: Record<string, number> = {};
        DEMO_COURSES.forEach((course) => {
          demoStudentCounts[course.id] = DEMO_COUNTS[course.id as keyof typeof DEMO_COUNTS]?.students || 0;
          demoExperimentCounts[course.id] = DEMO_COUNTS[course.id as keyof typeof DEMO_COUNTS]?.experiments || 0;
        });
        setStudentCounts(demoStudentCounts);
        setExperimentCounts(demoExperimentCounts);
        toast.error("Failed to load faculty dashboard. Showing demo data.");
      } finally {
        setLoading(false);
      }
    };

    fetchFacultyCourses();
  }, [user]);

  // ---------------------------------------------------------------------------
  // Loading Skeleton
  // ---------------------------------------------------------------------------

  const DashboardSkeleton = () => (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {Array.from({ length: 3 }).map((_, i) => (
        <Skeleton key={i} className="h-40 w-full rounded-xl" />
      ))}
    </div>
  );

  // ---------------------------------------------------------------------------
  // Render
  // ---------------------------------------------------------------------------

  const displayName =
    user?.user_metadata?.name ||
    user?.email?.split("@")[0] ||
    "Faculty";

  return (
    <AppLayout>
      <div className="px-6 py-8 space-y-8 max-w-6xl mx-auto">
        {/* Header with Greeting */}
        <div className="opacity-0 animate-fade-up">
          <p className="text-xs uppercase tracking-widest text-muted-foreground">
            Welcome back
          </p>
          <h1 className="text-4xl md:text-5xl font-bold tracking-tight mt-2">
            Hello, {displayName}! 👋
          </h1>
          <p className="text-muted-foreground mt-2">
            Manage your courses, track student progress, and review submissions.
          </p>
        </div>

        {/* Quick Actions */}
        <div
          className="grid md:grid-cols-2 gap-6 opacity-0 animate-fade-up"
          style={{ animationDelay: "0.1s" }}
        >
          <Card
            className="glass-card hover:shadow-lg transition-all cursor-pointer"
            onClick={() => navigate("/faculty-courses")}
          >
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <BookOpen className="h-5 w-5 text-primary" />
                Manage Courses
              </CardTitle>
              <CardDescription>
                View and manage all your assigned courses
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-primary">
                {courses.length}
              </div>
              <p className="text-xs text-muted-foreground mt-1">
                Active courses
              </p>
            </CardContent>
          </Card>

          <Card
            className="glass-card hover:shadow-lg transition-all cursor-pointer"
            onClick={() => navigate("/faculty-students")}
          >
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Users className="h-5 w-5 text-primary" />
                Manage Students
              </CardTitle>
              <CardDescription>
                Monitor student progress and performance
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-primary">
                {Object.values(studentCounts).reduce((a, b) => a + b, 0)}
              </div>
              <p className="text-xs text-muted-foreground mt-1">
                Total enrolled students
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Course Progress Section */}
        <div className="opacity-0 animate-fade-up" style={{ animationDelay: "0.15s" }}>
          <div className="mb-6">
            <h2 className="text-2xl font-bold tracking-tight">
              Course Overview
            </h2>
            <p className="text-muted-foreground mt-1">
              Track progress and manage experiments for each course
            </p>
          </div>

          {/* Loading State */}
          {loading && (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {Array.from({ length: 3 }).map((_, i) => (
                <Skeleton key={i} className="h-40 w-full rounded-xl" />
              ))}
            </div>
          )}

          {/* Empty State */}
          {!loading && courses.length === 0 && (
            <Card className="text-center py-12 glass-card">
              <CardContent>
                <BookOpen className="mx-auto h-10 w-10 text-muted-foreground mb-3" />
                <p className="text-muted-foreground">No courses assigned yet.</p>
              </CardContent>
            </Card>
          )}

          {/* Courses Grid */}
          {!loading && courses.length > 0 && (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {courses.map((course, index) => {
                const totalItems =
                  (studentCounts[course.id] || 0) +
                  (experimentCounts[course.id] || 0);
                const completionPercent =
                  totalItems > 0
                    ? Math.round(
                        (((studentCounts[course.id] || 0) * 60 +
                          (experimentCounts[course.id] || 0) * 40) /
                          totalItems) *
                          100
                      )
                    : 0;

                return (
                  <Card
                    key={course.id}
                    className="glass-card hover:shadow-lg transition-all group cursor-pointer"
                    onClick={() => navigate(`/faculty-courses/${course.id}`)}
                  >
                    <CardHeader>
                      <CardTitle className="flex items-center justify-between">
                        <span className="truncate">{course.name}</span>
                        <Badge variant="secondary">{course.code}</Badge>
                      </CardTitle>
                      <CardDescription>
                        {course.description || "No description available."}
                      </CardDescription>
                    </CardHeader>

                    <CardContent className="space-y-4">
                      {/* Stats Grid */}
                      <div className="grid grid-cols-2 gap-3">
                        <div className="bg-muted/30 rounded-lg p-3">
                          <div className="flex items-center gap-2 mb-2">
                            <Users className="h-4 w-4 text-muted-foreground" />
                            <span className="text-xs text-muted-foreground">
                              Students
                            </span>
                          </div>
                          <p className="text-2xl font-bold">
                            {studentCounts[course.id] || 0}
                          </p>
                        </div>
                        <div className="bg-muted/30 rounded-lg p-3">
                          <div className="flex items-center gap-2 mb-2">
                            <FlaskConical className="h-4 w-4 text-muted-foreground" />
                            <span className="text-xs text-muted-foreground">
                              Experiments
                            </span>
                          </div>
                          <p className="text-2xl font-bold">
                            {experimentCounts[course.id] || 0}
                          </p>
                        </div>
                      </div>

                      {/* Progress */}
                      <div className="space-y-2">
                        <div className="flex items-center justify-between text-xs">
                          <span className="text-muted-foreground">
                            Overall Progress
                          </span>
                          <span className="font-semibold">
                            {completionPercent}%
                          </span>
                        </div>
                        <Progress
                          value={completionPercent}
                          className="h-2"
                        />
                      </div>

                      {/* Action Button */}
                      <Button
                        className="w-full group-hover:bg-primary group-hover:text-primary-foreground transition-colors"
                        variant="outline"
                        onClick={(e) => {
                          e.stopPropagation();
                          navigate(`/faculty-courses/${course.id}`);
                        }}
                      >
                        View Details
                      </Button>
                    </CardContent>
                  </Card>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </AppLayout>
  );
}