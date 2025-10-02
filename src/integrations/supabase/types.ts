export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  // Allows to automatically instantiate createClient with right options
  // instead of createClient<Database, { PostgrestVersion: 'XX' }>(URL, KEY)
  __InternalSupabase: {
    PostgrestVersion: "12.2.12 (cd3cf9e)"
  }
  public: {
    Tables: {
      assignments: {
        Row: {
          attachments: string[] | null
          author: string | null
          author_role: string | null
          class_targets: string[] | null
          created_at: string
          created_by: string
          description: string | null
          due_date: string | null
          id: string
          subject: string
          title: string
          updated_at: string
        }
        Insert: {
          attachments?: string[] | null
          author?: string | null
          author_role?: string | null
          class_targets?: string[] | null
          created_at?: string
          created_by: string
          description?: string | null
          due_date?: string | null
          id?: string
          subject: string
          title: string
          updated_at?: string
        }
        Update: {
          attachments?: string[] | null
          author?: string | null
          author_role?: string | null
          class_targets?: string[] | null
          created_at?: string
          created_by?: string
          description?: string | null
          due_date?: string | null
          id?: string
          subject?: string
          title?: string
          updated_at?: string
        }
        Relationships: []
      }
      attendance_logs: {
        Row: {
          created_at: string
          id: string
          log_date: string
          present: boolean
          student_id: string
          subject: string
          time: string | null
          updated_at: string
        }
        Insert: {
          created_at?: string
          id?: string
          log_date: string
          present?: boolean
          student_id: string
          subject: string
          time?: string | null
          updated_at?: string
        }
        Update: {
          created_at?: string
          id?: string
          log_date?: string
          present?: boolean
          student_id?: string
          subject?: string
          time?: string | null
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "attendance_logs_student_id_fkey"
            columns: ["student_id"]
            isOneToOne: false
            referencedRelation: "students"
            referencedColumns: ["id"]
          },
        ]
      }
      attendance_records: {
        Row: {
          attended_classes: number
          created_at: string
          id: string
          last_updated: string
          recent_pattern: string[]
          student_id: string
          subject: string
          total_classes: number
          updated_at: string
        }
        Insert: {
          attended_classes?: number
          created_at?: string
          id?: string
          last_updated?: string
          recent_pattern?: string[]
          student_id: string
          subject: string
          total_classes?: number
          updated_at?: string
        }
        Update: {
          attended_classes?: number
          created_at?: string
          id?: string
          last_updated?: string
          recent_pattern?: string[]
          student_id?: string
          subject?: string
          total_classes?: number
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "attendance_records_student_id_fkey"
            columns: ["student_id"]
            isOneToOne: false
            referencedRelation: "students"
            referencedColumns: ["id"]
          },
        ]
      }
      notices: {
        Row: {
          attachments: string[] | null
          author: string | null
          author_id: string
          category: string
          content: string
          created_at: string
          department: string | null
          id: string
          pinned: boolean
          pinned_until: string | null
          subject: string | null
          title: string
          updated_at: string
        }
        Insert: {
          attachments?: string[] | null
          author?: string | null
          author_id: string
          category?: string
          content: string
          created_at?: string
          department?: string | null
          id?: string
          pinned?: boolean
          pinned_until?: string | null
          subject?: string | null
          title: string
          updated_at?: string
        }
        Update: {
          attachments?: string[] | null
          author?: string | null
          author_id?: string
          category?: string
          content?: string
          created_at?: string
          department?: string | null
          id?: string
          pinned?: boolean
          pinned_until?: string | null
          subject?: string | null
          title?: string
          updated_at?: string
        }
        Relationships: []
      }
      profiles: {
        Row: {
          avatar_url: string | null
          created_at: string
          department: string | null
          id: string
          name: string
          sapid: string | null
          section: string | null
          updated_at: string
          user_id: string
          year: string | null
        }
        Insert: {
          avatar_url?: string | null
          created_at?: string
          department?: string | null
          id?: string
          name: string
          sapid?: string | null
          section?: string | null
          updated_at?: string
          user_id: string
          year?: string | null
        }
        Update: {
          avatar_url?: string | null
          created_at?: string
          department?: string | null
          id?: string
          name?: string
          sapid?: string | null
          section?: string | null
          updated_at?: string
          user_id?: string
          year?: string | null
        }
        Relationships: []
      }
      queries: {
        Row: {
          author: string | null
          author_class: string | null
          content: string
          created_at: string
          id: string
          liked_by: string[]
          likes: number
          replies: number
          solved: boolean
          subject: string
          title: string
          updated_at: string
          user_id: string
        }
        Insert: {
          author?: string | null
          author_class?: string | null
          content: string
          created_at?: string
          id?: string
          liked_by?: string[]
          likes?: number
          replies?: number
          solved?: boolean
          subject: string
          title: string
          updated_at?: string
          user_id: string
        }
        Update: {
          author?: string | null
          author_class?: string | null
          content?: string
          created_at?: string
          id?: string
          liked_by?: string[]
          likes?: number
          replies?: number
          solved?: boolean
          subject?: string
          title?: string
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      query_answers: {
        Row: {
          author: string | null
          author_role: string | null
          content: string
          created_at: string
          id: string
          is_accepted: boolean
          query_id: string
          updated_at: string
          user_id: string
        }
        Insert: {
          author?: string | null
          author_role?: string | null
          content: string
          created_at?: string
          id?: string
          is_accepted?: boolean
          query_id: string
          updated_at?: string
          user_id: string
        }
        Update: {
          author?: string | null
          author_role?: string | null
          content?: string
          created_at?: string
          id?: string
          is_accepted?: boolean
          query_id?: string
          updated_at?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "query_answers_query_id_fkey"
            columns: ["query_id"]
            isOneToOne: false
            referencedRelation: "queries"
            referencedColumns: ["id"]
          },
        ]
      }
      resources: {
        Row: {
          created_at: string
          description: string | null
          downloads: number
          id: string
          likes: number
          size: string
          subject: string
          tags: string[] | null
          title: string
          type: string
          updated_at: string
          uploaded_by: string
        }
        Insert: {
          created_at?: string
          description?: string | null
          downloads?: number
          id?: string
          likes?: number
          size?: string
          subject: string
          tags?: string[] | null
          title: string
          type: string
          updated_at?: string
          uploaded_by: string
        }
        Update: {
          created_at?: string
          description?: string | null
          downloads?: number
          id?: string
          likes?: number
          size?: string
          subject?: string
          tags?: string[] | null
          title?: string
          type?: string
          updated_at?: string
          uploaded_by?: string
        }
        Relationships: []
      }
      student_notes: {
        Row: {
          author: string
          created_at: string
          id: string
          note: string
          student_id: string
          updated_at: string
        }
        Insert: {
          author: string
          created_at?: string
          id?: string
          note: string
          student_id: string
          updated_at?: string
        }
        Update: {
          author?: string
          created_at?: string
          id?: string
          note?: string
          student_id?: string
          updated_at?: string
        }
        Relationships: []
      }
      students: {
        Row: {
          attendance_percentage: number | null
          average_grade: number | null
          created_at: string
          email: string | null
          id: string
          last_activity: string | null
          name: string
          phone: string | null
          sapid: string
          section: string | null
          status: string | null
          trend: string | null
          updated_at: string
        }
        Insert: {
          attendance_percentage?: number | null
          average_grade?: number | null
          created_at?: string
          email?: string | null
          id?: string
          last_activity?: string | null
          name: string
          phone?: string | null
          sapid: string
          section?: string | null
          status?: string | null
          trend?: string | null
          updated_at?: string
        }
        Update: {
          attendance_percentage?: number | null
          average_grade?: number | null
          created_at?: string
          email?: string | null
          id?: string
          last_activity?: string | null
          name?: string
          phone?: string | null
          sapid?: string
          section?: string | null
          status?: string | null
          trend?: string | null
          updated_at?: string
        }
        Relationships: []
      }
      user_roles: {
        Row: {
          created_at: string
          id: string
          role: Database["public"]["Enums"]["app_role"]
          user_id: string
        }
        Insert: {
          created_at?: string
          id?: string
          role: Database["public"]["Enums"]["app_role"]
          user_id: string
        }
        Update: {
          created_at?: string
          id?: string
          role?: Database["public"]["Enums"]["app_role"]
          user_id?: string
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      get_user_role: {
        Args: { _user_id: string }
        Returns: Database["public"]["Enums"]["app_role"]
      }
      has_role: {
        Args: {
          _role: Database["public"]["Enums"]["app_role"]
          _user_id: string
        }
        Returns: boolean
      }
    }
    Enums: {
      app_role: "admin" | "faculty" | "student"
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type DatabaseWithoutInternals = Omit<Database, "__InternalSupabase">

type DefaultSchema = DatabaseWithoutInternals[Extract<keyof Database, "public">]

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : DefaultSchemaTableNameOrOptions extends keyof (DefaultSchema["Tables"] &
        DefaultSchema["Views"])
    ? (DefaultSchema["Tables"] &
        DefaultSchema["Views"])[DefaultSchemaTableNameOrOptions] extends {
        Row: infer R
      }
      ? R
      : never
    : never

export type TablesInsert<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I
    }
    ? I
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Insert: infer I
      }
      ? I
      : never
    : never

export type TablesUpdate<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U
    }
    ? U
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Update: infer U
      }
      ? U
      : never
    : never

export type Enums<
  DefaultSchemaEnumNameOrOptions extends
    | keyof DefaultSchema["Enums"]
    | { schema: keyof DatabaseWithoutInternals },
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = DefaultSchemaEnumNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
    ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema["CompositeTypes"]
    | { schema: keyof DatabaseWithoutInternals },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never

export const Constants = {
  public: {
    Enums: {
      app_role: ["admin", "faculty", "student"],
    },
  },
} as const
