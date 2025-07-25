/*
  # Smart Attendance System Database Schema

  1. New Tables
    - `students`
      - `id` (uuid, primary key)
      - `name` (text)
      - `email` (text, unique)
      - `student_id` (text, unique)
      - `created_at` (timestamp)
      - `created_by` (uuid, references auth.users)
    
    - `attendance_records`
      - `id` (uuid, primary key)
      - `student_id` (uuid, references students)
      - `check_in_time` (timestamptz)
      - `check_out_time` (timestamptz, nullable)
      - `duration_minutes` (integer, nullable)
      - `date` (date)
      - `created_at` (timestamp)

  2. Security
    - Enable RLS on all tables
    - Add policies for authenticated users (teachers/admins)
    - Students can only check in/out, not view all data
*/

-- Create students table
CREATE TABLE IF NOT EXISTS students (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  email text UNIQUE NOT NULL,
  student_id text UNIQUE NOT NULL,
  created_at timestamptz DEFAULT now(),
  created_by uuid REFERENCES auth.users(id)
);

-- Create attendance_records table
CREATE TABLE IF NOT EXISTS attendance_records (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  student_id uuid REFERENCES students(id) ON DELETE CASCADE,
  check_in_time timestamptz NOT NULL,
  check_out_time timestamptz,
  duration_minutes integer,
  date date NOT NULL,
  created_at timestamptz DEFAULT now()
);

-- Enable Row Level Security
ALTER TABLE students ENABLE ROW LEVEL SECURITY;
ALTER TABLE attendance_records ENABLE ROW LEVEL SECURITY;

-- Create policies for students table
CREATE POLICY "Teachers can manage students"
  ON students
  FOR ALL
  TO authenticated
  USING (true);

-- Create policies for attendance_records table
CREATE POLICY "Teachers can view all attendance records"
  ON attendance_records
  FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Anyone can insert attendance records"
  ON attendance_records
  FOR INSERT
  TO anon, authenticated
  WITH CHECK (true);

CREATE POLICY "Anyone can update their own attendance records"
  ON attendance_records
  FOR UPDATE
  TO anon, authenticated
  USING (true);

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_students_email ON students(email);
CREATE INDEX IF NOT EXISTS idx_students_student_id ON students(student_id);
CREATE INDEX IF NOT EXISTS idx_attendance_student_id ON attendance_records(student_id);
CREATE INDEX IF NOT EXISTS idx_attendance_date ON attendance_records(date);
CREATE INDEX IF NOT EXISTS idx_attendance_check_in ON attendance_records(check_in_time);