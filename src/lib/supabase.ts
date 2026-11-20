import { createClient } from '@supabase/supabase-js';

const SUPABASE_URL = 'https://tttawkwsvasddrohovso.supabase.co/rest/v1/';
const SUPABASE_ANON_KEY = 'sb_publishable_uccz-NAP3beyQVDzBWLSrg_ruJ-ftvG';

const SUPABASE_PROJECT_URL = SUPABASE_URL.replace(/\/rest\/v1\/?$/, '');

export const supabase = createClient(SUPABASE_PROJECT_URL, SUPABASE_ANON_KEY);

export interface Assignment {
  id: number;
  title: string;
  subject: string;
  teacher: string;
  due_date: string;
  group_name: string;
  status: string;
  submissions_count: number;
  total_students: number;
  created_at: string;
}

export type NewAssignmentInput = {
  title: string;
  subject: string;
  teacher: string;
  due_date: string;
  group_name: string;
  status: string;
  submissions_count: number;
  total_students: number;
};

export type UserRole = 'student' | 'leader' | 'teacher';

export interface Profile {
  id: string;
  email: string;
  first_name: string;
  last_name: string;
  role: UserRole | string;
  group_name: string;
  created_at?: string;
}

export type UpsertProfileInput = {
  id: string;
  email: string;
  first_name: string;
  last_name: string;
  role: UserRole;
  group_name: string;
};

export async function fetchAssignments(): Promise<Assignment[]> {
  const { data, error } = await supabase
    .from('assignments')
    .select('id, title, subject, teacher, due_date, group_name, status, submissions_count, total_students, created_at')
    .order('due_date', { ascending: true });

  if (error) {
    throw error;
  }

  return (data ?? []) as Assignment[];
}

export async function createAssignment(payload: NewAssignmentInput): Promise<Assignment> {
  const { data, error } = await supabase
    .from('assignments')
    .insert([payload])
    .select('id, title, subject, teacher, due_date, group_name, status, submissions_count, total_students, created_at')
    .single();

  if (error) {
    throw error;
  }

  return data as Assignment;
}

export async function updateAssignmentStatus(
  id: number,
  status: string,
  submissions_count: number
): Promise<Assignment> {
  const { data, error } = await supabase
    .from('assignments')
    .update({ status, submissions_count })
    .eq('id', id)
    .select('id, title, subject, teacher, due_date, group_name, status, submissions_count, total_students, created_at')
    .single();

  if (error) {
    throw error;
  }

  return data as Assignment;
}

export async function deleteAssignment(id: number): Promise<void> {
  const { error } = await supabase.from('assignments').delete().eq('id', id);

  if (error) {
    throw error;
  }
}

export async function fetchProfileById(userId: string): Promise<Profile | null> {
  const { data, error } = await supabase
    .from('profiles')
    .select('id, email, first_name, last_name, role, group_name, created_at')
    .eq('id', userId)
    .maybeSingle();

  if (error) {
    throw error;
  }

  return (data as Profile | null) ?? null;
}

export async function upsertProfile(payload: UpsertProfileInput): Promise<Profile> {
  const { data, error } = await supabase
    .from('profiles')
    .upsert(payload, { onConflict: 'id' })
    .select('id, email, first_name, last_name, role, group_name, created_at')
    .single();

  if (error) {
    throw error;
  }

  return data as Profile;
}
