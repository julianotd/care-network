-- Fix: Remove auth.users dependency from perfis for MVP phase
-- This will be re-added when Supabase Auth is fully integrated

ALTER TABLE perfis DROP CONSTRAINT IF EXISTS perfis_id_fkey;
ALTER TABLE perfis ALTER COLUMN id SET DEFAULT gen_random_uuid();

-- Drop RLS policies that reference auth (will be re-added with Auth integration)
DROP POLICY IF EXISTS "perfis_own" ON perfis;
DROP POLICY IF EXISTS "clinica_isolation" ON pacientes;
