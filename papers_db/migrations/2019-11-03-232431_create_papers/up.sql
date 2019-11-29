-- Your SQL goes here
CREATE TABLE papers
(
    id VARCHAR PRIMARY KEY,
    title TEXT,
    paper_abstract TEXT,
    is_meta BOOLEAN NOT NULL DEFAULT 'f',
    file_n smallint NOT NULL,
    pubyear smallint,
    doi text,
    venue text,
    title_tokens tsvector
);
CREATE TABLE citation
(
    cite_from VARCHAR PRIMARY KEY,
    cite_to TEXT[] NOT NULL
    FOREIGN KEY (cite_from) REFERENCES papers (id)

);

CREATE INDEX paper_tok_idx ON papers USING gin (title_tokens);

-- Do this after setting up the db because
-- CREATE TRIGGER   tsvector_upsert BEFORE INSERT OR UPDATE
-- ON papers FOR EACH ROW EXECUTE PROCEDURE
-- tsvector_update_trigger(title_tokens, 'pg_catalog.english', title);

-- To add the pkeys back once we have nuked them
-- ALTER TABLE public.citation ADD CONSTRAINT citation_pkey PRIMARY KEY (cite_from);
-- ALTER TABLE public.papers ADD CONSTRAINT papers_pkey PRIMARY KEY (id);
