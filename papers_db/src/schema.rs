table! {
    citation (cite_from) {
        cite_from -> Varchar,
        cite_to -> Array<Text>,
    }
}

table! {
    papers (id) {
        id -> Varchar,
        title -> Nullable<Text>,
        paper_abstract -> Nullable<Text>,
        is_meta -> Bool,
        file_n -> Nullable<Int2>,
    }
}

joinable!(citation -> papers (cite_from));

allow_tables_to_appear_in_same_query!(citation, papers,);
