export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export interface Database {
  public: {
    Tables: {
      valentines: {
        Row: {
          id: string
          code: string
          recipient_name: string
          creator_name: string | null
          favorite_color: string
          music_enabled: boolean
          special_date: Json | null
          memories: string | null
          reasons: string[]
          proposal_type: 'asking' | 'wishing'
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          code: string
          recipient_name: string
          creator_name?: string | null
          favorite_color: string
          music_enabled?: boolean
          special_date?: Json | null
          memories?: string | null
          reasons: string[]
          proposal_type?: 'asking' | 'wishing'
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          code?: string
          recipient_name?: string
          creator_name?: string | null
          favorite_color?: string
          music_enabled?: boolean
          special_date?: Json | null
          memories?: string | null
          reasons?: string[]
          proposal_type?: 'asking' | 'wishing'
          created_at?: string
          updated_at?: string
        }
        Relationships: []
      }
      valentine_media: {
        Row: {
          id: string
          valentine_id: string
          media_type: 'photo' | 'video' | 'voice_note'
          file_path: string
          file_url: string | null
          display_order: number
          created_at: string
        }
        Insert: {
          id?: string
          valentine_id: string
          media_type: 'photo' | 'video' | 'voice_note'
          file_path: string
          file_url?: string | null
          display_order?: number
          created_at?: string
        }
        Update: {
          id?: string
          valentine_id?: string
          media_type?: 'photo' | 'video' | 'voice_note'
          file_path?: string
          file_url?: string | null
          display_order?: number
          created_at?: string
        }
        Relationships: []
      }
    }
    Views: {
      valentine_summary: {
        Row: {
          id: string
          code: string
          recipient_name: string
          creator_name: string | null
          created_at: string
          photo_count: number
          video_count: number
          voice_note_count: number
        }
      }
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
