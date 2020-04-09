"use strict";
const { Pool } = require("pg");
const pool = new Pool({ idleTimeoutMillis: 40000 });
pool.on("error", (err, client) => {
  console.error("Unexpected error on idle client", err);
  process.exit(-1);
});

module.exports.get_papers = async event => {
  // Figure out if we are querying by id or what
  const queryKind = event.queryStringParameters.queryKind;
  // This can be many things
  console.log(queryKind);

  if (queryKind === "meta_for_id") {
    const paperId = event.queryStringParameters.id;
    console.log(paperId);
    return getMetasForPaperId(paperId);
  } else if (queryKind === "paper_for_doi") {
    const doi = event.queryStringParameters.doi;
    console.log(doi);
    return getPaperForDoi(doi);
  } else if (queryKind === "paper_for_text") {
    // This is an array
    const text = event.queryStringParameters.text;
    console.log(text);
    return getPaperForText(text);
  } else if (queryKind === "citations_for_doi") {
    const doi = event.queryStringParameters.doi;
    console.log(doi);
    return getCitationsForDoi(doi);
  } else if (queryKind === "citations_for_title") {
    const { title } = event.queryStringParameters;
    console.log(title);
    return getCitationsForTitle(title);
  } else if (queryKind === "meta_for_doi") {
    const { doi } = event.queryStringParameters;
    console.log(doi);
    return getMetasForDoi(doi);
  } else {
    throw "Error queryKind not valid";
  }
};
function getPaperForText(text) {
  // query MyQuery {
  //   search_paper(args: {search: "physics", lim: 20}, order_by: {pubyear: desc_nulls_last}) {
  //     venue
  //     pubyear
  //     paper_abstract
  //     doi
  //     id
  //     is_meta
  //     title
  //   }
  // }

  return pool.connect().then(client => {
    return client
      .query(
        `select
        *
      from
        (
          select id,
          title,
          paper_abstract,
          pubyear,
          doi,
          venue,
          is_meta
        from
          papers
        where
          title_tokens @@  websearch_to_tsquery('english', $1)
          OR doi = $1
        limit 20) as t
      order by
        t.pubyear desc`,
        [joined_text]
      )
      .then(res => {
        client.release();
        return {
          statusCode: 200,
          body: JSON.stringify(res.rows)
        };
      })
      .catch(err => {
        client.release();
        throw err;
      });
  });
}
// query MyQuery {
//   papers(limit: 1, where: {doi: {_eq: ""}}) {
//     id
//     title
//     paper_abstract
//     pubyear
//     doi
//     venue
//   }
// }

function getPaperForDoi(doi) {
  return pool.connect().then(client => {
    return client
      .query(
        `SELECT id,title,paper_abstract,pubyear, doi, venue FROM papers 
        WHERE doi = $1 LIMIT 1`,
        [doi]
      )
      .then(res => {
        client.release();
        return {
          statusCode: 200,
          body: JSON.stringify(res.rows)
        };
      })
      .catch(err => {
        client.release();
        throw err;
      });
  });
}
function getMetasForDoi(doi) {
  return pool.connect().then(client => {
    return client
      .query(
        `SELECT DISTINCT doi FROM papers 
        WHERE id IN (SELECT unnest(cite_to) FROM citation WHERE cite_from = (
          SELECT id FROM papers WHERE doi=$1 LIMIT 1
        ))
         AND doi IS NOT NULL`,
        [doi]
      )
      .then(res => {
        client.release();
        return {
          statusCode: 200,
          body: JSON.stringify(res.rows.map(i => i.doi))
        };
      })
      .catch(err => {
        client.release();
        throw err;
      });
  });
}
function getCitationsForDoi(doi) {
  return pool.connect().then(client => {
    return client
      .query(
        `SELECT title,paper_abstract,pubyear, doi, venue,is_meta FROM papers 
        WHERE id IN (SELECT unnest(cite_to) FROM citation WHERE cite_from = (
          SELECT id FROM papers WHERE doi=$1 LIMIT 1
        )) ORDER BY pubyear DESC LIMIT 100`,
        [doi]
      )
      .then(res => {
        client.release();
        return {
          statusCode: 200,
          body: JSON.stringify(res.rows)
        };
      })
      .catch(err => {
        client.release();
        throw err;
      });
  });
}
// query MyQuery {
//   search_paper_citations(args: {lim: 100, search: "physics"}, order_by: {pubyear: desc_nulls_last}) {
//     title
//     paper_abstract
//     pubyear
//     venue
//     is_meta
//     doi
//   }
// }
function getCitationsForTitle(title) {
  return pool.connect().then(client => {
    return Promise.all([
      client.query(
        `SELECT COUNT(*) FROM (SELECT * FROM papers WHERE title_tokens @@ websearch_to_tsquery('english',$1) LIMIT 1000) AS t `,
        [title]
      ),
      //  ts_rank_cd(title_tokens, q) AS rank ORDER BY rank DESC
      client.query(
        `SELECT title,
        paper_abstract,
        pubyear,
        doi,
        venue,
        is_meta
        FROM papers
        WHERE id IN
            (SELECT unnest(cite_to)
              FROM citation
              WHERE cite_from =
                  (SELECT id
                  FROM papers             
                  WHERE title_tokens @@  websearch_to_tsquery('english',$1)  LIMIT 1 ) )
        ORDER BY pubyear DESC
        LIMIT 100`,
        [title]
      )
    ])

      .then(values => {
        const nmatches = parseInt(values[0].rows[0].count);
        const rows = values[1].rows;
        client.release();
        return {
          statusCode: 200,
          body: JSON.stringify({
            rows: rows,
            nmatches: nmatches
          })
        };
      })
      .catch(err => {
        client.release();
        throw err;
      });
  });
}
// query MyQuery {
//   search_metas_for_id(args: {search: "physics"}) {
//     id
//     paper_abstract
//     pubyear
//     doi
//     venue
//     title
//   }
// }

function getMetasForPaperId(paperId) {
  return pool.connect().then(client => {
    return client
      .query(
        `SELECT id,title,paper_abstract,pubyear, doi, venue FROM papers 
        WHERE id IN (SELECT unnest(cite_to) FROM citation WHERE cite_from=$1)
        AND is_meta = true`,
        [paperId]
      )
      .then(res => {
        client.release();
        return {
          statusCode: 200,
          body: JSON.stringify(res.rows)
        };
      })
      .catch(err => {
        client.release();
        throw err;
      });
  });
}
