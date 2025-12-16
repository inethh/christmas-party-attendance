-- Supabase Database Schema for Christmas Party Attendance System

-- Create names_list table
CREATE TABLE IF NOT EXISTS names_list (
  id BIGSERIAL PRIMARY KEY,
  name TEXT NOT NULL UNIQUE,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create attendance table
CREATE TABLE IF NOT EXISTS attendance (
  id BIGSERIAL PRIMARY KEY,
  name TEXT NOT NULL,
  checked_in_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create index on name for faster lookups
CREATE INDEX IF NOT EXISTS idx_attendance_name ON attendance(name);
CREATE INDEX IF NOT EXISTS idx_attendance_date ON attendance(checked_in_at DESC);
CREATE INDEX IF NOT EXISTS idx_names_list_name ON names_list(name);

-- Enable Row Level Security (RLS)
ALTER TABLE names_list ENABLE ROW LEVEL SECURITY;
ALTER TABLE attendance ENABLE ROW LEVEL SECURITY;

-- Create policies for public read/write access
-- Note: Adjust these policies based on your security requirements

-- Allow anyone to read names list
CREATE POLICY "Allow public read access to names_list"
  ON names_list FOR SELECT
  USING (true);

-- Allow anyone to insert into names list
CREATE POLICY "Allow public insert access to names_list"
  ON names_list FOR INSERT
  WITH CHECK (true);

-- Allow anyone to read attendance
CREATE POLICY "Allow public read access to attendance"
  ON attendance FOR SELECT
  USING (true);

-- Allow anyone to insert attendance
CREATE POLICY "Allow public insert access to attendance"
  ON attendance FOR INSERT
  WITH CHECK (true);

-- Optional: Add some default names
INSERT INTO names_list (name) VALUES
  ('John Doe'),
  ('Jane Smith'),
  ('Bob Johnson'),
  ('Alice Williams'),
  ('Charlie Brown'),
  ('Diana Prince'),
  ('Edward Norton'),
  ('Fiona Apple')
ON CONFLICT (name) DO NOTHING;

