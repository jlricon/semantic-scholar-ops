import { NextApiRequest, NextApiResponse } from "next";
import fetch from "isomorphic-unfetch";
export default function handle(req: NextApiRequest, res: NextApiResponse) {
  const paperId = req.query.id;
  if (paperId === undefined) {
    res.status(500).send("You must provide an ID");
  } else {
    fetch(
      "https://ftbk772hkb.execute-api.eu-west-1.amazonaws.com/dev/webhook?id=" +
        paperId,
      {
        headers: { "X-API-KEY": process.env.DB_REST_API_KEY }
      }
    )
      .then(response => response.json())
      .then(jsonified => {
        res.setHeader("Cache-Control", "max-age=0, s-maxage=86400");
        res.json(JSON.stringify(jsonified));
      });
  }
}
