import { createClient } from '@supabase/supabase-js'

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error('Missing Supabase environment variables')
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    storage: localStorage,
    persistSession: true,
    autoRefreshToken: true,
  }
})

// Database types
export interface Profile {
  id: string
  name: string
  role: 'student' | 'admin' | 'faculty'
  department?: string
  year?: string
  sapid?: string
  section?: string
  created_at: string
  updated_at: string
}

export interface Notice {
  id: string
  title: string
  content: string
  author: string
  department: string
  subject?: string
  category: 'general' | 'exam' | 'urgent'
  pinned: boolean
  pinned_until?: string
  attachments: string[]
  created_at: string
  updated_at: string
}

export interface Assignment {
  id: string
  title: string
  description: string
  subject: string
  due_date: string
  author: string
  author_role: 'faculty' | 'admin'
  attachments: string[]
  class_targets: string[]
  created_at: string
  updated_at: string
}

export interface Resource {
  id: string
  title: string
  description: string
  type: 'pdf' | 'ppt' | 'doc' | 'video' | 'image' | 'other'
  subject: string
  uploaded_by: string
  size: string
  downloads: number
  likes: number
  tags: string[]
  file_url?: string
  created_at: string
  updated_at: string
}

export interface Query {
  id: string
  title: string
  content: string
  author: string
  subject: string
  replies: number
  likes: number
  solved: boolean
  liked_by: string[]
  created_at: string
  updated_at: string
}

export interface Answer {
  id: string
  query_id: string
  content: string
  author: string
  author_role: 'student' | 'faculty' | 'admin'
  is_accepted: boolean
  created_at: string
  updated_at: string
}

export interface StudentNote {
  id: string
  student_id: string
  note: string
  author: string
  created_at: string
  updated_at: string
}