/**
 * CourseExperiments.tsx
 * Route: /student/course/:courseId
 *
 * Lists all experiments in a course with live status from lab_records.
 * Falls back to demo data when DB tables are missing.
 */
import { useEffect, useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { useAuth } from '@/contexts/AuthContext'
import { supabase } from '@/lib/supabase'
import AppLayout from '@/components/AppLayout'
import { Badge } from '@/components/ui/badge'
import { Progress } from '@/components/ui/progress'
import { Skeleton } from '@/components/ui/skeleton'
import { Separator } from '@/components/ui/separator'
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs'
import {
  ChevronLeft, FlaskConical, Clock, CheckCircle2,
  Circle, PlayCircle, AlertCircle, ArrowRight,
  Users, BarChart2, RefreshCw, Database,
} from 'lucide-react'
import { cn } from '@/lib/utils'

// ─── Types ────────────────────────────────────────────────────────────────────

interface Course {
  id: number; title: string; code: string; instructor_name: string | null
}

interface Experiment {
  id: number; course_id: number; title: string; description: string | null
  subject_area: string | null; estimated_time: string | null
  difficulty_level: 'beginner' | 'intermediate' | 'advanced' | null
  lab_records: { status: 'draft' | 'submitted'; student_id: string }[]
}

type ExperimentStatus = 'pending' | 'in-progress' | 'completed'
type FilterTab = 'all' | ExperimentStatus

interface ExperimentWithStatus extends Experiment {
  status: ExperimentStatus
}

// ─── Config maps ──────────────────────────────────────────────────────────────

const DIFFICULTY = {
  beginner:     { label: 'Beginner',     cls: 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20' },
  intermediate: { label: 'Intermediate', cls: 'bg-amber-500/10 text-amber-400 border-amber-500/20'     },
  advanced:     { label: 'Advanced',     cls: 'bg-rose-500/10 text-rose-400 border-rose-500/20'         },
}

const STATUS = {
  pending:       { label: 'Pending',     Icon: Circle,       cls: 'bg-muted/50 text-muted-foreground border-border'      },
  'in-progress': { label: 'In Progress', Icon: PlayCircle,   cls: 'bg-amber-500/10 text-amber-400 border-amber-500/20'  },
  completed:     { label: 'Completed',   Icon: CheckCircle2, cls: 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20' },
}

// ─── Demo data ────────────────────────────────────────────────────────────────

const DEMO_COURSE: Course = {
  id: 1, code: 'CS201', title: 'Data Structures Lab', instructor_name: 'Dr. A. Smith',
}

const DEMO_EXPERIMENTS: ExperimentWithStatus[] = [
  { id: 1, course_id: 1, title: 'Bubble Sort Implementation',   subject_area: 'Sorting Algorithms',  difficulty_level: 'beginner',     estimated_time: '45 min',  description: null, lab_records: [], status: 'completed'   },
  { id: 2, course_id: 1, title: 'Linked List Operations',       subject_area: 'Data Structures',     difficulty_level: 'intermediate', estimated_time: '60 min',  description: null, lab_records: [], status: 'in-progress' },
  { id: 3, course_id: 1, title: 'Binary Search Tree',           subject_area: 'Trees',               difficulty_level: 'intermediate', estimated_time: '75 min',  description: null, lab_records: [], status: 'in-progress' },
  { id: 4, course_id: 1, title: 'Stack & Queue using Arrays',   subject_area: 'Data Structures',     difficulty_level: 'beginner',     estimated_time: '50 min',  description: null, lab_records: [], status: 'completed'   },
  { id: 5, course_id: 1, title: 'Graph BFS & DFS',              subject_area: 'Graph Algorithms',    difficulty_level: 'advanced',     estimated_time: '90 min',  description: null, lab_records: [], status: 'pending'     },
  { id: 6, course_id: 1, title: 'Heap Sort',                    subject_area: 'Sorting Algorithms',  difficulty_level: 'advanced',     estimated_time: '80 min',  description: null, lab_records: [], status: 'pending'     },
  { id: 7, course_id: 1, title: 'Hash Table Implementation',    subject_area: 'Hashing',             difficulty_level: 'intermediate', estimated_time: '70 min',  description: null, lab_records: [], status: 'pending'     },
  { id: 8, course_id: 1, title: 'AVL Tree Rotations',           subject_area: 'Trees',               difficulty_level: 'advanced',     estimated_time: '90 min',  description: null, lab_records: [], status: 'pending'     },
]

// ─── Helpers ─────────────────────────────────────────────────────────────────

const isSchemaMissing = (err: any) =>
  err?.code === 'PGRST200' ||
  err?.message?.toLowerCase().includes('schema cache') ||
  err?.message?.toLowerCase().includes('does not exist') ||
  err?.message?.toLowerCase().includes('relation') ||
  err?.hint?.toLowerCase().includes('schema')

function deriveStatus(exp: Experiment, userId: string): ExperimentStatus {
  const mine = exp.lab_records?.find(r => r.student_id === userId)
  if (!mine) return 'pending'
  return mine.status === 'submitted' ? 'completed' : 'in-progress'
}

// ─── Skeletons ────────────────────────────────────────────────────────────────

function ExpSkeleton() {
  return (
    <div className="glass-card p-5 flex items-center gap-4">
      <Skeleton className="h-10 w-10 rounded-xl shrink-0" />
      <div className="flex-1 space-y-2">
        <Skeleton className="h-4 w-48" />
        <Skeleton className="h-3 w-32" />
      </div>
      <Skeleton className="h-6 w-20 rounded-full" />
    </div>
  )
}

// ─── Main component ───────────────────────────────────────────────────────────

export default function CourseExperiments() {
  const { courseId } = useParams<{ courseId: string }>()
  const { user } = useAuth()
  const navigate = useNavigate()

  const [course,      setCourse]      = useState<Course | null>(null)
  const [experiments, setExperiments] = useState<ExperimentWithStatus[]>([])
  const [loading,     setLoading]     = useState(true)
  const [fatalError,  setFatalError]  = useState<string | null>(null)
  const [usingDemo,   setUsingDemo]   = useState(false)
  const [filter,      setFilter]      = useState<FilterTab>('all')

  useEffect(() => { if (user && courseId) fetchData() }, [user, courseId]) // eslint-disable-line

  const fetchData = async () => {
    try {
      setLoading(true); setFatalError(null); setUsingDemo(false)

      const [courseRes, expRes] = await Promise.all([
        supabase.from('courses').select('*').eq('id', Number(courseId)).single(),
        supabase
          .from('experiments')
          .select('*, lab_records(status, student_id)')
          .eq('course_id', Number(courseId))
          .order('id'),
      ])

      // Schema missing — use demo
      if (isSchemaMissing(courseRes.error) || isSchemaMissing(expRes.error)) {
        setUsingDemo(true)
        setCourse(DEMO_COURSE)
        setExperiments(DEMO_EXPERIMENTS)
        return
      }

      if (courseRes.error) throw courseRes.error
      if (expRes.error)    throw expRes.error

      setCourse(courseRes.data as Course)
      setExperiments(
        (expRes.data as Experiment[]).map(exp => ({
          ...exp,
          status: deriveStatus(exp, user!.id),
        }))
      )
    } catch (err: any) {
      setFatalError(err?.message ?? 'Failed to load experiments.')
    } finally {
      setLoading(false)
    }
  }

  const filtered = filter === 'all' ? experiments : experiments.filter(e => e.status === filter)
  const completed  = experiments.filter(e => e.status === 'completed').length
  const inProgress = experiments.filter(e => e.status === 'in-progress').length
  const pct = experiments.length ? Math.round((completed / experiments.length) * 100) : 0

  const counts: Record<FilterTab, number> = {
    all:           experiments.length,
    pending:       experiments.filter(e => e.status === 'pending').length,
    'in-progress': inProgress,
    completed,
  }

  const handleExpClick = (id: number) => {
    if (usingDemo) return
    navigate(`/student/experiment/${id}`)
  }

  return (
    <AppLayout>
      <div className="px-6 py-8 max-w-5xl mx-auto">

        {/* ── Back ─────────────────────────────────────────────────────────── */}
        <button
          onClick={() => navigate('/student-dashboard')}
          className="inline-flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground transition-colors mb-8 group"
        >
          <ChevronLeft className="h-4 w-4 group-hover:-translate-x-0.5 transition-transform" />
          Back to Courses
        </button>

        {/* ── Demo banner ──────────────────────────────────────────────────── */}
        {usingDemo && (
          <div className="mb-6 glass-card border border-amber-500/30 bg-amber-500/5 p-4 flex items-start gap-3">
            <Database className="h-5 w-5 text-amber-400 shrink-0 mt-0.5" />
            <div className="flex-1 min-w-0">
              <p className="text-sm font-semibold text-amber-400">Showing demo data</p>
              <p className="text-xs text-muted-foreground mt-0.5">
                The <code className="font-mono bg-muted px-1 rounded">courses</code> / {' '}
                <code className="font-mono bg-muted px-1 rounded">experiments</code> tables are missing.
                Run the SQL schema in Supabase to enable live data.
              </p>
            </div>
            <button onClick={fetchData} className="shrink-0 inline-flex items-center gap-1 text-xs text-muted-foreground hover:text-foreground">
              <RefreshCw className="h-3.5 w-3.5" /> Retry
            </button>
          </div>
        )}

        {/* ── Course header ─────────────────────────────────────────────────── */}
        {!loading && course && (
          <div className="glass-card p-6 mb-8 opacity-0 animate-fade-up">
            <div className="flex flex-col md:flex-row md:items-center gap-4">
              <div className="h-14 w-14 rounded-2xl bg-primary/10 flex items-center justify-center shrink-0">
                <FlaskConical className="h-7 w-7 text-primary" />
              </div>
              <div className="flex-1 min-w-0">
                <span className="font-mono text-xs text-primary font-semibold tracking-wider">{course.code}</span>
                <h1 className="text-2xl font-bold tracking-tight">{course.title}</h1>
                {course.instructor_name && (
                  <div className="flex items-center gap-1.5 text-sm text-muted-foreground mt-1">
                    <Users className="h-3.5 w-3.5" />
                    <span>{course.instructor_name}</span>
                  </div>
                )}
              </div>
              <div className="flex flex-col items-center shrink-0">
                <span className="text-3xl font-bold">{pct}%</span>
                <span className="text-xs text-muted-foreground font-mono uppercase tracking-wider">Complete</span>
              </div>
            </div>

            <Separator className="my-4" />

            <div className="flex items-center gap-6 flex-wrap text-sm">
              {[
                { label: 'Total',       value: experiments.length, cls: 'text-foreground'         },
                { label: 'Completed',   value: completed,           cls: 'text-emerald-400'        },
                { label: 'In Progress', value: inProgress,          cls: 'text-amber-400'          },
                { label: 'Pending',     value: counts.pending,      cls: 'text-muted-foreground'   },
              ].map(s => (
                <div key={s.label} className="flex items-center gap-2">
                  <span className={cn('text-xl font-bold', s.cls)}>{s.value}</span>
                  <span className="text-muted-foreground text-xs">{s.label}</span>
                </div>
              ))}
            </div>
            <Progress value={pct} className="mt-4 h-1.5" />
          </div>
        )}

        {/* ── Header skeleton ──────────────────────────────────────────────── */}
        {loading && (
          <div className="glass-card p-6 mb-8 space-y-4">
            <div className="flex gap-4">
              <Skeleton className="h-14 w-14 rounded-2xl shrink-0" />
              <div className="flex-1 space-y-2">
                <Skeleton className="h-4 w-20" />
                <Skeleton className="h-7 w-64" />
                <Skeleton className="h-4 w-40" />
              </div>
            </div>
          </div>
        )}

        {/* ── Filter tabs ──────────────────────────────────────────────────── */}
        {!loading && !fatalError && (
          <Tabs
            value={filter}
            onValueChange={v => setFilter(v as FilterTab)}
            className="mb-5 opacity-0 animate-fade-up"
            style={{ animationDelay: '0.12s' }}
          >
            <TabsList className="grid grid-cols-4 w-full max-w-sm">
              {(['all', 'pending', 'in-progress', 'completed'] as FilterTab[]).map(tab => (
                <TabsTrigger key={tab} value={tab} className="text-xs capitalize">
                  {tab === 'in-progress' ? 'In Progress' : tab.charAt(0).toUpperCase() + tab.slice(1)}
                  <span className="ml-1 text-[10px] opacity-60">({counts[tab]})</span>
                </TabsTrigger>
              ))}
            </TabsList>
          </Tabs>
        )}

        {/* ── Fatal error ──────────────────────────────────────────────────── */}
        {!loading && fatalError && (
          <div className="glass-card p-10 text-center space-y-3">
            <AlertCircle className="h-10 w-10 text-destructive mx-auto" />
            <p className="text-sm text-destructive">{fatalError}</p>
            <button onClick={fetchData} className="inline-flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground">
              <RefreshCw className="h-3.5 w-3.5" /> Retry
            </button>
          </div>
        )}

        {/* ── Experiment list ──────────────────────────────────────────────── */}
        {loading && (
          <div className="space-y-3">
            {Array.from({ length: 5 }).map((_, i) => <ExpSkeleton key={i} />)}
          </div>
        )}

        {!loading && !fatalError && filtered.length === 0 && (
          <div className="glass-card p-12 text-center">
            <BarChart2 className="h-10 w-10 text-muted-foreground mx-auto mb-3 opacity-40" />
            <p className="font-medium">No {filter !== 'all' ? filter.replace('-', ' ') : ''} experiments found</p>
            {filter !== 'all' && (
              <button onClick={() => setFilter('all')} className="text-sm text-primary mt-2 hover:underline">
                Show all experiments
              </button>
            )}
          </div>
        )}

        {!loading && !fatalError && filtered.length > 0 && (
          <div className="space-y-3">
            {filtered.map((exp, i) => {
              const st = STATUS[exp.status]
              const df = exp.difficulty_level ? DIFFICULTY[exp.difficulty_level] : null

              return (
                <button
                  key={exp.id}
                  onClick={() => handleExpClick(exp.id)}
                  className={cn(
                    'glass-card p-5 w-full text-left group flex items-center gap-4',
                    'transition-all duration-200 hover:-translate-y-0.5 hover:border-primary/30 hover:shadow-md',
                    'opacity-0 animate-fade-up focus:outline-none focus-visible:ring-2 focus-visible:ring-ring',
                    usingDemo && 'cursor-default',
                  )}
                  style={{ animationDelay: `${i * 0.05}s` }}
                >
                  <div className="h-10 w-10 rounded-xl bg-primary/10 flex items-center justify-center shrink-0 font-mono text-sm font-bold text-primary">
                    {String(i + 1).padStart(2, '0')}
                  </div>
                  <div className="flex-1 min-w-0">
                    <h3 className="font-semibold text-sm leading-snug truncate mb-1.5">{exp.title}</h3>
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className={cn('inline-flex items-center gap-1 text-[11px] font-medium px-2 py-0.5 rounded-full border', st.cls)}>
                        <st.Icon className="h-3 w-3" /> {st.label}
                      </span>
                      {df && <span className={cn('text-[11px] font-medium px-2 py-0.5 rounded-full border', df.cls)}>{df.label}</span>}
                      {exp.estimated_time && (
                        <span className="inline-flex items-center gap-1 text-[11px] text-muted-foreground">
                          <Clock className="h-3 w-3" /> {exp.estimated_time}
                        </span>
                      )}
                    </div>
                  </div>
                  {!usingDemo && (
                    <ArrowRight className="h-4 w-4 text-muted-foreground group-hover:text-primary group-hover:translate-x-1 transition-all duration-200 shrink-0" />
                  )}
                </button>
              )
            })}
          </div>
        )}
      </div>
    </AppLayout>
  )
}
