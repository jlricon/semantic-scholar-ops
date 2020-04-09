use dotenv::dotenv;
use papers_db::{create_paper, establish_connection, get_json_from_stream};
use regex::Regex;
use regex::RegexBuilder;
use rusoto_s3::{GetObjectRequest, ListObjectsV2Request, S3Client, S3};
use sentry;
use sentry::Level;
use std::env;
#[macro_use]
extern crate lazy_static;
const BUCKET: &str = "ai2-s2-research-public";
const REGION: &str = "us-west-2";
const KEY: &str = "open-corpus/2020-01-01/";
fn main() {
    let args: Vec<String> = env::args().collect();
    let n_paper: usize = (&args[1]).parse().unwrap();
    dotenv().ok();
    let skey = env::var("SENTRY_KEY").unwrap();
    let _guard = sentry::init(skey);
    sentry::integrations::panic::register_panic_handler();
    sentry::capture_message("Starting up", Level::Info);
    let client = S3Client::new(REGION.parse().unwrap());
    let req = ListObjectsV2Request {
        bucket: BUCKET.to_owned(),
        prefix: Some(KEY.to_owned()),
        ..Default::default()
    };
    let buk = client.list_objects_v2(req).sync().unwrap();
    let b2 = buk.contents.unwrap();
    let res: Vec<String> = b2
        .into_iter()
        .filter_map(|v| {
            let s = v.key.unwrap();
            if s.contains(".gz") & !s.contains("sample") {
                Some(s)
            } else {
                None
            }
        })
        .collect();
    res.iter().skip(n_paper).for_each(|r1| {
        lazy_static! {
            static ref RE: Regex = RegexBuilder::new(r"s2-corpus-(\d+)\.gz").build().unwrap();
        }
        dbg!(r1);
        let file_n: i16 = RE
            .captures(r1)
            .unwrap()
            .get(1)
            .unwrap()
            .as_str()
            .parse()
            .unwrap();
        sentry::capture_message(r1, Level::Info);
        let req_get = GetObjectRequest {
            bucket: BUCKET.to_string(),
            key: r1.to_string(),
            ..Default::default()
        };

        let data = client.get_object(req_get).sync().unwrap().body.unwrap();
        let jsons = get_json_from_stream(data);
        let conn = establish_connection();
        create_paper(&conn, jsons, file_n);
    });
}
