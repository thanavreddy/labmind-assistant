/**
 * ExperimentDetails.tsx
 * Route: /student/experiment/:experimentId
 *
 * Shows experiment info, step-by-step guide, video, and lab record upload.
 * Falls back to demo data when DB tables are missing.
 */
import { useEffect, useRef, useState, DragEvent } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { useAuth } from '@/contexts/AuthContext'
import { supabase } from '@/lib/supabase'
import AppLayout from '@/components/AppLayout'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Separator } from '@/components/ui/separator'
import { Skeleton } from '@/components/ui/skeleton'
import { Textarea } from '@/components/ui/textarea'
import {
  ChevronLeft, FlaskConical, Clock, AlertTriangle,
  CheckCircle2, PlayCircle, Upload, FileText, Video,
  Loader2, RefreshCw, AlertCircle, BookOpen, Lightbulb,
  Save, Send, ExternalLink, Database, Circle,
} from 'lucide-react'
import { cn } from '@/lib/utils'

// ─── Types ────────────────────────────────────────────────────────────────────

interface Experiment {
  id: number
  course_id: number
  title: string
  description: string | null
  subject_area: string | null
  estimated_time: string | null
  difficulty_level: 'beginner' | 'intermediate' | 'advanced' | null
  steps: string | null
  video_url: string | null
  common_mistakes: string | null
}

interface LabRecord {
  id: number
  status: 'draft' | 'submitted'
  content: string | null
  file_url: string | null
  submitted_at: string | null
  created_at: string
}

type ExperimentStatus = 'pending' | 'in-progress' | 'completed'

// ─── Demo data ────────────────────────────────────────────────────────────────

const DEMO_EXPERIMENT: Experiment = {
  id: 1,
  course_id: 1,
  title: 'Bubble Sort Implementation',
  description:
    'In this experiment, you will implement the Bubble Sort algorithm in your preferred programming language. ' +
    'Bubble Sort is a simple comparison-based sorting algorithm where adjacent elements are repeatedly swapped ' +
    'if they are in the wrong order. You will analyse the time and space complexity and verify correctness with test cases.',
  subject_area: 'Sorting Algorithms',
  estimated_time: '45 min',
  difficulty_level: 'beginner',
  video_url: 'https://www.youtube.com/watch?v=xli_FI7CuzA',
  steps: [
    'Understand the bubble sort algorithm by tracing through a small example array by hand.',
    'Define a function bubbleSort(arr) that accepts an integer array.',
    'Use two nested loops: the outer loop runs n-1 times, the inner loop compares adjacent pairs.',
    'If arr[j] > arr[j+1], swap the two elements.',
    'Add a boolean flag "swapped". If a full inner pass completes without a swap, the array is already sorted — break early.',
    'Test with: [64, 34, 25, 12, 22, 11, 90] → expected: [11, 12, 22, 25, 34, 64, 90].',
    'Test edge cases: empty array [], single element [5], already sorted [1,2,3], reverse sorted [9,8,7].',
    'Calculate and note the best-case O(n), worst-case O(n²), and space complexity O(1).',
  ].join('\n'),
  common_mistakes: [
    'Forgetting to reset the "swapped" flag at the start of each outer iteration.',
    'Using the wrong loop bounds — inner loop should run up to n-i-1 (not n) to avoid redundant comparisons.',
    'Swapping indices instead of values, resulting in index-out-of-bounds errors.',
    'Not testing with edge cases like an already-sorted or reverse-sorted array.',
    'Confusing Bubble Sort with Selection Sort during the writeup.',
  ].join('\n'),
}

const DEMO_LAB_RECORD: LabRecord | null = null   // starts with no record (pending)

// ─── Helpers ─────────────────────────────────────────────────────────────────

const isSchemaMissing = (err: any) =>
  err?.code === 'PGRST200' ||
  err?.message?.toLowerCase().includes('schema cache') ||
  err?.message?.toLowerCase().includes('does not exist') ||
  err?.message?.toLowerCase().includes('relation') ||
  err?.hint?.toLowerCase().includes('schema')

function parseListField(raw: string | null): string[] {
  if (!raw) return []
  try {
    const p = JSON.parse(raw)
    if (Array.isArray(p)) return p.map(String)
  } catch { /* not JSON */ }
  return raw.split('\n').map(s => s.trim()).filter(Boolean)
}

function youTubeId(url: string): string | null {
  const m = url.match(/(?:youtube\.com\/watch\?v=|youtu\.be\/)([^&?#\s]+)/)
  return m?.[1] ?? null
}

// ─── Badge configs ────────────────────────────────────────────────────────────

const DIFFICULTY_CLS = {
  beginner:     'bg-emerald-500/10 text-emerald-400 border-emerald-500/20',
  intermediate: 'bg-amber-500/10 text-amber-400 border-amber-500/20',
  advanced:     'bg-rose-500/10 text-rose-400 border-rose-500/20',
}

// ─── Drop zone ────────────────────────────────────────────────────────────────

function DropZone({
  file, onFile, disabled,
}: { file: File | null; onFile: (f: File) => void; disabled?: boolean }) {
  const inputRef = useRef<HTMLInputElement>(null)
  const [dragging, setDragging] = useState(false)

  const handle = (f: File) => {
    if (f.size > 20 * 1024 * 1024) { alert('File must be ≤ 20 MB'); return }
    onFile(f)
  }

  return (
    <div
      onClick={() => !disabled && inputRef.current?.click()}
      onDragOver={e => { e.preventDefault(); setDragging(true) }}
      onDragLeave={() => setDragging(false)}
      onDrop={(e: DragEvent) => { e.preventDefault(); setDragging(false); const f = e.dataTransfer.files?.[0]; if (f) handle(f) }}
      className={cn(
        'flex flex-col items-center justify-center gap-3 rounded-xl border-2 border-dashed p-10 text-center transition-all cursor-pointer',
        dragging ? 'border-primary bg-primary/5 scale-[1.01]' : 'border-border hover:border-primary/40 hover:bg-muted/30',
        disabled && 'opacity-50 cursor-not-allowed pointer-events-none',
        file ? 'border-emerald-500/40 bg-emerald-500/5' : '',
      )}
    >
      <input ref={inputRef} type="file" className="sr-only"
        accept=".pdf,.doc,.docx,.txt,.zip,.png,.jpg,.jpeg"
        onChange={e => { const f = e.target.files?.[0]; if (f) handle(f) }}
      />
      {file ? (
        <>
          <div className="h-12 w-12 rounded-xl bg-emerald-500/10 flex items-center justify-center">
            <CheckCircle2 className="h-6 w-6 text-emerald-400" />
          </div>
          <p className="text-sm font-medium text-emerald-400">{file.name}</p>
          <p className="text-xs text-muted-foreground">{(file.size / 1024).toFixed(1)} KB · Click to change</p>
        </>
      ) : (
        <>
          <div className="h-12 w-12 rounded-xl bg-primary/10 flex items-center justify-center">
            <Upload className="h-6 w-6 text-primary" />
          </div>
          <div>
            <p className="text-sm font-medium">Drop your lab record here</p>
            <p className="text-xs text-muted-foreground mt-0.5">PDF, DOC, DOCX, TXT, ZIP, or image · Max 20 MB</p>
          </div>
        </>
      )}
    </div>
  )
}

// ─── Main component ───────────────────────────────────────────────────────────

export default function ExperimentDetails() {
  const { experimentId } = useParams<{ experimentId: string }>()
  const { user } = useAuth()
  const navigate = useNavigate()

  const [experiment, setExperiment] = useState<Experiment | null>(null)
  const [labRecord,  setLabRecord]  = useState<LabRecord | null>(null)
  const [loading,    setLoading]    = useState(true)
  const [fatalError, setFatalError] = useState<string | null>(null)
  const [usingDemo,  setUsingDemo]  = useState(false)

  const [content,    setContent]    = useState('')
  const [file,       setFile]       = useState<File | null>(null)
  const [saving,     setSaving]     = useState(false)
  const [submitting, setSubmitting] = useState(false)
  const [activeTab,  setActiveTab]  = useState('overview')

  useEffect(() => { if (user && experimentId) fetchData() }, [user, experimentId]) // eslint-disable-line

  const fetchData = async () => {
    try {
      setLoading(true); setFatalError(null); setUsingDemo(false)

      const [expRes, recRes] = await Promise.all([
        supabase.from('experiments').select('*').eq('id', Number(experimentId)).single(),
        supabase.from('lab_records')
          .select('*')
          .eq('experiment_id', Number(experimentId))
          .eq('student_id', user!.id)
          .maybeSingle(),
      ])

      // Schema missing → demo
      if (isSchemaMissing(expRes.error) || isSchemaMissing(recRes.error)) {
        setUsingDemo(true)
        setExperiment(DEMO_EXPERIMENT)
        setLabRecord(DEMO_LAB_RECORD)
        return
      }

      if (expRes.error) throw expRes.error
      setExperiment(expRes.data as Experiment)

      if (!recRes.error && recRes.data) {
        const rec = recRes.data as LabRecord
        setLabRecord(rec)
        setContent(rec.content ?? '')
      }
    } catch (err: any) {
      setFatalError(err?.message ?? 'Failed to load experiment.')
    } finally {
      setLoading(false)
    }
  }

  const status: ExperimentStatus =
    !labRecord ? 'pending' :
    labRecord.status === 'submitted' ? 'completed' : 'in-progress'

  const isSubmitted = status === 'completed'

  // ── Upload to storage ─────────────────────────────────────────────────────

  const uploadFile = async (): Promise<string | null> => {
    if (!file) return labRecord?.file_url ?? null
    const path = `${user!.id}/${experimentId}/${Date.now()}_${file.name}`
    const { error } = await supabase.storage.from('lab-records').upload(path, file, { upsert: true })
    if (error) throw error
    return supabase.storage.from('lab-records').getPublicUrl(path).data.publicUrl
  }

  // ── Save draft ────────────────────────────────────────────────────────────

  const handleSaveDraft = async () => {
    if (!experiment || usingDemo) return
    setSaving(true)
    try {
      const fileUrl = await uploadFile()
      const payload = {
        student_id: user!.id, experiment_id: experiment.id,
        content: content || null, file_url: fileUrl,
        status: 'draft' as const, updated_at: new Date().toISOString(),
      }
      if (labRecord) {
        const { error } = await supabase.from('lab_records').update(payload).eq('id', labRecord.id)
        if (error) throw error
      } else {
        const { data, error } = await supabase.from('lab_records').insert(payload).select().single()
        if (error) throw error
        setLabRecord(data as LabRecord)
      }
      setFile(null); await fetchData()
      alert('Draft saved!')
    } catch (err: any) {
      alert(err?.message ?? 'Failed to save draft.')
    } finally {
      setSaving(false)
    }
  }

  // ── Submit record ─────────────────────────────────────────────────────────

  const handleSubmit = async () => {
    if (!experiment || usingDemo) return
    if (!content.trim() && !file && !labRecord?.file_url) {
      alert('Add content or upload a file before submitting.')
      return
    }
    setSubmitting(true)
    try {
      const fileUrl = await uploadFile()
      const payload = {
        student_id: user!.id, experiment_id: experiment.id,
        content: content || null, file_url: fileUrl,
        status: 'submitted' as const,
        submitted_at: new Date().toISOString(), updated_at: new Date().toISOString(),
      }
      if (labRecord) {
        const { error } = await supabase.from('lab_records').update(payload).eq('id', labRecord.id)
        if (error) throw error
      } else {
        const { data, error } = await supabase.from('lab_records').insert(payload).select().single()
        if (error) throw error
        setLabRecord(data as LabRecord)
      }
      setFile(null); await fetchData()
      alert('Lab record submitted! Experiment marked as completed. 🎉')
    } catch (err: any) {
      alert(err?.message ?? 'Failed to submit.')
    } finally {
      setSubmitting(false)
    }
  }

  // ── Video render ──────────────────────────────────────────────────────────

  const renderVideo = () => {
    if (!experiment?.video_url) return null
    const ytId = youTubeId(experiment.video_url)
    if (ytId) {
      return (
        <div className="aspect-video w-full overflow-hidden rounded-xl border border-border bg-muted">
          <iframe
            src={`https://www.youtube.com/embed/${ytId}`}
            title="Experiment video"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen className="h-full w-full"
          />
        </div>
      )
    }
    return (
      <a href={experiment.video_url} target="_blank" rel="noopener noreferrer"
        className="inline-flex items-center gap-2 text-sm text-primary hover:underline">
        <ExternalLink className="h-4 w-4" /> Watch Video
      </a>
    )
  }

  // ─────────────────────────────────────────────────────────────────────────

  if (!loading && fatalError) {
    return (
      <AppLayout>
        <div className="flex flex-col items-center justify-center min-h-[60vh] gap-4">
          <AlertCircle className="h-10 w-10 text-destructive" />
          <p className="text-sm text-destructive">{fatalError}</p>
          <Button variant="outline" size="sm" onClick={fetchData} className="gap-2">
            <RefreshCw className="h-3.5 w-3.5" /> Retry
          </Button>
        </div>
      </AppLayout>
    )
  }

  const steps    = parseListField(experiment?.steps ?? null)
  const mistakes = parseListField(experiment?.common_mistakes ?? null)

  return (
    <AppLayout>
      <div className="px-6 py-8 max-w-4xl mx-auto">

        {/* ── Back ─────────────────────────────────────────────────────────── */}
        <button
          onClick={() => navigate(experiment?.course_id ? `/student/course/${experiment.course_id}` : '/student-dashboard')}
          className="inline-flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground transition-colors mb-8 group"
        >
          <ChevronLeft className="h-4 w-4 group-hover:-translate-x-0.5 transition-transform" />
          Back to Experiments
        </button>

        {/* ── Demo banner ──────────────────────────────────────────────────── */}
        {usingDemo && (
          <div className="mb-6 glass-card border border-amber-500/30 bg-amber-500/5 p-4 flex items-start gap-3">
            <Database className="h-5 w-5 text-amber-400 shrink-0 mt-0.5" />
            <div className="flex-1 min-w-0">
              <p className="text-sm font-semibold text-amber-400">Showing demo experiment</p>
              <p className="text-xs text-muted-foreground mt-0.5">
                The <code className="font-mono bg-muted px-1 rounded">experiments</code> table is missing.
                Run the SQL schema in Supabase to load real data. Upload &amp; submit are disabled in demo mode.
              </p>
            </div>
            <button onClick={fetchData} className="shrink-0 inline-flex items-center gap-1 text-xs text-muted-foreground hover:text-foreground">
              <RefreshCw className="h-3.5 w-3.5" /> Retry
            </button>
          </div>
        )}

        {/* ── Header ───────────────────────────────────────────────────────── */}
        {loading ? (
          <div className="glass-card p-6 mb-6 space-y-3">
            <Skeleton className="h-7 w-3/4" />
            <div className="flex gap-2">{Array.from({length:3}).map((_,i)=><Skeleton key={i} className="h-5 w-24 rounded-full"/>)}</div>
          </div>
        ) : experiment && (
          <div className="glass-card p-6 mb-6 opacity-0 animate-fade-up">
            <div className="flex items-start gap-4">
              <div className="h-14 w-14 rounded-2xl bg-primary/10 flex items-center justify-center shrink-0">
                <FlaskConical className="h-7 w-7 text-primary" />
              </div>
              <div className="flex-1 min-w-0">
                <h1 className="text-2xl font-bold tracking-tight mb-2">{experiment.title}</h1>
                <div className="flex flex-wrap gap-2 items-center">
                  {/* Status badge */}
                  {status === 'completed' && (
                    <Badge className="gap-1 bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                      <CheckCircle2 className="h-3 w-3" /> Completed
                    </Badge>
                  )}
                  {status === 'in-progress' && (
                    <Badge className="gap-1 bg-amber-500/10 text-amber-400 border border-amber-500/20">
                      <PlayCircle className="h-3 w-3" /> In Progress
                    </Badge>
                  )}
                  {status === 'pending' && (
                    <Badge variant="outline" className="gap-1 text-muted-foreground">
                      <Circle className="h-3 w-3" /> Not Started
                    </Badge>
                  )}
                  {experiment.difficulty_level && (
                    <Badge className={cn('border', DIFFICULTY_CLS[experiment.difficulty_level])}>
                      {experiment.difficulty_level.charAt(0).toUpperCase() + experiment.difficulty_level.slice(1)}
                    </Badge>
                  )}
                  {experiment.subject_area && (
                    <Badge variant="outline" className="text-muted-foreground">{experiment.subject_area}</Badge>
                  )}
                  {experiment.estimated_time && (
                    <span className="inline-flex items-center gap-1 text-xs text-muted-foreground">
                      <Clock className="h-3.5 w-3.5" /> {experiment.estimated_time}
                    </span>
                  )}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* ── Tabs ─────────────────────────────────────────────────────────── */}
        <Tabs value={activeTab} onValueChange={setActiveTab} className="opacity-0 animate-fade-up" style={{ animationDelay: '0.1s' }}>
          <TabsList className="mb-6 w-full max-w-sm grid grid-cols-3">
            <TabsTrigger value="overview"      className="gap-1.5 text-xs"><BookOpen className="h-3.5 w-3.5"/>Overview</TabsTrigger>
            <TabsTrigger value="instructions"  className="gap-1.5 text-xs"><FileText className="h-3.5 w-3.5"/>Instructions</TabsTrigger>
            <TabsTrigger value="record"        className="gap-1.5 text-xs"><Upload className="h-3.5 w-3.5"/>Lab Record</TabsTrigger>
          </TabsList>

          {/* ── Overview ──────────────────────────────────────────────────── */}
          <TabsContent value="overview" className="space-y-6">
            {experiment?.description && (
              <div className="glass-card p-6">
                <h2 className="font-semibold text-sm mb-3 flex items-center gap-2">
                  <BookOpen className="h-4 w-4 text-primary"/> Description
                </h2>
                <p className="text-sm text-muted-foreground leading-relaxed whitespace-pre-line">
                  {experiment.description}
                </p>
              </div>
            )}

            {experiment?.video_url && (
              <div className="glass-card p-6">
                <h2 className="font-semibold text-sm mb-4 flex items-center gap-2">
                  <Video className="h-4 w-4 text-primary"/> Video Explanation
                </h2>
                {renderVideo()}
              </div>
            )}

            <div className="glass-card p-6">
              <h2 className="font-semibold text-sm mb-4 flex items-center gap-2">
                <FlaskConical className="h-4 w-4 text-primary"/> Experiment Info
              </h2>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-4 text-sm">
                {[
                  { label: 'Status',        value: status },
                  { label: 'Difficulty',    value: experiment?.difficulty_level ?? '—' },
                  { label: 'Subject Area',  value: experiment?.subject_area ?? '—' },
                  { label: 'Est. Duration', value: experiment?.estimated_time ?? '—' },
                ].map(item => (
                  <div key={item.label}>
                    <p className="font-mono text-[10px] text-muted-foreground uppercase tracking-wider mb-1">{item.label}</p>
                    <p className="font-medium capitalize">{item.value}</p>
                  </div>
                ))}
              </div>
            </div>

            {status === 'pending' && !loading && (
              <Button className="gap-2 w-full sm:w-auto" onClick={() => setActiveTab('record')}>
                <PlayCircle className="h-4 w-4"/> Start Experiment
              </Button>
            )}
          </TabsContent>

          {/* ── Instructions ──────────────────────────────────────────────── */}
          <TabsContent value="instructions" className="space-y-6">
            <div className="glass-card p-6">
              <h2 className="font-semibold text-sm mb-5 flex items-center gap-2">
                <FileText className="h-4 w-4 text-primary"/> Step-by-Step Execution Guide
              </h2>
              {loading ? (
                <div className="space-y-4">
                  {Array.from({length:5}).map((_,i)=>(
                    <div key={i} className="flex gap-3">
                      <Skeleton className="h-7 w-7 rounded-full shrink-0"/>
                      <div className="flex-1 space-y-1.5 pt-1">
                        <Skeleton className="h-4 w-full"/>
                        <Skeleton className="h-3 w-3/4"/>
                      </div>
                    </div>
                  ))}
                </div>
              ) : steps.length > 0 ? (
                <ol className="space-y-4">
                  {steps.map((step, i) => (
                    <li key={i} className="flex gap-4">
                      <div className="h-7 w-7 rounded-full bg-primary/10 text-primary font-mono text-xs font-bold flex items-center justify-center shrink-0 mt-0.5">
                        {i + 1}
                      </div>
                      <p className="text-sm text-foreground/90 leading-relaxed pt-0.5">{step}</p>
                    </li>
                  ))}
                </ol>
              ) : (
                <p className="text-sm text-muted-foreground italic">No step-by-step guide available for this experiment.</p>
              )}
            </div>

            {mistakes.length > 0 && (
              <div className="glass-card p-6">
                <h2 className="font-semibold text-sm mb-4 flex items-center gap-2">
                  <AlertTriangle className="h-4 w-4 text-amber-400"/> Common Mistakes to Avoid
                </h2>
                <ul className="space-y-3">
                  {mistakes.map((m, i) => (
                    <li key={i} className="flex gap-3 text-sm">
                      <span className="h-5 w-5 rounded-full bg-amber-500/15 text-amber-400 text-[10px] font-bold flex items-center justify-center shrink-0 mt-0.5">
                        {i + 1}
                      </span>
                      <span className="text-foreground/80 leading-relaxed">{m}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {!loading && steps.length === 0 && mistakes.length === 0 && (
              <div className="glass-card p-10 text-center">
                <Lightbulb className="h-9 w-9 text-muted-foreground mx-auto mb-3 opacity-40"/>
                <p className="text-sm text-muted-foreground">No instructions added yet.</p>
              </div>
            )}
          </TabsContent>

          {/* ── Lab Record ────────────────────────────────────────────────── */}
          <TabsContent value="record" className="space-y-6">

            {/* Demo notice */}
            {usingDemo && (
              <div className="glass-card border border-amber-500/30 bg-amber-500/5 p-4 text-sm text-amber-400 flex items-center gap-2">
                <Database className="h-4 w-4 shrink-0"/>
                Upload and submit are disabled in demo mode. Set up the DB schema to enable them.
              </div>
            )}

            {/* Submitted banner */}
            {isSubmitted && !usingDemo && (
              <div className="glass-card p-5 flex items-center gap-4 border-emerald-500/30 bg-emerald-500/5">
                <CheckCircle2 className="h-8 w-8 text-emerald-400 shrink-0"/>
                <div>
                  <p className="font-semibold text-emerald-400">Lab Record Submitted</p>
                  <p className="text-xs text-muted-foreground">
                    {labRecord?.submitted_at
                      ? new Date(labRecord.submitted_at).toLocaleDateString('en-IN', { year:'numeric',month:'long',day:'numeric' })
                      : ''}
                  </p>
                </div>
              </div>
            )}

            {/* Text area */}
            <div className="glass-card p-6">
              <h2 className="font-semibold text-sm mb-1 flex items-center gap-2">
                <FileText className="h-4 w-4 text-primary"/> Lab Report
              </h2>
              <p className="text-xs text-muted-foreground mb-3">Write your aim, observations, results, and conclusion.</p>
              <Textarea
                value={content}
                onChange={e => setContent(e.target.value)}
                placeholder={"Aim: ...\nObservations: ...\nResult: ...\nConclusion: ..."}
                rows={12}
                disabled={isSubmitted || usingDemo}
                className={cn('resize-none font-mono text-xs leading-relaxed', (isSubmitted || usingDemo) && 'opacity-60 cursor-not-allowed')}
              />
            </div>

            {/* File upload */}
            <div className="glass-card p-6">
              <h2 className="font-semibold text-sm mb-1 flex items-center gap-2">
                <Upload className="h-4 w-4 text-primary"/> Upload Lab Record File
              </h2>
              <p className="text-xs text-muted-foreground mb-4">Attach a scanned copy, PDF, or supporting file (max 20 MB).</p>

              {isSubmitted && labRecord?.file_url && !usingDemo ? (
                <a href={labRecord.file_url} target="_blank" rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 text-sm text-primary hover:underline">
                  <FileText className="h-4 w-4"/> View Submitted File <ExternalLink className="h-3.5 w-3.5"/>
                </a>
              ) : (
                <DropZone file={file} onFile={setFile} disabled={isSubmitted || usingDemo} />
              )}
            </div>

            {/* Action buttons */}
            {!isSubmitted && !usingDemo && (
              <div className="flex flex-wrap items-center gap-3">
                <Button id="save-draft-btn" variant="outline" onClick={handleSaveDraft}
                  disabled={saving || submitting} className="gap-2">
                  {saving ? <Loader2 className="h-4 w-4 animate-spin"/> : <Save className="h-4 w-4"/>}
                  {status === 'in-progress' ? 'Update Draft' : 'Save Draft'}
                </Button>
                <Button id="submit-record-btn" onClick={handleSubmit}
                  disabled={saving || submitting} className="gap-2">
                  {submitting ? <Loader2 className="h-4 w-4 animate-spin"/> : <Send className="h-4 w-4"/>}
                  Submit Record
                </Button>
              </div>
            )}

            {!isSubmitted && !usingDemo && (
              <p className="text-xs text-muted-foreground">
                ⚠️ Once submitted, your record cannot be edited. Double-check before submitting.
              </p>
            )}
          </TabsContent>
        </Tabs>
      </div>
    </AppLayout>
  )
}
