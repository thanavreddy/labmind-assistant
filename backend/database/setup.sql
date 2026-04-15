-- LabMind Backend Database Setup
-- Run this SQL in your Supabase SQL editor to create supporting tables
-- Note: profiles table already exists and is integrated with auth.users

-- 1. Experiments Table
CREATE TABLE IF NOT EXISTS public.experiments (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    title VARCHAR(255) NOT NULL,
    description TEXT,
    course VARCHAR(50) NOT NULL, -- CS201, CS301, CS302
    created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
) TABLESPACE pg_default;

CREATE INDEX IF NOT EXISTS idx_experiments_course ON public.experiments USING btree (course) TABLESPACE pg_default;

-- 2. Experiment Submissions (tracks student progress)
CREATE TABLE IF NOT EXISTS public.experiment_submissions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    student_id UUID NOT NULL,
    experiment_id UUID NOT NULL,
    status VARCHAR(50) DEFAULT 'pending' CHECK (status IN ('pending', 'in_progress', 'completed')),
    progress FLOAT DEFAULT 0 CHECK (progress >= 0 AND progress <= 100),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
    CONSTRAINT fk_student FOREIGN KEY (student_id) REFERENCES public.profiles(id) ON DELETE CASCADE,
    CONSTRAINT fk_experiment FOREIGN KEY (experiment_id) REFERENCES public.experiments(id) ON DELETE CASCADE,
    CONSTRAINT unique_submission UNIQUE (student_id, experiment_id)
) TABLESPACE pg_default;

CREATE INDEX IF NOT EXISTS idx_submissions_student ON public.experiment_submissions USING btree (student_id) TABLESPACE pg_default;
CREATE INDEX IF NOT EXISTS idx_submissions_experiment ON public.experiment_submissions USING btree (experiment_id) TABLESPACE pg_default;
CREATE INDEX IF NOT EXISTS idx_submissions_status ON public.experiment_submissions USING btree (status) TABLESPACE pg_default;

-- 3. Comprehension Answers (quiz submissions)
CREATE TABLE IF NOT EXISTS public.comprehension_answers (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    student_id UUID NOT NULL,
    experiment_id UUID NOT NULL,
    answers JSONB NOT NULL, -- {"question_id": "answer_text"}
    score FLOAT NOT NULL CHECK (score >= 0 AND score <= 100),
    feedback JSONB, -- {"question_id": {"score": X, "feedback": "text", "key_points": []}}
    submitted_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
    CONSTRAINT fk_student_answers FOREIGN KEY (student_id) REFERENCES public.profiles(id) ON DELETE CASCADE,
    CONSTRAINT fk_experiment_answers FOREIGN KEY (experiment_id) REFERENCES public.experiments(id) ON DELETE CASCADE
) TABLESPACE pg_default;

CREATE INDEX IF NOT EXISTS idx_answers_student ON public.comprehension_answers USING btree (student_id) TABLESPACE pg_default;
CREATE INDEX IF NOT EXISTS idx_answers_experiment ON public.comprehension_answers USING btree (experiment_id) TABLESPACE pg_default;

-- 4. Lab Records
CREATE TABLE IF NOT EXISTS public.lab_records (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    student_id UUID NOT NULL,
    experiment_id UUID NOT NULL,
    aim TEXT,
    theory TEXT,
    algorithm TEXT,
    code TEXT,
    output TEXT,
    conclusion TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
    CONSTRAINT fk_student_records FOREIGN KEY (student_id) REFERENCES public.profiles(id) ON DELETE CASCADE,
    CONSTRAINT fk_experiment_records FOREIGN KEY (experiment_id) REFERENCES public.experiments(id) ON DELETE CASCADE,
    CONSTRAINT unique_record UNIQUE (student_id, experiment_id)
) TABLESPACE pg_default;

CREATE INDEX IF NOT EXISTS idx_records_student ON public.lab_records USING btree (student_id) TABLESPACE pg_default;
CREATE INDEX IF NOT EXISTS idx_records_experiment ON public.lab_records USING btree (experiment_id) TABLESPACE pg_default;

-- 5. AI Conversations (chat history - optional)
CREATE TABLE IF NOT EXISTS public.ai_conversations (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    student_id UUID NOT NULL,
    experiment_id UUID NOT NULL,
    role VARCHAR(20) NOT NULL CHECK (role IN ('user', 'assistant')),
    content TEXT NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
    CONSTRAINT fk_student_chat FOREIGN KEY (student_id) REFERENCES public.profiles(id) ON DELETE CASCADE,
    CONSTRAINT fk_experiment_chat FOREIGN KEY (experiment_id) REFERENCES public.experiments(id) ON DELETE CASCADE
) TABLESPACE pg_default;

CREATE INDEX IF NOT EXISTS idx_chat_student ON public.ai_conversations USING btree (student_id) TABLESPACE pg_default;
CREATE INDEX IF NOT EXISTS idx_chat_experiment ON public.ai_conversations USING btree (experiment_id) TABLESPACE pg_default;
CREATE INDEX IF NOT EXISTS idx_chat_created ON public.ai_conversations USING btree (created_at) TABLESPACE pg_default;

-- Enable Row Level Security (RLS) for security
ALTER TABLE public.experiments ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.experiment_submissions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.comprehension_answers ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.lab_records ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.ai_conversations ENABLE ROW LEVEL SECURITY;

-- RLS Policies for experiment_submissions (students can only see their own)
CREATE POLICY "students_view_own_submissions" ON public.experiment_submissions
    FOR SELECT USING (student_id = auth.uid());

CREATE POLICY "students_insert_own_submissions" ON public.experiment_submissions
    FOR INSERT WITH CHECK (student_id = auth.uid());

CREATE POLICY "students_update_own_submissions" ON public.experiment_submissions
    FOR UPDATE USING (student_id = auth.uid());

-- RLS Policies for comprehension_answers
CREATE POLICY "students_view_own_answers" ON public.comprehension_answers
    FOR SELECT USING (student_id = auth.uid());

CREATE POLICY "students_insert_own_answers" ON public.comprehension_answers
    FOR INSERT WITH CHECK (student_id = auth.uid());

-- RLS Policies for lab_records
CREATE POLICY "students_view_own_records" ON public.lab_records
    FOR SELECT USING (student_id = auth.uid());

CREATE POLICY "students_insert_own_records" ON public.lab_records
    FOR INSERT WITH CHECK (student_id = auth.uid());

CREATE POLICY "students_update_own_records" ON public.lab_records
    FOR UPDATE USING (student_id = auth.uid());

-- RLS Policies for ai_conversations
CREATE POLICY "students_view_own_conversations" ON public.ai_conversations
    FOR SELECT USING (student_id = auth.uid());

CREATE POLICY "students_insert_own_conversations" ON public.ai_conversations
    FOR INSERT WITH CHECK (student_id = auth.uid());

-- Allow experiments table to be viewed by everyone (read-only)
CREATE POLICY "experiments_viewable_by_all" ON public.experiments
    FOR SELECT USING (true);

GRANT ALL ON public.experiments TO authenticated;
GRANT ALL ON public.experiment_submissions TO authenticated;
GRANT ALL ON public.comprehension_answers TO authenticated;
GRANT ALL ON public.lab_records TO authenticated;
GRANT ALL ON public.ai_conversations TO authenticated;
