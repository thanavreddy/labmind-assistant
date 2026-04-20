import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/lib/supabase";
import AppLayout from "@/components/AppLayout";
import { Progress } from "@/components/ui/progress";
import { cn } from "@/lib/utils";
import {
  BookOpen,
  FlaskConical,
  CheckCircle2,
  Clock,
  Users,
  ArrowRight,
  GraduationCap,
  AlertCircle,
  RefreshCw,
  Database,
} from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";

// ─── Types ────────────────────────────────────────────────────────────────────

interface Course {
  id: number;
  title: string;
  code: string;
  instructor_name: string | null;
  created_at: string;
}

interface ExperimentRow {
  id: number;
  course_id: number;
  lab_records: { status: string; student_id: string }[];
}

interface CourseWithStats extends Course {
  totalExperiments: number;
  completedExperiments: number;
  inProgressExperiments: number;
}

// ─── Color palette ────────────────────────────────────────────────────────────

const PALETTES = [
  {
    bg: "bg-blue-500/10",
    dot: "bg-blue-400",
    text: "text-blue-400",
    icon: "text-blue-400",
  },
  {
    bg: "bg-emerald-500/10",
    dot: "bg-emerald-400",
    text: "text-emerald-400",
    icon: "text-emerald-400",
  },
  {
    bg: "bg-violet-500/10",
    dot: "bg-violet-400",
    text: "text-violet-400",
    icon: "text-violet-400",
  },
  {
    bg: "bg-amber-500/10",
    dot: "bg-amber-400",
    text: "text-amber-400",
    icon: "text-amber-400",
  },
  {
    bg: "bg-rose-500/10",
    dot: "bg-rose-400",
    text: "text-rose-400",
    icon: "text-rose-400",
  },
  {
    bg: "bg-cyan-500/10",
    dot: "bg-cyan-400",
    text: "text-cyan-400",
    icon: "text-cyan-400",
  },
];

// ─── Static fallback data ─────────────────────────────────────────────────────

const DEMO_COURSES: CourseWithStats[] = [
  {
    id: 1,
    code: "CS201",
    title: "Data Structures Lab",
    instructor_name: "Dr. A. Smith",
    created_at: new Date().toISOString(),
    totalExperiments: 8,
    completedExperiments: 3,
    inProgressExperiments: 2,
  },
  {
    id: 2,
    code: "CS301",
    title: "Operating Systems Lab",
    instructor_name: "Prof. R. Kumar",
    created_at: new Date().toISOString(),
    totalExperiments: 6,
    completedExperiments: 1,
    inProgressExperiments: 1,
  },
  {
    id: 3,
    code: "CS401",
    title: "Computer Networks Lab",
    instructor_name: "Dr. P. Menon",
    created_at: new Date().toISOString(),
    totalExperiments: 5,
    completedExperiments: 0,
    inProgressExperiments: 0,
  },
  {
    id: 4,
    code: "CS202",
    title: "Database Management Lab",
    instructor_name: "Prof. S. Iyer",
    created_at: new Date().toISOString(),
    totalExperiments: 7,
    completedExperiments: 5,
    inProgressExperiments: 1,
  },
];

// ─── Helpers ──────────────────────────────────────────────────────────────────

const isSchemaMissing = (err: any) =>
  err?.code === "PGRST200" ||
  err?.message?.toLowerCase().includes("schema cache") ||
  err?.message?.toLowerCase().includes("does not exist") ||
  err?.message?.toLowerCase().includes("relation") ||
  err?.hint?.toLowerCase().includes("schema");

// ─── Skeleton card ────────────────────────────────────────────────────────────

function CourseCardSkeleton() {
  return (
    <div className="glass-card p-6 space-y-5">
      <div className="flex items-start justify-between">
        <div className="space-y-2 flex-1">
          <Skeleton className="h-5 w-16 rounded-md" />
          <Skeleton className="h-6 w-3/4" />
        </div>
        <Skeleton className="h-11 w-11 rounded-xl shrink-0 ml-3" />
      </div>
      <Skeleton className="h-3 w-36" />
      <div className="space-y-2">
        <div className="flex justify-between">
          <Skeleton className="h-3 w-24" />
          <Skeleton className="h-3 w-8" />
        </div>
        <Skeleton className="h-1.5 w-full rounded-full" />
      </div>
    </div>
  );
}

// ─── Course grid ──────────────────────────────────────────────────────────────

function CourseGrid({
  courses,
  onCardClick,
}: {
  courses: CourseWithStats[];
  onCardClick: (id: number) => void;
}) {
  return (
    <div className="grid md:grid-cols-2 gap-5">
      {courses.map((course, i) => {
        const pal = PALETTES[i % PALETTES.length];
        const pct =
          course.totalExperiments > 0
            ? Math.round(
                (course.completedExperiments / course.totalExperiments) * 100
              )
            : 0;

        return (
          <button
            key={course.id}
            onClick={() => onCardClick(course.id)}
            className={cn(
              "glass-card p-6 text-left group w-full transition-all duration-200",
              "hover:-translate-y-0.5 hover:shadow-lg focus:outline-none focus-visible:ring-2 focus-visible:ring-ring",
              "opacity-0 animate-fade-up"
            )}
            style={{ animationDelay: `${(i + 3) * 0.07}s` }}
            aria-label={`Open ${course.title}`}
          >
            {/* Header */}
            <div className="flex items-start justify-between mb-4 gap-3">
              <div className="flex-1 min-w-0">
                <div
                  className={cn(
                    "inline-flex items-center gap-1.5 px-2 py-0.5 rounded-md mb-2.5 text-[11px] font-mono font-semibold",
                    pal.bg,
                    pal.text
                  )}
                >
                  <span className={cn("h-1.5 w-1.5 rounded-full", pal.dot)} />
                  {course.code}
                </div>
                <h2 className="font-semibold text-base leading-snug truncate">
                  {course.title}
                </h2>
              </div>
              <div
                className={cn(
                  "h-11 w-11 rounded-xl shrink-0 flex items-center justify-center",
                  pal.bg
                )}
              >
                <FlaskConical className={cn("h-5 w-5", pal.icon)} />
              </div>
            </div>

            {/* Instructor */}
            {course.instructor_name && (
              <div className="flex items-center gap-1.5 text-xs text-muted-foreground mb-4">
                <Users className="h-3.5 w-3.5 shrink-0" />
                <span className="truncate">{course.instructor_name}</span>
              </div>
            )}

            {/* Counts */}
            <div className="flex items-center gap-3 text-xs text-muted-foreground mb-4 flex-wrap">
              <span>
                {course.totalExperiments} experiment
                {course.totalExperiments !== 1 && "s"}
              </span>
              {course.completedExperiments > 0 && (
                <>
                  <span className="opacity-30">·</span>
                  <span className="text-emerald-400">
                    {course.completedExperiments} completed
                  </span>
                </>
              )}
              {course.inProgressExperiments > 0 && (
                <>
                  <span className="opacity-30">·</span>
                  <span className="text-amber-400">
                    {course.inProgressExperiments} in progress
                  </span>
                </>
              )}
            </div>

            {/* Progress */}
            <div className="space-y-1.5 mb-3">
              <div className="flex items-center justify-between text-xs">
                <span className="text-muted-foreground">Completion</span>
                <span className="font-mono font-semibold">{pct}%</span>
              </div>
              <Progress value={pct} className="h-1.5" />
            </div>

            {/* CTA arrow */}
            <div className="flex justify-end">
              <ArrowRight className="h-4 w-4 text-muted-foreground group-hover:text-primary group-hover:translate-x-1 transition-all duration-200" />
            </div>
          </button>
        );
      })}
    </div>
  );
}

// ─── Stats bar ────────────────────────────────────────────────────────────────

function StatsBar({ courses }: { courses: CourseWithStats[] }) {
  const totalExps = courses.reduce((s, c) => s + c.totalExperiments, 0);
  const totalCompleted = courses.reduce((s, c) => s + c.completedExperiments, 0);
  const totalInProg = courses.reduce((s, c) => s + c.inProgressExperiments, 0);

  return (
    <div
      className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-10 opacity-0 animate-fade-up"
      style={{ animationDelay: "0.08s" }}
    >
      {[
        {
          label: "Courses",
          value: courses.length,
          icon: GraduationCap,
          cls: "text-primary",
        },
        {
          label: "Experiments",
          value: totalExps,
          icon: FlaskConical,
          cls: "text-foreground",
        },
        {
          label: "Completed",
          value: totalCompleted,
          icon: CheckCircle2,
          cls: "text-emerald-400",
        },
        {
          label: "In Progress",
          value: totalInProg,
          icon: Clock,
          cls: "text-amber-400",
        },
      ].map((s) => (
        <div key={s.label} className="glass-card p-4 flex items-center gap-3">
          <s.icon className={cn("h-5 w-5 shrink-0", s.cls)} />
          <div>
            <p className="text-2xl font-bold leading-none">{s.value}</p>
            <p className="font-mono text-[10px] text-muted-foreground tracking-widest uppercase mt-1">
              {s.label}
            </p>
          </div>
        </div>
      ))}
    </div>
  );
}

// ─── Main component ───────────────────────────────────────────────────────────

const StudentDashboard = () => {
  const { user } = useAuth();
  const navigate = useNavigate();

  const [courses, setCourses] = useState<CourseWithStats[]>([]);
  const [loading, setLoading] = useState(true);
  const [usingDemo, setUsingDemo] = useState(false);

  useEffect(() => {
    if (user) fetchData();
  }, [user]); // eslint-disable-line

  const fetchData = async () => {
    try {
      setLoading(true);
      setUsingDemo(false);

      // Fetch enrolled courses
      const { data: enrollments, error: enrollErr } = await supabase
        .from("enrollments")
        .select("course:courses(*)")
        .eq("student_id", user!.id);

      // Use demo data if schema is missing
      if (isSchemaMissing(enrollErr)) {
        setUsingDemo(true);
        setCourses(DEMO_COURSES);
        return;
      }

      if (enrollErr) throw enrollErr;
      if (!enrollments?.length) {
        setCourses([]);
        return;
      }

      const courseList = enrollments.map((e: any) => e.course as Course);
      const courseIds = courseList.map((c) => c.id);

      // Fetch experiments + lab records
      const { data: experiments, error: expErr } = await supabase
        .from("experiments")
        .select("id, course_id, lab_records(status, student_id)")
        .in("course_id", courseIds);

      if (isSchemaMissing(expErr)) {
        const withStats = courseList.map((course) => ({
          ...course,
          totalExperiments: 0,
          completedExperiments: 0,
          inProgressExperiments: 0,
        }));
        setCourses(withStats);
        return;
      }

      if (expErr) throw expErr;

      // Compute stats
      const withStats: CourseWithStats[] = courseList.map((course) => {
        const exps = (experiments as ExperimentRow[] | null ?? []).filter(
          (e) => e.course_id === course.id
        );
        const mine = (r: { status: string; student_id: string }) =>
          r.student_id === user!.id;

        return {
          ...course,
          totalExperiments: exps.length,
          completedExperiments: exps.filter((e) =>
            e.lab_records?.some((r) => mine(r) && r.status === "submitted")
          ).length,
          inProgressExperiments: exps.filter((e) =>
            e.lab_records?.some((r) => mine(r) && r.status === "draft")
          ).length,
        };
      });

      setCourses(withStats);
    } catch (error) {
      console.error("Error fetching courses:", error);
      // Use demo data on error
      setUsingDemo(true);
      setCourses(DEMO_COURSES);
    } finally {
      setLoading(false);
    }
  };

  const handleCardClick = (id: number) => {
    navigate(`/student/course/${id}`);
  };

  return (
    <AppLayout>
      <div className="px-6 py-8 max-w-6xl mx-auto">
        {/* Header */}
        <div className="mb-10 opacity-0 animate-fade-up">
          <p className="font-mono text-[10px] text-muted-foreground tracking-widest uppercase">
            Student Dashboard
          </p>
          <h1 className="text-3xl md:text-4xl font-bold tracking-tight mt-2">
            My Courses
          </h1>
          <p className="text-muted-foreground text-sm mt-1">
            Track your progress across all enrolled lab courses.
          </p>
        </div>

        {/* DB setup banner */}
        {usingDemo && (
          <div className="mb-8 opacity-0 animate-fade-up glass-card border border-amber-500/30 bg-amber-500/5 p-4 flex items-start gap-3">
            <Database className="h-5 w-5 text-amber-400 shrink-0 mt-0.5" />
            <div className="flex-1 min-w-0">
              <p className="text-sm font-semibold text-amber-400">
                Showing demo courses
              </p>
              <p className="text-xs text-muted-foreground mt-0.5">
                When connected to Supabase, your enrolled courses will appear
                here with live progress tracking.
              </p>
            </div>
            <button
              onClick={fetchData}
              className="shrink-0 inline-flex items-center gap-1 text-xs text-muted-foreground hover:text-foreground transition-colors"
              aria-label="Retry fetching courses"
            >
              <RefreshCw className="h-3.5 w-3.5" />
            </button>
          </div>
        )}

        {/* Loading State */}
        {loading && (
          <div className="grid md:grid-cols-2 gap-5">
            {Array.from({ length: 4 }).map((_, i) => (
              <CourseCardSkeleton key={i} />
            ))}
          </div>
        )}

        {/* Courses + Stats */}
        {!loading && (
          <>
            <StatsBar courses={courses} />
            <CourseGrid courses={courses} onCardClick={handleCardClick} />
          </>
        )}

        {/* Empty State */}
        {!loading && courses.length === 0 && !usingDemo && (
          <div className="glass-card p-12 text-center border-dashed opacity-0 animate-fade-up">
            <BookOpen className="mx-auto h-10 w-10 text-muted-foreground mb-3" />
            <p className="text-muted-foreground">
              You are not enrolled in any courses yet.
            </p>
          </div>
        )}
      </div>
    </AppLayout>
  );
};

export default StudentDashboard;