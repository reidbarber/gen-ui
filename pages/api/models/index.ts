import type { NextApiRequest, NextApiResponse } from "next";
import { openai } from "../../../lib/openai";
import { ModelsPage } from "openai/resources";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<ModelsPage | { error: string }>
) {
  try {
    if (req.method === "GET") {
      const response = await openai.models.list();
      res.status(200).json(response);
    } else {
      res.status(405).json({ error: "Method not allowed" });
    }
  } catch (error) {
    res.status(500).json({ error });
  }
}
