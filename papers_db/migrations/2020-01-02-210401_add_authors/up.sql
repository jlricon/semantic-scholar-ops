-- Your SQL goes here

CREATE TABLE authors
(
    id VARCHAR PRIMARY KEY,
    name VARCHAR NOT NULL

);
CREATE TABLE paper_to_author
(
    paper_id VARCHAR NOT NULL,
    author_id VARCHAR NOT NULL,
    PRIMARY KEY(paper_id,author_id),
       FOREIGN KEY (paper_id) REFERENCES papers (id),
          FOREIGN KEY (author_id) REFERENCES authors (id)

);
