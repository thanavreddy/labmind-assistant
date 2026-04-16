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

const courseList: Course[] =
  (data as FacultyCourse[])
    ?.map((item) => item.courses?.[0])
    .filter((course): course is Course => Boolean(course)) || [];

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

            studentCountMap[course.id] = studentCount || 0;

            // Experiment count
            const { count: experimentCount } = await supabase
              .from("experiments")
              .select("*", { count: "exact", head: true })
              .eq("course_id", course.id);

            experimentCountMap[course.id] = experimentCount || 0;
          })
        );

        setStudentCounts(studentCountMap);
        setExperimentCounts(experimentCountMap);
      } catch (error) {
        console.error("Error fetching faculty courses:", error);
        toast.error("Failed to load faculty dashboard.");
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

  return (
    <AppLayout>
      <div className="px-6 py-8 space-y-8">
        {/* Header */}
        <div>
          <p className="text-xs uppercase tracking-widest text-muted-foreground">
            Faculty Portal
          </p>
          <h1 className="text-3xl font-bold tracking-tight">
            Faculty Dashboard
          </h1>
          <p className="text-muted-foreground mt-1">
            Manage your courses, experiments, and students.
          </p>
        </div>

        {/* Loading State */}
        {loading && <DashboardSkeleton />}

        {/* Empty State */}
        {!loading && courses.length === 0 && (
          <Card className="text-center py-12">
            <CardContent>
              <BookOpen className="mx-auto h-10 w-10 text-muted-foreground mb-3" />
              <p className="text-muted-foreground">
                No courses assigned yet.
              </p>
            </CardContent>
          </Card>
        )}

        {/* Courses Grid */}
        {!loading && courses.length > 0 && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {courses.map((course) => (
              <Card
                key={course.id}
                className="glass-card hover:shadow-lg transition-all"
              >
                <CardHeader>
                  <CardTitle className="flex items-center justify-between">
                    {course.name}
                    <Badge variant="secondary">{course.code}</Badge>
                  </CardTitle>
                  <CardDescription>
                    {course.description || "No description available."}
                  </CardDescription>
                </CardHeader>

                <CardContent className="space-y-4">
                  {/* Stats */}
                  <div className="flex justify-between text-sm">
                    <div className="flex items-center gap-2">
                      <Users className="h-4 w-4 text-muted-foreground" />
                      <span>
                        {studentCounts[course.id] || 0} Students
                      </span>
                    </div>
                    <div className="flex items-center gap-2">
                      <FlaskConical className="h-4 w-4 text-muted-foreground" />
                      <span>
                        {experimentCounts[course.id] || 0} Experiments
                      </span>
                    </div>
                  </div>

                  {/* Actions */}
                  <Button
                    className="w-full"
                    onClick={() =>
                      navigate(`/faculty/course/${course.id}`)
                    }
                  >
                    View Course
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>
    </AppLayout>
  );
}