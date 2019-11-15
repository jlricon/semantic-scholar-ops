import { NextApiRequest, NextApiResponse } from "next";
const { Pool } = require("pg");
const pool = new Pool({ idleTimeoutMillis: 20000 });
pool.on("error", (err, client) => {
  console.error("Unexpected error on idle client", err);
  process.exit(-1);
});

export default function handle(req: NextApiRequest, res: NextApiResponse) {
  const paperId = req.query.id;
  return pool.connect().then(client => {
    return client
      .query(
        // `SELECT id,title,paper_abstract FROM papers

        // WHERE id IN (SELECT unnest(cite_to) FROM citation WHERE cite_from=$1)
        // AND is_meta = true`,
        "SELECT * FROM citation LIMIT 10"
        // [paperId]
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
