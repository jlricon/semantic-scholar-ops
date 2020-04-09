use diesel_full_text_search::TsVector;
#[derive(Queryable)]
pub struct Paper {
    pub id: String,
    pub title: Option<String>,
    pub paper_abstract: Option<String>,
    pub is_meta: bool,
    pub file_n: i16,
    pub venue: Option<String>,
    pub doi: Option<String>,
    pub pubyear: Option<i16>,
    pub title_tokens: Option<TsVector>,
}
use super::schema::papers;
#[derive(Insertable)]
#[table_name = "papers"]
pub struct NewPaper<'a> {
    pub id: &'a str,
    pub title: Option<&'a str>,
    pub paper_abstract: Option<&'a str>,
    pub is_meta: bool,
    pub file_n: i16,
    pub venue: Option<&'a str>,
    pub doi: Option<&'a str>,
    pub pubyear: Option<i16>,
}

use super::schema::citation;
#[derive(Insertable, Debug)]
#[table_name = "citation"]
pub struct NewCitation<'a> {
    pub cite_from: &'a str,
    pub cite_to: Vec<&'a str>,
    pub citation_count: i32,
}
use super::schema::authors;
#[derive(Insertable, Debug)]
#[table_name = "authors"]
pub struct NewAuthor<'a> {
    pub id: &'a str,
    pub name: &'a str,
}
use super::schema::paper_to_author;
#[derive(Insertable, Debug, Hash, PartialEq, Eq, Clone)]
#[table_name = "paper_to_author"]
pub struct NewAuthorToPaper<'a> {
    pub paper_id: &'a str,
    pub author_id: &'a str,
}
