import type { NextApiRequest, NextApiResponse } from "next";
import { Thread } from "../../../data/types";
import { openai } from "../../../lib/openai";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<Thread | { error: string }>
) {
  try {
    const { threadId } = req.query;
    const response = await openai.beta.threads.retrieve(threadId as string);
    res.status(200).json(response);
  } catch (error) {
    res.status(500).json({ error });
  }
}
