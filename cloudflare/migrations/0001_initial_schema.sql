-- Cloudflare D1 SQL Schema for Little Mandarin Learning System v3.0

CREATE TABLE IF NOT EXISTS knowledge_entries (
  id TEXT PRIMARY KEY,
  normalized_query TEXT NOT NULL UNIQUE,
  entry_type TEXT NOT NULL,
  title TEXT NOT NULL,
  pronunciation TEXT NOT NULL,
  definition TEXT NOT NULL,
  word_combinations TEXT,
  idiom_origin TEXT,
  example_sentences TEXT,
  difficulty_level TEXT,
  source_id TEXT NOT NULL,
  source_url TEXT,
  source_license TEXT NOT NULL,
  verification_status TEXT NOT NULL,
  content_hash TEXT NOT NULL,
  version INTEGER NOT NULL DEFAULT 1,
  created_at TEXT NOT NULL,
  updated_at TEXT NOT NULL,
  last_checked_at TEXT NOT NULL,
  expires_at TEXT NOT NULL
);

CREATE TABLE IF NOT EXISTS candidate_entries (
  id TEXT PRIMARY KEY,
  normalized_query TEXT NOT NULL,
  raw_data TEXT,
  parsed_data TEXT,
  source_id TEXT NOT NULL,
  source_url TEXT,
  source_license TEXT,
  validation_errors TEXT,
  verification_status TEXT NOT NULL,
  content_hash TEXT NOT NULL,
  created_at TEXT NOT NULL,
  updated_at TEXT NOT NULL
);

CREATE TABLE IF NOT EXISTS data_sources (
  id TEXT PRIMARY KEY,
  source_name TEXT NOT NULL,
  source_type TEXT NOT NULL,
  source_url TEXT NOT NULL,
  api_endpoint TEXT,
  license TEXT NOT NULL,
  attribution_required INTEGER NOT NULL,
  redistribution_allowed INTEGER NOT NULL,
  modification_allowed INTEGER NOT NULL,
  trust_level TEXT NOT NULL,
  enabled INTEGER NOT NULL,
  last_checked_at TEXT NOT NULL
);

CREATE TABLE IF NOT EXISTS query_statistics (
  normalized_query TEXT PRIMARY KEY,
  query_count INTEGER NOT NULL DEFAULT 1,
  cache_hit_count INTEGER NOT NULL DEFAULT 0,
  api_hit_count INTEGER NOT NULL DEFAULT 0,
  external_search_count INTEGER NOT NULL DEFAULT 0,
  last_queried_at TEXT NOT NULL
);

CREATE TABLE IF NOT EXISTS data_versions (
  id TEXT PRIMARY KEY,
  entry_id TEXT NOT NULL,
  old_version INTEGER NOT NULL,
  new_version INTEGER NOT NULL,
  change_reason TEXT NOT NULL,
  source_id TEXT NOT NULL,
  created_at TEXT NOT NULL
);

CREATE INDEX IF NOT EXISTS idx_knowledge_norm ON knowledge_entries(normalized_query);
CREATE INDEX IF NOT EXISTS idx_candidate_norm ON candidate_entries(normalized_query);
