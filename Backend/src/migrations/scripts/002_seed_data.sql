-- Seed default school and admin user
-- Password: Admin@123 (bcrypt hash)
INSERT INTO schools (id, name, address, phone, email) VALUES
  ('a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11', 'Delhi Public School', '123 Education Lane, New Delhi', '+91-11-12345678', 'admin@dpschool.edu')
ON CONFLICT DO NOTHING;

-- Admin user (password: Admin@123)
INSERT INTO user_accounts (id, email, password_hash, first_name, last_name, phone, role) VALUES
  ('b0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11', 'admin@school.com', '$2b$10$so2WLN9X16Q2wcZgND.hbOXCwWnhb4W8SW/e/lv1Xhb8UaUjEsXs.', 'System', 'Admin', '+91-9876543210', 'admin')
ON CONFLICT (email) DO NOTHING;

-- Teacher user (password: Teacher@123)
INSERT INTO user_accounts (id, email, password_hash, first_name, last_name, phone, role) VALUES
  ('c0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11', 'teacher@school.com', '$2b$10$so2WLN9X16Q2wcZgND.hbOXCwWnhb4W8SW/e/lv1Xhb8UaUjEsXs.', 'Rajesh', 'Kumar', '+91-9876543211', 'teacher')
ON CONFLICT (email) DO NOTHING;

-- Fee Department user (password: Fee@123)
INSERT INTO user_accounts (id, email, password_hash, first_name, last_name, phone, role) VALUES
  ('d0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11', 'fee@school.com', '$2b$10$so2WLN9X16Q2wcZgND.hbOXCwWnhb4W8SW/e/lv1Xhb8UaUjEsXs.', 'Priya', 'Sharma', '+91-9876543212', 'fee_department')
ON CONFLICT (email) DO NOTHING;

-- Student user (password: Student@123)
INSERT INTO user_accounts (id, email, password_hash, first_name, last_name, phone, role) VALUES
  ('e0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11', 'student@school.com', '$2b$10$so2WLN9X16Q2wcZgND.hbOXCwWnhb4W8SW/e/lv1Xhb8UaUjEsXs.', 'Arjun', 'Singh', '+91-9876543213', 'student')
ON CONFLICT (email) DO NOTHING;

-- Create academic year
INSERT INTO academic_years (id, school_id, name, start_date, end_date, status, is_current) VALUES
  ('f0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11', 'a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11', '2026-2027', '2026-04-01', '2027-03-31', 'active', true)
ON CONFLICT DO NOTHING;

-- Create terms
INSERT INTO terms (academic_year_id, name, start_date, end_date, sequence_order) VALUES
  ('f0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11', 'Term 1', '2026-04-01', '2026-09-30', 1),
  ('f0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11', 'Term 2', '2026-10-01', '2027-03-31', 2)
ON CONFLICT DO NOTHING;

-- Create grade levels
INSERT INTO grade_levels (id, school_id, name, sequence_order) VALUES
  ('11eebc99-9c0b-4ef8-bb6d-6bb9bd380a11', 'a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11', 'Grade 1', 1),
  ('12eebc99-9c0b-4ef8-bb6d-6bb9bd380a11', 'a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11', 'Grade 2', 2),
  ('13eebc99-9c0b-4ef8-bb6d-6bb9bd380a11', 'a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11', 'Grade 3', 3),
  ('14eebc99-9c0b-4ef8-bb6d-6bb9bd380a11', 'a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11', 'Grade 4', 4),
  ('15eebc99-9c0b-4ef8-bb6d-6bb9bd380a11', 'a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11', 'Grade 5', 5),
  ('16eebc99-9c0b-4ef8-bb6d-6bb9bd380a11', 'a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11', 'Grade 6', 6),
  ('17eebc99-9c0b-4ef8-bb6d-6bb9bd380a11', 'a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11', 'Grade 7', 7),
  ('18eebc99-9c0b-4ef8-bb6d-6bb9bd380a11', 'a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11', 'Grade 8', 8),
  ('19eebc99-9c0b-4ef8-bb6d-6bb9bd380a11', 'a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11', 'Grade 9', 9),
  ('1aeebc99-9c0b-4ef8-bb6d-6bb9bd380a11', 'a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11', 'Grade 10', 10),
  ('1beebc99-9c0b-4ef8-bb6d-6bb9bd380a11', 'a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11', 'Grade 11', 11),
  ('1ceebc99-9c0b-4ef8-bb6d-6bb9bd380a11', 'a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11', 'Grade 12', 12)
ON CONFLICT DO NOTHING;

-- Create subjects
INSERT INTO subjects (id, school_id, name, code) VALUES
  ('21eebc99-9c0b-4ef8-bb6d-6bb9bd380a11', 'a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11', 'Mathematics', 'MATH'),
  ('22eebc99-9c0b-4ef8-bb6d-6bb9bd380a11', 'a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11', 'English', 'ENG'),
  ('23eebc99-9c0b-4ef8-bb6d-6bb9bd380a11', 'a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11', 'Science', 'SCI'),
  ('24eebc99-9c0b-4ef8-bb6d-6bb9bd380a11', 'a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11', 'Social Studies', 'SST'),
  ('25eebc99-9c0b-4ef8-bb6d-6bb9bd380a11', 'a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11', 'Hindi', 'HIN'),
  ('26eebc99-9c0b-4ef8-bb6d-6bb9bd380a11', 'a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11', 'Computer Science', 'CS'),
  ('27eebc99-9c0b-4ef8-bb6d-6bb9bd380a11', 'a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11', 'Physical Education', 'PE')
ON CONFLICT DO NOTHING;

-- Create sections for Grade 10
INSERT INTO sections (id, academic_year_id, grade_level_id, name, capacity, room) VALUES
  ('31eebc99-9c0b-4ef8-bb6d-6bb9bd380a11', 'f0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11', '1aeebc99-9c0b-4ef8-bb6d-6bb9bd380a11', 'A', 40, 'Room 101'),
  ('32eebc99-9c0b-4ef8-bb6d-6bb9bd380a11', 'f0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11', '1aeebc99-9c0b-4ef8-bb6d-6bb9bd380a11', 'B', 40, 'Room 102')
ON CONFLICT DO NOTHING;

-- Create staff record for teacher
INSERT INTO staff (id, user_account_id, school_id, employee_id, first_name, last_name, department, designation) VALUES
  ('41eebc99-9c0b-4ef8-bb6d-6bb9bd380a11', 'c0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11', 'a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11', 'EMP001', 'Rajesh', 'Kumar', 'Mathematics', 'Senior Teacher')
ON CONFLICT DO NOTHING;

-- Create student record
INSERT INTO students (id, user_account_id, school_id, admission_number, first_name, last_name, date_of_birth, gender) VALUES
  ('51eebc99-9c0b-4ef8-bb6d-6bb9bd380a11', 'e0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11', 'a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11', 'ADM001', 'Arjun', 'Singh', '2012-05-15', 'Male')
ON CONFLICT DO NOTHING;

-- Enrol student
INSERT INTO enrolments (student_id, academic_year_id, section_id, roll_number) VALUES
  ('51eebc99-9c0b-4ef8-bb6d-6bb9bd380a11', 'f0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11', '31eebc99-9c0b-4ef8-bb6d-6bb9bd380a11', '1')
ON CONFLICT DO NOTHING;

-- Create course offerings
INSERT INTO course_offerings (id, section_id, subject_id, academic_year_id) VALUES
  ('61eebc99-9c0b-4ef8-bb6d-6bb9bd380a11', '31eebc99-9c0b-4ef8-bb6d-6bb9bd380a11', '21eebc99-9c0b-4ef8-bb6d-6bb9bd380a11', 'f0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11'),
  ('62eebc99-9c0b-4ef8-bb6d-6bb9bd380a11', '31eebc99-9c0b-4ef8-bb6d-6bb9bd380a11', '22eebc99-9c0b-4ef8-bb6d-6bb9bd380a11', 'f0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11'),
  ('63eebc99-9c0b-4ef8-bb6d-6bb9bd380a11', '31eebc99-9c0b-4ef8-bb6d-6bb9bd380a11', '23eebc99-9c0b-4ef8-bb6d-6bb9bd380a11', 'f0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11')
ON CONFLICT DO NOTHING;

-- Assign teacher to Mathematics
INSERT INTO teacher_assignments (staff_id, course_offering_id, is_class_teacher, start_date) VALUES
  ('41eebc99-9c0b-4ef8-bb6d-6bb9bd380a11', '61eebc99-9c0b-4ef8-bb6d-6bb9bd380a11', true, '2026-04-01')
ON CONFLICT DO NOTHING;

-- Create fee categories
INSERT INTO fee_categories (id, school_id, name, description, is_recurring) VALUES
  ('71eebc99-9c0b-4ef8-bb6d-6bb9bd380a11', 'a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11', 'Tuition Fee', 'Monthly tuition fee', true),
  ('72eebc99-9c0b-4ef8-bb6d-6bb9bd380a11', 'a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11', 'Admission Fee', 'One-time admission fee', false),
  ('73eebc99-9c0b-4ef8-bb6d-6bb9bd380a11', 'a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11', 'Exam Fee', 'Term exam fee', true),
  ('74eebc99-9c0b-4ef8-bb6d-6bb9bd380a11', 'a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11', 'Lab Fee', 'Science lab usage fee', true),
  ('75eebc99-9c0b-4ef8-bb6d-6bb9bd380a11', 'a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11', 'Transport Fee', 'School bus transport fee', true)
ON CONFLICT DO NOTHING;
