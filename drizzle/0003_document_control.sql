-- Increment 3.9: document control, revisions, evidence attachments and links.
-- Proposal only. Apply through the authorized Neon migration workflow; never run automatically.
CREATE TYPE document_revision_status AS ENUM ('DRAFT', 'IN_REVIEW', 'APPROVED', 'PUBLISHED', 'OBSOLETE');
CREATE TABLE controlled_document_revisions (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(), organization_id uuid NOT NULL REFERENCES organizations(id) ON DELETE RESTRICT,
  document_id uuid NOT NULL REFERENCES controlled_documents(id) ON DELETE RESTRICT, version varchar(32) NOT NULL,
  status document_revision_status NOT NULL, change_summary text NOT NULL, content_hash varchar(128), storage_key text,
  submitted_at timestamptz, approved_at timestamptz, published_at timestamptz, obsolete_at timestamptz,
  approved_by uuid REFERENCES app_users(id) ON DELETE SET NULL, published_by uuid REFERENCES app_users(id) ON DELETE SET NULL,
  created_at timestamptz NOT NULL DEFAULT now(), updated_at timestamptz NOT NULL DEFAULT now(),
  CONSTRAINT doc_revisions_org_document_version_unique UNIQUE (organization_id, document_id, version)
);
CREATE INDEX doc_revisions_document_idx ON controlled_document_revisions(document_id);
CREATE INDEX doc_revisions_status_idx ON controlled_document_revisions(organization_id, status);
CREATE TABLE evidence_attachments (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(), organization_id uuid NOT NULL REFERENCES organizations(id) ON DELETE RESTRICT,
  evidence_id uuid NOT NULL REFERENCES evidence(id) ON DELETE CASCADE, file_name varchar(255) NOT NULL,
  media_type varchar(120) NOT NULL, byte_size integer NOT NULL, storage_key text NOT NULL, checksum varchar(128),
  created_at timestamptz NOT NULL DEFAULT now(), updated_at timestamptz NOT NULL DEFAULT now()
);
CREATE INDEX evidence_attachments_evidence_idx ON evidence_attachments(evidence_id);
CREATE INDEX evidence_attachments_org_idx ON evidence_attachments(organization_id);
CREATE TABLE evidence_links (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(), organization_id uuid NOT NULL REFERENCES organizations(id) ON DELETE RESTRICT,
  evidence_id uuid NOT NULL REFERENCES evidence(id) ON DELETE CASCADE, entity_type varchar(80) NOT NULL,
  entity_id uuid NOT NULL, created_at timestamptz NOT NULL DEFAULT now(), updated_at timestamptz NOT NULL DEFAULT now(),
  CONSTRAINT evidence_links_unique UNIQUE (evidence_id, entity_type, entity_id)
);
CREATE INDEX evidence_links_entity_idx ON evidence_links(entity_type, entity_id);
