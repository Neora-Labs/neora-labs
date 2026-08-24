# AI project discovery

The existing hero opens `BriefAgent`, which now acts as a thin controller for the discovery UI. All workflow and commercial logic remains server-side.

## Boundaries

- `src/types` and `src/lib/discovery`: domain state, requirements, question selection, confidence and summaries.
- `src/lib/ai`: OpenAI Responses API extraction with strict JSON Schema. It never prices projects.
- `src/lib/pricing`: deterministic, editable pricing configuration and calculation.
- `src/lib/database`: server-only Supabase REST repositories.
- `src/lib/rag`: optional pgvector retrieval used only as advisory AI context.
- `src/lib/email` and `src/lib/pdf`: delivery consumers of the completed domain state.
- `src/app/api/discovery`: validation, rate limiting and command routing.

Without external credentials, discovery and pricing continue to work using the conservative local extractor. Supabase persistence, OpenAI extraction, RAG and email/report delivery activate when their environment variables are configured.

## Setup

1. Copy `.env.example` to `.env.local` and add server-side credentials.
2. Apply `supabase/migrations/20260824000000_discovery.sql` to the target Supabase project.
3. Add knowledge rows and their 1536-dimension `text-embedding-3-small` vectors to `knowledge_documents`.
4. Verify the Resend sender domain and set `BRIEF_FROM_EMAIL` and `INTERNAL_REPORT_EMAIL`.

Never expose `SUPABASE_SERVICE_ROLE_KEY`, `OPENAI_API_KEY`, or `RESEND_API_KEY` through `NEXT_PUBLIC_*` variables.
