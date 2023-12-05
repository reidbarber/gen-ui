import type { NextApiRequest, NextApiResponse } from "next";
import OpenAI from "openai";
import { ThreadDeleted } from "../../../data/types";

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<ThreadDeleted | { error: string }>
) {
  try {
    const { threadId } = req.query;
    const response = await openai.beta.threads.del(threadId as string);
    res.status(200).json(response);
  } catch (error) {
    res.status(500).json({ error: "Error updating thread" });
  }
}
