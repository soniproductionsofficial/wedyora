/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_SUPABASE_URL?: string
  readonly VITE_SUPABASE_ANON_KEY?: string
  readonly VITE_MAIL_ENDPOINT?: string
  readonly VITE_LEAD_NOTIFY_EMAIL?: string
  readonly VITE_WHATSAPP_BUSINESS_NUMBER?: string
}

interface ImportMeta {
  readonly env: ImportMetaEnv
}
