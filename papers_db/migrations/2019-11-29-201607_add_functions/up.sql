-- Your SQL goes here
CREATE FUNCTION search_metas_for_id(search text)
RETURNS SETOF papers AS $$
    SELECT *
      FROM papers
        WHERE id IN (SELECT unnest(cite_to) FROM citation WHERE cite_from=search)
        AND is_meta = true
$$ LANGUAGE sql STABLE;

CREATE FUNCTION public.search_paper(search text, lim integer) RETURNS SETOF papers  AS $$
SELECT
  *
FROM
  papers
WHERE
  title_tokens @@ websearch_to_tsquery('english', search)
  OR doi = search
LIMIT
  lim $$ LANGUAGE sql STABLE;

CREATE FUNCTION search_paper_citations(search text, lim int)
RETURNS SETOF papers AS $$
    SELECT *
        FROM papers
        WHERE id IN
            (SELECT unnest(cite_to)
              FROM citation
              WHERE cite_from =
                  (SELECT id
                  FROM papers
                  WHERE title_tokens @@  websearch_to_tsquery('english',search)  LIMIT 1 ) )
        LIMIT lim
$$ LANGUAGE sql STABLE;
