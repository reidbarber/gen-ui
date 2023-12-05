import type { NextApiRequest, NextApiResponse } from "next";
import OpenAI from "openai";
import { Thread, ThreadUpdateParams } from "../../../data/types";

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<Thread | { error: string }>
) {
  try {
    const { threadId } = req.query;
    const body: ThreadUpdateParams = req.body;
    const response = await openai.beta.threads.update(threadId as string, body);
    res.status(200).json(response);
  } catch (error) {
    res.status(500).json({ error: "Error updating thread" });
  }
}
