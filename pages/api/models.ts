// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from 'next'

type Data = {
  name: string
}

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<Data>
) {
  const OPENAI_KEY = process.env.OPENAI_KEY;

  let codexResponse = await fetch(`https://api.openai.com/v1/models`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${OPENAI_KEY}`,
    },
  });
  let json = await codexResponse.json();

  res.status(200).send(json);
}
