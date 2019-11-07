-- Your SQL goes here
CREATE TABLE papers
(
    id VARCHAR PRIMARY KEY,
    title TEXT,
    paper_abstract TEXT,
    is_meta BOOLEAN NOT NULL DEFAULT 'f'
);
CREATE TABLE citation
(
    cite_from VARCHAR PRIMARY KEY,
    cite_to TEXT[] NOT NULL,
    FOREIGN KEY (cite_from) REFERENCES papers (id)

);