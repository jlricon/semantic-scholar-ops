-- Your SQL goes here
-- This adds author, citation count, and full search
ALTER TABLE citation
ADD COLUMN citation_count INT NOT NULL DEFAULT 0;


