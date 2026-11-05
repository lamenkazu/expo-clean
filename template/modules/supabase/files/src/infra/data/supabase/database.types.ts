// Gere os tipos reais depois de criar as tabelas:
//   pnpm dlx supabase gen types typescript --project-id <id> > src/infra/data/supabase/database.types.ts
export type Database = {
  public: {
    Tables: Record<string, never>;
    Views: Record<string, never>;
    Functions: Record<string, never>;
    Enums: Record<string, never>;
    CompositeTypes: Record<string, never>;
  };
};
