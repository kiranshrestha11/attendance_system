import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error('Missing Supabase environment variables');
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

export type Database = {
  public: {
    Tables: {
      students: {
        Row: {
          id: string;
          name: string;
          email: string;
          student_id: string;
          created_at: string;
          created_by: string | null;
        };
        Insert: {
          id?: string;
          name: string;
          email: string;
          student_id: string;
          created_at?: string;
          created_by?: string | null;
        };
        Update: {
          id?: string;
          name?: string;
          email?: string;
          student_id?: string;
          created_at?: string;
          created_by?: string | null;
        };
      };
      attendance_records: {
        Row: {
          id: string;
          student_id: string;
          check_in_time: string;
          check_out_time: string | null;
          duration_minutes: number | null;
          date: string;
          created_at: string;
        };
        Insert: {
          id?: string;
          student_id: string;
          check_in_time: string;
          check_out_time?: string | null;
          duration_minutes?: number | null;
          date: string;
          created_at?: string;
        };
        Update: {
          id?: string;
          student_id?: string;
          check_in_time?: string;
          check_out_time?: string | null;
          duration_minutes?: number | null;
          date?: string;
          created_at?: string;
        };
      };
    };
  };
};