#[macro_use]
extern crate diesel;
#[macro_use]
extern crate lazy_static;

use std::env;
use std::fs::File;
use std::io::BufReader;
use std::io::Read;

use diesel::pg::PgConnection;
use diesel::prelude::*;
use flate2::bufread::GzDecoder;
use regex::Regex;
use regex::RegexBuilder;
use rusoto_s3::StreamingBody;
use serde::Deserialize;

use dotenv::dotenv;

use crate::models::{NewCitation, NewPaper};

pub mod models;
pub mod schema;

#[derive(Deserialize, Debug)]
pub struct JsonPaper {
    id: String,
    #[serde(rename = "inCitations")]
    in_citations: Option<Vec<String>>,
    title: Option<String>,
    #[serde(rename = "paperAbstract")]
    paper_abstract: Option<String>,
}
pub fn get_json_from_file(file: &str) -> Vec<JsonPaper> {
    let s = {
        let f = File::open(file).expect("Did not find file");
        let reader = BufReader::new(f);
        let mut d = GzDecoder::new(reader);
        let mut s = String::new();
        d.read_to_string(&mut s).expect("Failed to read to string");
        s
    };
    make_jsons(s)
}
pub fn get_json_from_stream(stream: StreamingBody) -> Vec<JsonPaper> {
    let s = {
        let read_stream = stream.into_blocking_read();
        let reader = BufReader::new(read_stream);

        let mut d = GzDecoder::new(reader);
        let mut s = String::new();
        d.read_to_string(&mut s).expect("Failed to read to string");
        s
    };
    make_jsons(s)
}
fn make_jsons(s: String) -> Vec<JsonPaper> {
    s.split('\n')
        .filter(|x| !x.is_empty())
        .map(|x| serde_json::from_str(x).unwrap())
        .collect()
}

pub fn establish_connection() -> PgConnection {
    dotenv().ok();

    let database_url = env::var("DATABASE_URL").expect("DATABASE_URL must be set");
    PgConnection::establish(&database_url).expect(&format!("Error connecting to {}", database_url))
}

pub fn is_meta(x: &str) -> bool {
    lazy_static! {
        static ref RE: Regex =
            RegexBuilder::new(r"meta-analy|systematic literature r|systematic review")
                .case_insensitive(true)
                .build()
                .unwrap();
    }
    RE.is_match(x)
}
pub fn create_paper(conn: &PgConnection, paper: Vec<JsonPaper>, file_n: i16) {
    use schema::citation;
    use schema::papers;
    let papers: Vec<NewPaper> = paper
        .iter()
        .map(|paper| {
            let title = paper.title.as_ref().map(|x| &*x.as_str());
            let paper_abstract = match paper.paper_abstract.as_ref().map(|x| &*x.as_str()) {
                None => None,
                Some(e) if e.is_empty() => None,
                Some(e) => Some(e),
            };
            NewPaper {
                id: &paper.id,
                title,
                paper_abstract,
                is_meta: paper_abstract.map_or(false, |abs| is_meta(abs)),
                file_n,
            }
        })
        .collect();
    let citations: Vec<NewCitation> = paper
        .iter()
        .filter_map(|p| match &p.in_citations {
            None => None,
            Some(citations) if citations.is_empty() => None,
            Some(citations) => Some(NewCitation {
                cite_from: &p.id,
                cite_to: citations.iter().map(|x| x.as_str()).collect(),
            }),
        })
        .collect();
    papers.chunks(1000).for_each(|chunk| {
        diesel::insert_into(papers::table)
            .values(chunk)
            .execute(conn)
            .unwrap();
    });
    citations.chunks(2000).for_each(|chunk| {
        diesel::insert_into(citation::table)
            .values(chunk)
            .execute(conn)
            .unwrap();
    });
}

#[cfg(test)]
mod tests {
    use super::*;

    #[test]
    fn test_is_meta() {
        assert_eq!(is_meta("Meta-analysis"), true);
    }
}
