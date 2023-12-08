import type { NextApiRequest, NextApiResponse } from "next";
import { openai } from "../../../lib/openai";
import { AssistantsPage } from "openai/resources/beta/assistants/assistants";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<AssistantsPage | { error: string }>
) {
  try {
    if (req.method === "GET") {
      const response = await openai.beta.assistants.list(); // TODO support query
      res.status(200).json(response);
    } else {
      res.status(405).json({ error: "Method not allowed" });
    }
  } catch (error) {
    res.status(500).json({ error });
  }
}
