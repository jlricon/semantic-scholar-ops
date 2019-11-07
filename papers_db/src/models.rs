#[derive(Queryable, Debug)]
pub struct Paper {
    pub id: String,
    pub title: Option<String>,
    pub paper_abstract: Option<String>,
    pub is_meta: bool,
    pub file_n: i16,
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
}

use super::schema::citation;
#[derive(Insertable, Debug)]
#[table_name = "citation"]
pub struct NewCitation<'a> {
    pub cite_from: &'a str,
    pub cite_to: Vec<&'a str>,
}
