//use diesel::prelude::*;
//use papers_db::establish_connection;
//use papers_db::models::Paper;
//
//fn main() {
//    use papers_db::schema::papers::dsl::*;
//
//    let connection = establish_connection();
//    let results = papers
//        .limit(5)
//        .load::<Paper>(&connection)
//        .expect("Error loading posts");
//
//    println!("Displaying {} posts", results.len());
//    for paper in results {
//        println!("{:?}", paper);
//        //        println!("{:?}", paper.id);
//        //        println!("----------\n");
//        //        println!("{:?}", paper.title);
//    }
//}
fn main() {}
