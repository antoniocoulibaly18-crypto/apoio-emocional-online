-- ============================================================
-- Migração: prioridade de emergência nas conversas
-- Rode isto no SQL Editor do Supabase DEPOIS de já ter rodado supabase/schema.sql
-- ============================================================

alter table public.conversas
  add column if not exists prioridade text not null default 'normal'
  check (prioridade in ('normal', 'urgente'));

alter table public.conversas
  add column if not exists origem text not null default 'chat_direto'
  check (origem in ('chat_direto', 'assistente_ia'));

-- Índice para ordenar a fila do dashboard por urgência rapidamente
create index if not exists conversas_prioridade_idx on public.conversas (prioridade, criado_em);
