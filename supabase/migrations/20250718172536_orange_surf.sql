/*
  # Sample Data for Campus Connect

  1. Sample Data
    - Demo user profiles
    - Sample notices
    - Sample assignments
    - Sample resources
    - Sample queries and answers
    - Sample student notes

  Note: This migration should only be run in development/demo environments
*/

-- Insert sample profiles (these would normally be created through auth signup)
-- Note: In production, these would be created when users sign up
INSERT INTO profiles (id, email, name, role, department, year, sapid) VALUES
  ('00000000-0000-0000-0000-000000000001', 'student@college.edu', 'John Doe', 'student', 'Computer Science', '3rd Year', 'STU001'),
  ('00000000-0000-0000-0000-000000000002', 'admin@college.edu', 'Jane Smith', 'admin', 'Computer Science', '4th Year', 'ADM001'),
  ('00000000-0000-0000-0000-000000000003', 'faculty@college.edu', 'Dr. Robert Johnson', 'faculty', 'Computer Science', NULL, 'FAC001');

-- Insert sample notices
INSERT INTO notices (title, content, author, department, subject, category, pinned, attachments) VALUES
  (
    'Mid-term Examination Schedule Released',
    'The mid-term examination schedule for all courses has been finalized. Please check your respective course pages for detailed timings and venues.',
    'Dr. Sarah Wilson',
    'Academic Office',
    'All Subjects',
    'exam',
    true,
    ARRAY['exam_schedule.pdf']
  ),
  (
    'Library Hours Extended During Exam Period',
    'The library will remain open 24/7 during the examination period (Jan 20 - Feb 5). Additional study spaces have been arranged.',
    'Library Administration',
    'Library',
    NULL,
    'general',
    false,
    ARRAY[]::text[]
  ),
  (
    'Campus Network Maintenance',
    'The campus network will undergo maintenance on January 18, 2024, from 12:00 AM to 6:00 AM. Internet services may be interrupted.',
    'IT Department',
    'IT Services',
    NULL,
    'urgent',
    false,
    ARRAY[]::text[]
  );

-- Insert sample assignments
INSERT INTO assignments (title, description, subject, due_date, author, author_role, attachments, class_targets) VALUES
  (
    'Binary Tree Implementation',
    'Implement a binary search tree with insert, delete, and search operations. Include proper traversal methods (inorder, preorder, postorder) and balance checking functionality.',
    'Data Structures',
    '2024-01-25',
    'Dr. Sarah Wilson',
    'faculty',
    ARRAY['bst_requirements.pdf', 'test_cases.txt'],
    ARRAY['CSE-A', 'CSE-B']
  ),
  (
    'Process Scheduling Algorithms',
    'Compare and implement three different process scheduling algorithms: FCFS, SJF, and Round Robin. Analyze their performance with different workloads.',
    'Operating Systems',
    '2024-01-30',
    'Prof. Michael Brown',
    'faculty',
    ARRAY['scheduling_template.docx'],
    ARRAY['CSE-A', 'CSE-B']
  ),
  (
    'Network Protocol Analysis',
    'Analyze the TCP/IP protocol stack using Wireshark. Capture and examine network packets to understand protocol behavior in different scenarios.',
    'Computer Networks',
    '2024-02-05',
    'Dr. Emily Davis',
    'faculty',
    ARRAY['wireshark_guide.pdf', 'sample_captures.pcap'],
    ARRAY['CSE-A']
  );

-- Insert sample resources
INSERT INTO resources (title, description, type, subject, uploaded_by, size, downloads, likes, tags) VALUES
  (
    'Data Structures - Binary Trees Complete Guide',
    'Comprehensive guide covering binary trees, BST, AVL trees, and operations with examples.',
    'pdf',
    'Data Structures',
    'Dr. Sarah Wilson',
    '2.4 MB',
    156,
    23,
    ARRAY['binary-trees', 'bst', 'algorithms']
  ),
  (
    'Operating Systems - Process Scheduling Presentation',
    'Detailed presentation on various process scheduling algorithms including FCFS, SJF, Round Robin.',
    'ppt',
    'Operating Systems',
    'Prof. Michael Brown',
    '5.1 MB',
    134,
    19,
    ARRAY['scheduling', 'processes', 'algorithms']
  ),
  (
    'Computer Networks - OSI Model Explained',
    'Video lecture explaining the 7 layers of OSI model with real-world examples.',
    'video',
    'Computer Networks',
    'Dr. Emily Davis',
    '45.2 MB',
    89,
    15,
    ARRAY['osi-model', 'networking', 'protocols']
  );

-- Insert sample queries
INSERT INTO queries (title, content, author, subject, likes, solved, liked_by) VALUES
  (
    'Advanced Database Query Optimization',
    'I''m working on optimizing complex SQL queries for our database project. The queries involve multiple joins and subqueries, and they''re running very slowly. Can anyone help with optimization techniques?',
    'Alice Cooper',
    'Database Systems',
    18,
    true,
    ARRAY['STU001', 'STU002', 'FAC001']
  ),
  (
    'Machine Learning Algorithm Selection',
    'For my final project, I need to classify customer behavior data. I''m torn between using Random Forest, SVM, or Neural Networks. What factors should I consider when choosing?',
    'David Kim',
    'Machine Learning',
    15,
    false,
    ARRAY['STU003', 'ADM001']
  ),
  (
    'Quantum Computing Study Group',
    'Is anyone interested in forming a study group for Quantum Computing fundamentals? We could meet weekly to discuss concepts and solve problems together.',
    'Sarah Johnson',
    'Quantum Computing',
    22,
    false,
    ARRAY['STU001', 'STU004', 'STU005', 'FAC002']
  );

-- Insert sample answers
INSERT INTO answers (query_id, content, author, author_role, is_accepted) VALUES
  (
    (SELECT id FROM queries WHERE title = 'Advanced Database Query Optimization'),
    'Start by analyzing your execution plan. Look for table scans and consider adding appropriate indexes. Also, try to rewrite subqueries as joins where possible for better performance.',
    'Prof. Williams',
    'faculty',
    true
  ),
  (
    (SELECT id FROM queries WHERE title = 'Advanced Database Query Optimization'),
    'I had a similar issue. Using EXPLAIN ANALYZE helped me identify bottlenecks. Also consider partitioning large tables if your dataset is huge.',
    'Mark Thompson',
    'student',
    false
  ),
  (
    (SELECT id FROM queries WHERE title = 'Machine Learning Algorithm Selection'),
    'Consider your dataset size, interpretability needs, and computational resources. Random Forest is great for tabular data and provides feature importance. Neural Networks need more data but can capture complex patterns.',
    'Dr. Patel',
    'faculty',
    false
  ),
  (
    (SELECT id FROM queries WHERE title = 'Quantum Computing Study Group'),
    'Count me in! I''m struggling with quantum gates and circuits. Group study would be really helpful.',
    'Tom Wilson',
    'student',
    false
  );

-- Update replies count for queries
UPDATE queries SET replies = (
  SELECT COUNT(*) FROM answers WHERE answers.query_id = queries.id
);

-- Insert sample student notes
INSERT INTO student_notes (student_id, note, author) VALUES
  (
    '1',
    'Excellent performance in recent assignments. Shows strong understanding of binary trees and algorithms.',
    'Dr. Sarah Wilson'
  ),
  (
    '3',
    'Student needs additional support in understanding complex data structures. Recommended for tutoring sessions.',
    'Dr. Sarah Wilson'
  ),
  (
    '4',
    'Missing several assignments. Contacted student about make-up work. Needs immediate attention.',
    'Prof. Michael Brown'
  );