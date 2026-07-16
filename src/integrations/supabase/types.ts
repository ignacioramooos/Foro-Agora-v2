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
    PostgrestVersion: "14.5"
  }
  public: {
    Tables: {
      brokers: {
        Row: {
          commission: string
          created_at: string
          id: string
          is_active: boolean
          min_deposit: string
          name: string
          notes: string | null
          regulator: string
          sort_order: number
          type: string
          updated_at: string
        }
        Insert: {
          commission?: string
          created_at?: string
          id?: string
          is_active?: boolean
          min_deposit?: string
          name: string
          notes?: string | null
          regulator?: string
          sort_order?: number
          type: string
          updated_at?: string
        }
        Update: {
          commission?: string
          created_at?: string
          id?: string
          is_active?: boolean
          min_deposit?: string
          name?: string
          notes?: string | null
          regulator?: string
          sort_order?: number
          type?: string
          updated_at?: string
        }
        Relationships: []
      }
      case_studies: {
        Row: {
          author_first_name: string
          author_last_initial: string
          author_school: string | null
          cohort_label: string | null
          company_name: string
          company_sector: string | null
          company_ticker: string | null
          content: string
          created_at: string
          id: string
          is_published: boolean
          key_metrics: Json | null
          summary: string
          user_id: string | null
          verdict: string | null
        }
        Insert: {
          author_first_name: string
          author_last_initial: string
          author_school?: string | null
          cohort_label?: string | null
          company_name: string
          company_sector?: string | null
          company_ticker?: string | null
          content: string
          created_at?: string
          id?: string
          is_published?: boolean
          key_metrics?: Json | null
          summary: string
          user_id?: string | null
          verdict?: string | null
        }
        Update: {
          author_first_name?: string
          author_last_initial?: string
          author_school?: string | null
          cohort_label?: string | null
          company_name?: string
          company_sector?: string | null
          company_ticker?: string | null
          content?: string
          created_at?: string
          id?: string
          is_published?: boolean
          key_metrics?: Json | null
          summary?: string
          user_id?: string | null
          verdict?: string | null
        }
        Relationships: []
      }
      certificates: {
        Row: {
          certificate_code: string | null
          id: string
          issued_at: string | null
          user_id: string
        }
        Insert: {
          certificate_code?: string | null
          id?: string
          issued_at?: string | null
          user_id: string
        }
        Update: {
          certificate_code?: string | null
          id?: string
          issued_at?: string | null
          user_id?: string
        }
        Relationships: []
      }
      class_registrations: {
        Row: {
          age: number
          cedula: string | null
          class_id: string | null
          consent: boolean
          created_at: string
          department: string
          email: string
          hear_about: string | null
          id: string
          name: string
          phone: string | null
          school: string
          user_id: string | null
          why: string | null
        }
        Insert: {
          age: number
          cedula?: string | null
          class_id?: string | null
          consent: boolean
          created_at?: string
          department: string
          email: string
          hear_about?: string | null
          id?: string
          name: string
          phone?: string | null
          school: string
          user_id?: string | null
          why?: string | null
        }
        Update: {
          age?: number
          cedula?: string | null
          class_id?: string | null
          consent?: boolean
          created_at?: string
          department?: string
          email?: string
          hear_about?: string | null
          id?: string
          name?: string
          phone?: string | null
          school?: string
          user_id?: string | null
          why?: string | null
        }
        Relationships: []
      }
      class_sessions: {
        Row: {
          class_date: string
          created_at: string
          end_date: string | null
          id: string
          is_active: boolean
          is_featured: boolean
          location: string
          max_capacity: number
          module_number: number
          notes: string | null
          registration_limit: number
          title: string
          updated_at: string
        }
        Insert: {
          class_date: string
          created_at?: string
          end_date?: string | null
          id?: string
          is_active?: boolean
          is_featured?: boolean
          location: string
          max_capacity?: number
          module_number?: number
          notes?: string | null
          registration_limit?: number
          title: string
          updated_at?: string
        }
        Update: {
          class_date?: string
          created_at?: string
          end_date?: string | null
          id?: string
          is_active?: boolean
          is_featured?: boolean
          location?: string
          max_capacity?: number
          module_number?: number
          notes?: string | null
          registration_limit?: number
          title?: string
          updated_at?: string
        }
        Relationships: []
      }
      cohorts: {
        Row: {
          created_at: string
          id: string
          is_active: boolean
          location: string
          max_capacity: number
          name: string
          start_date: string
          updated_at: string
        }
        Insert: {
          created_at?: string
          id?: string
          is_active?: boolean
          location?: string
          max_capacity?: number
          name: string
          start_date: string
          updated_at?: string
        }
        Update: {
          created_at?: string
          id?: string
          is_active?: boolean
          location?: string
          max_capacity?: number
          name?: string
          start_date?: string
          updated_at?: string
        }
        Relationships: []
      }
      community_post_comments: {
        Row: {
          author: string
          body: string
          created_at: string
          id: string
          post_id: string
          updated_at: string
          user_id: string | null
        }
        Insert: {
          author: string
          body: string
          created_at?: string
          id?: string
          post_id: string
          updated_at?: string
          user_id?: string | null
        }
        Update: {
          author?: string
          body?: string
          created_at?: string
          id?: string
          post_id?: string
          updated_at?: string
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "community_post_comments_post_id_fkey"
            columns: ["post_id"]
            isOneToOne: false
            referencedRelation: "community_posts"
            referencedColumns: ["id"]
          },
        ]
      }
      community_post_reactions: {
        Row: {
          created_at: string
          id: string
          post_id: string
          reaction_type: string
          user_id: string
        }
        Insert: {
          created_at?: string
          id?: string
          post_id: string
          reaction_type?: string
          user_id: string
        }
        Update: {
          created_at?: string
          id?: string
          post_id?: string
          reaction_type?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "community_post_reactions_post_id_fkey"
            columns: ["post_id"]
            isOneToOne: false
            referencedRelation: "community_posts"
            referencedColumns: ["id"]
          },
        ]
      }
      community_posts: {
        Row: {
          author: string
          body: string
          created_at: string
          id: string
          is_published: boolean
          title: string
          type: string
          updated_at: string
          user_id: string | null
        }
        Insert: {
          author: string
          body?: string
          created_at?: string
          id?: string
          is_published?: boolean
          title: string
          type: string
          updated_at?: string
          user_id?: string | null
        }
        Update: {
          author?: string
          body?: string
          created_at?: string
          id?: string
          is_published?: boolean
          title?: string
          type?: string
          updated_at?: string
          user_id?: string | null
        }
        Relationships: []
      }
      contact_messages: {
        Row: {
          created_at: string
          email: string
          id: string
          message: string
          name: string
        }
        Insert: {
          created_at?: string
          email: string
          id?: string
          message: string
          name: string
        }
        Update: {
          created_at?: string
          email?: string
          id?: string
          message?: string
          name?: string
        }
        Relationships: []
      }
      content_items: {
        Row: {
          content_body: string | null
          created_at: string
          created_by: string
          description: string | null
          duration_minutes: number | null
          file_url: string | null
          id: string
          is_published: boolean
          module_name: string | null
          sort_order: number
          thumbnail_url: string | null
          title: string
          type: Database["public"]["Enums"]["content_type"]
          updated_at: string
          youtube_url: string | null
        }
        Insert: {
          content_body?: string | null
          created_at?: string
          created_by: string
          description?: string | null
          duration_minutes?: number | null
          file_url?: string | null
          id?: string
          is_published?: boolean
          module_name?: string | null
          sort_order?: number
          thumbnail_url?: string | null
          title: string
          type?: Database["public"]["Enums"]["content_type"]
          updated_at?: string
          youtube_url?: string | null
        }
        Update: {
          content_body?: string | null
          created_at?: string
          created_by?: string
          description?: string | null
          duration_minutes?: number | null
          file_url?: string | null
          id?: string
          is_published?: boolean
          module_name?: string | null
          sort_order?: number
          thumbnail_url?: string | null
          title?: string
          type?: Database["public"]["Enums"]["content_type"]
          updated_at?: string
          youtube_url?: string | null
        }
        Relationships: []
      }
      event_registrations: {
        Row: {
          event_id: string
          id: string
          registered_at: string
          user_id: string
        }
        Insert: {
          event_id: string
          id?: string
          registered_at?: string
          user_id: string
        }
        Update: {
          event_id?: string
          id?: string
          registered_at?: string
          user_id?: string
        }
        Relationships: []
      }
      events: {
        Row: {
          created_at: string
          description: string | null
          event_date: string
          id: string
          image_url: string | null
          is_active: boolean
          location: string
          speaker_name: string | null
          speaker_role: string | null
          spots_taken: number
          spots_total: number
          title: string
          updated_at: string
        }
        Insert: {
          created_at?: string
          description?: string | null
          event_date: string
          id?: string
          image_url?: string | null
          is_active?: boolean
          location: string
          speaker_name?: string | null
          speaker_role?: string | null
          spots_taken?: number
          spots_total?: number
          title: string
          updated_at?: string
        }
        Update: {
          created_at?: string
          description?: string | null
          event_date?: string
          id?: string
          image_url?: string | null
          is_active?: boolean
          location?: string
          speaker_name?: string | null
          speaker_role?: string | null
          spots_taken?: number
          spots_total?: number
          title?: string
          updated_at?: string
        }
        Relationships: []
      }
      landing_page_widgets: {
        Row: {
          created_at: string
          id: string
          tickers: string[]
          updated_at: string
          user_id: string
        }
        Insert: {
          created_at?: string
          id?: string
          tickers?: string[]
          updated_at?: string
          user_id: string
        }
        Update: {
          created_at?: string
          id?: string
          tickers?: string[]
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      lesson_progress: {
        Row: {
          completed_at: string | null
          id: string
          lesson_id: string
          user_id: string
        }
        Insert: {
          completed_at?: string | null
          id?: string
          lesson_id: string
          user_id: string
        }
        Update: {
          completed_at?: string | null
          id?: string
          lesson_id?: string
          user_id?: string
        }
        Relationships: []
      }
      lessons: {
        Row: {
          content: string
          created_at: string | null
          estimated_minutes: number | null
          id: string
          is_published: boolean | null
          lesson_number: number
          module_number: number
          title: string
        }
        Insert: {
          content: string
          created_at?: string | null
          estimated_minutes?: number | null
          id?: string
          is_published?: boolean | null
          lesson_number: number
          module_number: number
          title: string
        }
        Update: {
          content?: string
          created_at?: string | null
          estimated_minutes?: number | null
          id?: string
          is_published?: boolean | null
          lesson_number?: number
          module_number?: number
          title?: string
        }
        Relationships: []
      }
      newsletter_subscribers: {
        Row: {
          created_at: string | null
          email: string
          id: string
          is_active: boolean | null
          source: string | null
        }
        Insert: {
          created_at?: string | null
          email: string
          id?: string
          is_active?: boolean | null
          source?: string | null
        }
        Update: {
          created_at?: string | null
          email?: string
          id?: string
          is_active?: boolean | null
          source?: string | null
        }
        Relationships: []
      }
      partner_inquiries: {
        Row: {
          collaboration_types: string[]
          created_at: string
          email: string
          full_name: string
          id: string
          message: string | null
          org_type: string
          organization: string
          role: string
          status: string
        }
        Insert: {
          collaboration_types?: string[]
          created_at?: string
          email: string
          full_name: string
          id?: string
          message?: string | null
          org_type: string
          organization: string
          role: string
          status?: string
        }
        Update: {
          collaboration_types?: string[]
          created_at?: string
          email?: string
          full_name?: string
          id?: string
          message?: string | null
          org_type?: string
          organization?: string
          role?: string
          status?: string
        }
        Relationships: []
      }
      partners: {
        Row: {
          category: string
          created_at: string
          id: string
          is_active: boolean
          logo_url: string | null
          name: string
          website_url: string | null
        }
        Insert: {
          category?: string
          created_at?: string
          id?: string
          is_active?: boolean
          logo_url?: string | null
          name: string
          website_url?: string | null
        }
        Update: {
          category?: string
          created_at?: string
          id?: string
          is_active?: boolean
          logo_url?: string | null
          name?: string
          website_url?: string | null
        }
        Relationships: []
      }
      portfolio_holdings: {
        Row: {
          avg_cost_per_share: number
          company_name: string
          id: string
          portfolio_id: string
          shares: number
          ticker: string
        }
        Insert: {
          avg_cost_per_share: number
          company_name: string
          id?: string
          portfolio_id: string
          shares?: number
          ticker: string
        }
        Update: {
          avg_cost_per_share?: number
          company_name?: string
          id?: string
          portfolio_id?: string
          shares?: number
          ticker?: string
        }
        Relationships: []
      }
      portfolio_transactions: {
        Row: {
          company_name: string
          executed_at: string
          id: string
          portfolio_id: string
          price_per_share: number
          shares: number
          ticker: string
          total_amount: number
          transaction_type: string
        }
        Insert: {
          company_name: string
          executed_at?: string
          id?: string
          portfolio_id: string
          price_per_share: number
          shares: number
          ticker: string
          total_amount: number
          transaction_type: string
        }
        Update: {
          company_name?: string
          executed_at?: string
          id?: string
          portfolio_id?: string
          price_per_share?: number
          shares?: number
          ticker?: string
          total_amount?: number
          transaction_type?: string
        }
        Relationships: []
      }
      portfolios: {
        Row: {
          cash_balance: number
          cohort_id: string | null
          created_at: string
          id: string
          last_portfolio_value: number | null
          user_id: string
        }
        Insert: {
          cash_balance?: number
          cohort_id?: string | null
          created_at?: string
          id?: string
          last_portfolio_value?: number | null
          user_id: string
        }
        Update: {
          cash_balance?: number
          cohort_id?: string | null
          created_at?: string
          id?: string
          last_portfolio_value?: number | null
          user_id?: string
        }
        Relationships: []
      }
      profiles: {
        Row: {
          accepted_terms: boolean
          age: number | null
          age_range: string | null
          avatar_url: string | null
          created_at: string
          department: string | null
          display_name: string | null
          email: string | null
          full_name: string | null
          how_found_us: string | null
          id: string
          institution: string | null
          interests: string[] | null
          onboarding_completed: boolean
          updated_at: string
          user_id: string
        }
        Insert: {
          accepted_terms?: boolean
          age?: number | null
          age_range?: string | null
          avatar_url?: string | null
          created_at?: string
          department?: string | null
          display_name?: string | null
          email?: string | null
          full_name?: string | null
          how_found_us?: string | null
          id?: string
          institution?: string | null
          interests?: string[] | null
          onboarding_completed?: boolean
          updated_at?: string
          user_id: string
        }
        Update: {
          accepted_terms?: boolean
          age?: number | null
          age_range?: string | null
          avatar_url?: string | null
          created_at?: string
          department?: string | null
          display_name?: string | null
          email?: string | null
          full_name?: string | null
          how_found_us?: string | null
          id?: string
          institution?: string | null
          interests?: string[] | null
          onboarding_completed?: boolean
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      user_preferences: {
        Row: {
          created_at: string
          dashboard_active_tab: string
          id: string
          locale: string
          theme: string
          updated_at: string
          user_id: string
        }
        Insert: {
          created_at?: string
          dashboard_active_tab?: string
          id?: string
          locale?: string
          theme?: string
          updated_at?: string
          user_id: string
        }
        Update: {
          created_at?: string
          dashboard_active_tab?: string
          id?: string
          locale?: string
          theme?: string
          updated_at?: string
          user_id?: string
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
      get_public_profiles: {
        Args: never
        Returns: {
          avatar_url: string
          created_at: string
          department: string
          display_name: string
          user_id: string
        }[]
      }
      get_public_profiles_count: { Args: never; Returns: number }
      has_role: {
        Args: {
          _role: Database["public"]["Enums"]["app_role"]
          _user_id: string
        }
        Returns: boolean
      }
      is_valid_uruguayan_cedula: { Args: { value: string }; Returns: boolean }
    }
    Enums: {
      app_role: "admin" | "moderator" | "user"
      content_type: "video" | "article" | "material"
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
      app_role: ["admin", "moderator", "user"],
      content_type: ["video", "article", "material"],
    },
  },
} as const
