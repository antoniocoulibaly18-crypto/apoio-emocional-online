-- ============================================================
-- Schema: Psicólogos reais + Chat em tempo real
-- Rode este ficheiro no SQL Editor do seu projeto Supabase
-- (https://app.supabase.com -> seu projeto -> SQL Editor -> New query)
-- ============================================================

-- Extensão usada para gerar UUIDs
create extension if not exists "pgcrypto";

-- ------------------------------------------------------------
-- Tabela de psicólogos
-- O id é o MESMO id do usuário em auth.users (Supabase Auth),
-- criado quando o psicólogo faz o cadastro/login.
-- ------------------------------------------------------------
create table if not exists public.psicologos (
  id uuid primary key references auth.users(id) on delete cascade,
  nome text not null,
  crp text not null,               -- número de registo profissional
  especialidade text,
  bio text,
  foto_url text,
  ativo boolean not null default false,  -- só aparece p/ usuários quando true (aprovado)
  online boolean not null default false,
  criado_em timestamptz not null default now()
);

alter table public.psicologos enable row level security;

-- Qualquer pessoa autenticada pode VER psicólogos ativos (para listar/escolher)
create policy "Usuarios podem ver psicologos ativos"
  on public.psicologos for select
  using (ativo = true or id = auth.uid());

-- Um psicólogo só pode editar o próprio perfil
create policy "Psicologo edita o proprio perfil"
  on public.psicologos for update
  using (id = auth.uid());

create policy "Psicologo insere o proprio perfil"
  on public.psicologos for insert
  with check (id = auth.uid());

-- ------------------------------------------------------------
-- Tabela de conversas (uma por par usuário-psicólogo em aberto)
-- ------------------------------------------------------------
create table if not exists public.conversas (
  id uuid primary key default gen_random_uuid(),
  usuario_id text not null,        -- id do usuário (do seu auth.ts atual, localStorage)
  usuario_nome text not null,
  psicologo_id uuid references public.psicologos(id),
  status text not null default 'aguardando' check (status in ('aguardando','em_andamento','encerrada')),
  criado_em timestamptz not null default now(),
  atualizado_em timestamptz not null default now()
);

alter table public.conversas enable row level security;

-- Psicólogos autenticados podem ver/gerir conversas atribuídas a eles ou ainda sem psicólogo (fila de espera)
create policy "Psicologo ve conversas atribuidas ou na fila"
  on public.conversas for select
  using (psicologo_id = auth.uid() or psicologo_id is null);

create policy "Psicologo assume ou atualiza conversa"
  on public.conversas for update
  using (psicologo_id = auth.uid() or psicologo_id is null);

-- Usuários (sem login Supabase, usam a chave anônima) podem criar e ler a própria conversa.
-- Como o app de usuário não usa Supabase Auth, o controle de "é dono da conversa" é feito
-- pela aplicação (usuario_id vem do localStorage) — não há RLS forte aqui.
-- Se quiser reforçar isso depois, migre o login do usuário também para Supabase Auth.
create policy "Qualquer um pode criar conversa"
  on public.conversas for insert
  with check (true);

create policy "Qualquer um pode ver conversas (leitura via usuario_id na app)"
  on public.conversas for select
  using (true);

-- ------------------------------------------------------------
-- Tabela de mensagens
-- ------------------------------------------------------------
create table if not exists public.mensagens (
  id uuid primary key default gen_random_uuid(),
  conversa_id uuid not null references public.conversas(id) on delete cascade,
  remetente_tipo text not null check (remetente_tipo in ('usuario','psicologo')),
  remetente_nome text not null,
  conteudo text not null,
  criado_em timestamptz not null default now()
);

alter table public.mensagens enable row level security;

create policy "Qualquer um pode ler mensagens da conversa"
  on public.mensagens for select
  using (true);

create policy "Qualquer um pode enviar mensagem"
  on public.mensagens for insert
  with check (true);

-- ------------------------------------------------------------
-- Realtime: habilita replicação para as tabelas de chat
-- ------------------------------------------------------------
alter publication supabase_realtime add table public.mensagens;
alter publication supabase_realtime add table public.conversas;

-- ------------------------------------------------------------
-- Trigger: atualizar "atualizado_em" da conversa a cada nova mensagem
-- ------------------------------------------------------------
create or replace function public.tocar_conversa()
returns trigger as $$
begin
  update public.conversas set atualizado_em = now() where id = new.conversa_id;
  return new;
end;
$$ language plpgsql security definer;

create trigger trg_tocar_conversa
after insert on public.mensagens
for each row execute function public.tocar_conversa();
