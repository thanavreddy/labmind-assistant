-- Sample Data for LabMind Development
-- Insert this data after running setup.sql

-- Insert sample experiments
INSERT INTO public.experiments (title, description, course)
VALUES
  (
    'Sorting Algorithms',
    'Implement and compare different sorting algorithms: bubble sort, quicksort, mergesort. Analyze their time and space complexity.',
    'CS201'
  ),
  (
    'Binary Search Trees',
    'Implement BST operations including insertion, deletion, and traversal. Study the impact of tree balancing on performance.',
    'CS201'
  ),
  (
    'Hash Tables',
    'Design and implement hash tables with collision resolution strategies. Compare linear probing, chaining, and double hashing.',
    'CS201'
  ),
  (
    'Process Scheduling',
    'Implement different CPU scheduling algorithms: FCFS, SJF, Round Robin, Priority Scheduling. Compare their average waiting times.',
    'CS301'
  ),
  (
    'Memory Management',
    'Study paging, segmentation, and virtual memory. Implement page replacement algorithms like LRU and FIFO.',
    'CS301'
  ),
  (
    'Query Optimization',
    'Learn SQL query optimization techniques. Practice writing efficient queries and understanding execution plans.',
    'CS302'
  ),
  (
    'Normalization',
    'Study database normalization (1NF to BCNF). Design normalized schemas to eliminate redundancy and anomalies.',
    'CS302'
  );

-- Note: Quiz questions are generated dynamically by AI in the current system
-- To add hardcoded questions, you would create a quiz_questions table like:
/*
CREATE TABLE IF NOT EXISTS public.quiz_questions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    experiment_id UUID NOT NULL,
    question TEXT NOT NULL,
    expected_key_points JSONB, -- optional guidance for AI evaluation
    created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
    CONSTRAINT fk_experiment_questions FOREIGN KEY (experiment_id) REFERENCES public.experiments(id) ON DELETE CASCADE
);

INSERT INTO public.quiz_questions (experiment_id, question, expected_key_points)
VALUES
  (
    (SELECT id FROM public.experiments WHERE title = 'Sorting Algorithms'),
    'Explain the time complexity of bubble sort and why it''s inefficient for large datasets.',
    '["O(n²) worst case", "O(n²) average case", "Simple implementation", "Repeatedly swaps adjacent elements", "Inefficient for large data"]'
  ),
  ...
*/

-- You can reference experiments by their ID or title in your queries
-- Example: SELECT id FROM public.experiments WHERE title = 'Sorting Algorithms';
