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
    PostgrestVersion: "14.1"
  }
  public: {
    Tables: {
      profiles: {
        Row: {
          avatar_url: string | null
          email: string | null
          full_name: string | null
          id: string
          is_premium: boolean | null
          newsletter_subscribed: boolean | null
          onboarding_completed: boolean | null
          updated_at: string | null
          // Metered article access
          articles_read_count: number | null
          last_reset_date: string | null
          usage_limit: number | null
          // Subscription tracking
          subscription_tier: 'monthly' | 'yearly' | 'lifetime' | 'free' | null
          revenuecat_customer_id: string | null
          premium_since: string | null
          current_period_start: string | null
          // OneSignal integration
          onesignal_player_id: string | null
          // Gift quota tracking
          gifts_sent_this_month: number | null
          gifts_reset_date: string | null
        }
        Insert: {
          avatar_url?: string | null
          email?: string | null
          full_name?: string | null
          id: string
          is_premium?: boolean | null
          newsletter_subscribed?: boolean | null
          onboarding_completed?: boolean | null
          updated_at?: string | null
          // Metered article access
          articles_read_count?: number | null
          last_reset_date?: string | null
          usage_limit?: number | null
          // Subscription tracking
          subscription_tier?: 'monthly' | 'yearly' | 'lifetime' | 'free' | null
          revenuecat_customer_id?: string | null
          premium_since?: string | null
          current_period_start?: string | null
          // OneSignal integration
          onesignal_player_id?: string | null
          // Gift quota tracking
          gifts_sent_this_month?: number | null
          gifts_reset_date?: string | null
        }
        Update: {
          avatar_url?: string | null
          email?: string | null
          full_name?: string | null
          id?: string
          is_premium?: boolean | null
          newsletter_subscribed?: boolean | null
          onboarding_completed?: boolean | null
          updated_at?: string | null
          // Metered article access
          articles_read_count?: number | null
          last_reset_date?: string | null
          usage_limit?: number | null
          // Subscription tracking
          subscription_tier?: 'monthly' | 'yearly' | 'lifetime' | 'free' | null
          revenuecat_customer_id?: string | null
          premium_since?: string | null
          current_period_start?: string | null
          // OneSignal integration
          onesignal_player_id?: string | null
          // Gift quota tracking
          gifts_sent_this_month?: number | null
          gifts_reset_date?: string | null
        }
        Relationships: []
      }
      newsletter_subscribers: {
        Row: {
          id: string
          email: string
          created_at: string | null
          source: string | null
          is_active: boolean | null
          updated_at: string | null
          onesignal_player_id: string | null
          onesignal_synced_at: string | null
          briefing_preferences: Json | null
        }
        Insert: {
          id?: string
          email: string
          created_at?: string | null
          source?: string | null
          is_active?: boolean | null
          updated_at?: string | null
          onesignal_player_id?: string | null
          onesignal_synced_at?: string | null
          briefing_preferences?: Json | null
        }
        Update: {
          id?: string
          email?: string
          created_at?: string | null
          source?: string | null
          is_active?: boolean | null
          updated_at?: string | null
          onesignal_player_id?: string | null
          onesignal_synced_at?: string | null
          briefing_preferences?: Json | null
        }
        Relationships: []
      }
      bookmarks: {
        Row: {
          id: string
          user_id: string
          article_slug: string
          created_at: string | null
        }
        Insert: {
          id?: string
          user_id: string
          article_slug: string
          created_at?: string | null
        }
        Update: {
          id?: string
          user_id?: string
          article_slug?: string
          created_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "bookmarks_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          }
        ]
      }
      article_gifts: {
        Row: {
          id: string
          from_user_id: string
          to_email: string | null
          article_id: string
          gift_token: string
          expires_at: string
          created_at: string | null
          read_at: string | null
          reader_user_id: string | null
          redeemed_by_user_id: string | null
          redeemed_at_ip: string | null
          redeemed_user_agent: string | null
          qr_code_url: string | null
          share_method: string | null
          redemption_metadata: any | null
        }
        Insert: {
          id?: string
          from_user_id: string
          to_email?: string | null
          article_id: string
          gift_token: string
          expires_at: string
          created_at?: string | null
          read_at?: string | null
          reader_user_id?: string | null
          redeemed_by_user_id?: string | null
          redeemed_at_ip?: string | null
          redeemed_user_agent?: string | null
          qr_code_url?: string | null
          share_method?: string | null
          redemption_metadata?: any | null
        }
        Update: {
          id?: string
          from_user_id?: string
          to_email?: string | null
          article_id?: string
          gift_token?: string
          expires_at?: string
          created_at?: string | null
          read_at?: string | null
          reader_user_id?: string | null
          redeemed_by_user_id?: string | null
          redeemed_at_ip?: string | null
          redeemed_user_agent?: string | null
          qr_code_url?: string | null
          share_method?: string | null
          redemption_metadata?: any | null
        }
        Relationships: [
          {
            foreignKeyName: "article_gifts_from_user_id_fkey"
            columns: ["from_user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          }
        ]
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      [_ in never]: never
    }
    Enums: {
      [_ in never]: never
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
        DefaultSchema["Views"][DefaultSchemaTableNameOrOptions]) extends {
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
    Enums: {},
  },
} as const

// Convenience type for Profile
export type Profile = Database["public"]["Tables"]["profiles"]["Row"]
