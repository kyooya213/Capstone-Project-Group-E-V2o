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
      users: {
        Row: {
          id: string
          email: string
          name: string
          role: 'customer' | 'staff' | 'admin'
          phone: string | null
          address: string | null
          created_at: string
        }
        Insert: {
          id?: string
          email: string
          name: string
          role: 'customer' | 'staff' | 'admin'
          phone?: string | null
          address?: string | null
          created_at?: string
        }
        Update: {
          id?: string
          email?: string
          name?: string
          role?: 'customer' | 'staff' | 'admin'
          phone?: string | null
          address?: string | null
          created_at?: string
        }
      }
      materials: {
        Row: {
          id: string
          name: string
          description: string | null
          price_per_sqm: number
          available: boolean
          created_at: string
        }
        Insert: {
          id?: string
          name: string
          description?: string | null
          price_per_sqm: number
          available?: boolean
          created_at?: string
        }
        Update: {
          id?: string
          name?: string
          description?: string | null
          price_per_sqm?: number
          available?: boolean
          created_at?: string
        }
      }
      orders: {
        Row: {
          id: string
          customer_id: string
          order_number: string
          width: number
          height: number
          quantity: number
          material_id: string
          design_notes: string | null
          file_url: string | null
          file_name: string | null
          status: 'pending' | 'processing' | 'printed' | 'completed' | 'cancelled'
          total_price: number
          is_paid: boolean
          payment_method: string | null
          payment_reference: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          customer_id: string
          order_number: string
          width: number
          height: number
          quantity: number
          material_id: string
          design_notes?: string | null
          file_url?: string | null
          file_name?: string | null
          status: 'pending' | 'processing' | 'printed' | 'completed' | 'cancelled'
          total_price: number
          is_paid?: boolean
          payment_method?: string | null
          payment_reference?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          customer_id?: string
          order_number?: string
          width?: number
          height?: number
          quantity?: number
          material_id?: string
          design_notes?: string | null
          file_url?: string | null
          file_name?: string | null
          status?: 'pending' | 'processing' | 'printed' | 'completed' | 'cancelled'
          total_price?: number
          is_paid?: boolean
          payment_method?: string | null
          payment_reference?: string | null
          created_at?: string
          updated_at?: string
        }
      }
      messages: {
        Row: {
          id: string
          order_id: string
          sender_id: string
          content: string
          created_at: string
        }
        Insert: {
          id?: string
          order_id: string
          sender_id: string
          content: string
          created_at?: string
        }
        Update: {
          id?: string
          order_id?: string
          sender_id?: string
          content?: string
          created_at?: string
        }
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
  }
}