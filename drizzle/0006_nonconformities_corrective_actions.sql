create type nonconformity_origin as enum ('AUDIT','INSPECTION','PROCESS','INCIDENT','COMPLAINT','OTHER');
create type nonconformity_class as enum ('MINOR','MAJOR','CRITICAL');
create type nonconformity_status as enum ('DETECTED','UNDER_EVALUATION','IMMEDIATE_MEASURE','ROOT_CAUSE_ANALYSIS','ACTION_PLANNING','ACTIONS_IN_PROGRESS','EFFECTIVENESS_REVIEW','CLOSED','REOPENED');
create type cause_analysis_status as enum ('NOT_STARTED','IN_PROGRESS','COMPLETED');
create type corrective_action_status as enum ('PLANNED','IN_PROGRESS','COMPLETED','CANCELLED');
create type action_priority as enum ('LOW','MEDIUM','HIGH','URGENT');
create type effectiveness_result as enum ('NOT_ASSESSED','EFFECTIVE','PARTIALLY_EFFECTIVE','INEFFECTIVE');
create table nonconformities (id uuid primary key default gen_random_uuid(), organization_id uuid not null references organizations(id), reference text not null, title text not null, description text not null, origin nonconformity_origin not null, audit_id uuid references audits(id), finding_id uuid references audit_findings(id), process_id uuid references processes(id), requirement_id uuid references requirements(id), risk_id uuid references risks(id), detected_on date not null, classification nonconformity_class not null, owner_reference text, immediate_measures text, due_on date, status nonconformity_status not null default 'DETECTED', created_at timestamptz not null default now(), updated_at timestamptz not null default now(), deleted_at timestamptz);
create unique index nonconformities_org_reference_unique on nonconformities(organization_id, reference);
create index nonconformities_status_idx on nonconformities(status);
create index nonconformities_due_idx on nonconformities(due_on);
create table cause_analyses (id uuid primary key default gen_random_uuid(), nonconformity_id uuid not null unique references nonconformities(id), immediate_causes text, root_causes text, method text not null, factual_basis text not null, retained_causes text not null, rationale text not null, analyzed_on date not null, status cause_analysis_status not null default 'NOT_STARTED', origin event_origin not null default 'UNVERIFIED_OPERATOR', created_at timestamptz not null default now(), updated_at timestamptz not null default now(), deleted_at timestamptz);
create table corrective_actions (id uuid primary key default gen_random_uuid(), nonconformity_id uuid not null references nonconformities(id), reference text not null, planned_action text not null, owner_reference text not null, due_on date not null, priority action_priority not null default 'MEDIUM', resources text, status corrective_action_status not null default 'PLANNED', completion_evidence text, executed_on date, verification_result text, created_at timestamptz not null default now(), updated_at timestamptz not null default now(), deleted_at timestamptz);
create unique index corrective_actions_nc_reference_unique on corrective_actions(nonconformity_id, reference);
create index corrective_actions_status_idx on corrective_actions(status);
create index corrective_actions_due_idx on corrective_actions(due_on);
create table effectiveness_reviews (id uuid primary key default gen_random_uuid(), nonconformity_id uuid not null references nonconformities(id), method text not null, criteria text not null, observations text not null, evidence_reference text, result effectiveness_result not null, recurrence_risk text, closure_decision text not null, decided_on date not null, origin event_origin not null default 'UNVERIFIED_OPERATOR', created_at timestamptz not null default now(), updated_at timestamptz not null default now(), deleted_at timestamptz);
create index effectiveness_reviews_nc_idx on effectiveness_reviews(nonconformity_id);
create index effectiveness_reviews_result_idx on effectiveness_reviews(result);
alter table nonconformities enable row level security;
alter table cause_analyses enable row level security;
alter table corrective_actions enable row level security;
alter table effectiveness_reviews enable row level security; 
-- No policies are created: server-side access remains closed until an authenticated/RLS model is approved.

-- Dependencies: apply after 0005_internal_audits.sql, 0004_risks_opportunities.sql and the baseline tables.
-- Non-destructive: creates new tables/types only; no existing rows are altered.
