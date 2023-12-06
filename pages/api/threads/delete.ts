import type { NextApiRequest, NextApiResponse } from "next";
import { ThreadDeleted } from "../../../data/types";
import { openai } from "../../../lib/openai";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<ThreadDeleted | { error: string }>
) {
  try {
    const { threadId } = req.query;
    const response = await openai.beta.threads.del(threadId as string);
    res.status(200).json(response);
  } catch (error) {
    res.status(500).json({ error });
  }
}
