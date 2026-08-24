create extension if not exists vector with schema extensions;

create table if not exists public.conversations (
  id uuid primary key default gen_random_uuid(),
  session_id uuid not null unique,
  status text not null default 'discovery' check (status in ('discovery', 'confirmation', 'contact', 'complete')),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.messages (
  id uuid primary key,
  conversation_id uuid not null references public.conversations(id) on delete cascade,
  role text not null check (role in ('assistant', 'user')),
  content text not null check (char_length(content) between 1 and 4000),
  created_at timestamptz not null default now()
);
create index if not exists messages_conversation_created_idx on public.messages (conversation_id, created_at);

create table if not exists public.project_specs (
  id uuid primary key default gen_random_uuid(),
  conversation_id uuid not null unique references public.conversations(id) on delete cascade,
  category text check (category in ('web_app', 'ai_automation', 'integration')),
  spec_json jsonb not null,
  confidence numeric(4,3) not null default 0 check (confidence between 0 and 1),
  estimated_min integer,
  estimated_max integer,
  currency text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.leads (
  id uuid primary key default gen_random_uuid(),
  conversation_id uuid not null unique references public.conversations(id) on delete cascade,
  name text not null,
  email text not null,
  company_name text,
  phone text,
  status text not null default 'new',
  created_at timestamptz not null default now()
);

create table if not exists public.knowledge_documents (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  category text,
  content text not null,
  embedding extensions.vector(1536),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);
create index if not exists knowledge_documents_embedding_idx
  on public.knowledge_documents using hnsw (embedding extensions.vector_cosine_ops);

alter table public.conversations enable row level security;
alter table public.messages enable row level security;
alter table public.project_specs enable row level security;
alter table public.leads enable row level security;
alter table public.knowledge_documents enable row level security;

-- No anonymous policies are created. The Next.js server uses the service-role key;
-- browsers never receive direct access to discovery records or lead contact data.

create or replace function public.match_knowledge_documents(
  query_embedding extensions.vector(1536),
  match_threshold float,
  match_count int
)
returns table (id uuid, title text, category text, content text, similarity float)
language sql stable
set search_path = public, extensions
as $$
  select
    knowledge_documents.id,
    knowledge_documents.title,
    knowledge_documents.category,
    knowledge_documents.content,
    1 - (knowledge_documents.embedding <=> query_embedding) as similarity
  from public.knowledge_documents
  where knowledge_documents.embedding is not null
    and 1 - (knowledge_documents.embedding <=> query_embedding) > match_threshold
  order by knowledge_documents.embedding <=> query_embedding
  limit least(match_count, 10);
$$;

revoke all on function public.match_knowledge_documents(extensions.vector, float, int) from public, anon, authenticated;
grant execute on function public.match_knowledge_documents(extensions.vector, float, int) to service_role;
