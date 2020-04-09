table! {
    use diesel::sql_types::*;


    authors (id) {
        id -> Varchar,
        name -> Varchar,
    }
}

table! {
    use diesel::sql_types::*;

    citation (cite_from) {
        cite_from -> Varchar,
        cite_to -> Array<Text>,
        citation_count -> Int4,
    }
}

table! {
    use diesel::sql_types::*;
    use diesel_full_text_search::TsVector;

    papers (id) {
        id -> Varchar,
        title -> Nullable<Text>,
        paper_abstract -> Nullable<Text>,
        is_meta -> Bool,
        file_n -> Int2,
        pubyear -> Nullable<Int2>,
        doi -> Nullable<Text>,
        venue -> Nullable<Text>,
        title_tokens -> Nullable<TsVector>,
    }
}

table! {
    use diesel::sql_types::*;
    paper_to_author (paper_id, author_id) {
        paper_id -> Varchar,
        author_id -> Varchar,
    }
}

joinable!(citation -> papers (cite_from));
joinable!(paper_to_author -> authors (author_id));
joinable!(paper_to_author -> papers (paper_id));

allow_tables_to_appear_in_same_query!(authors, citation, papers, paper_to_author,);
