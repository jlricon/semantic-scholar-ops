table! {
    use diesel::sql_types::*;
    use diesel_full_text_search::TsVector;

    citation (cite_from) {
        cite_from -> Varchar,
        cite_to -> Array<Text>,
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
        title_tokens -> Nullable<Tsvector>,
    }
}

joinable!(citation -> papers (cite_from));

allow_tables_to_appear_in_same_query!(
    citation,
    papers,
);
