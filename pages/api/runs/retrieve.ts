import type { NextApiRequest, NextApiResponse } from "next";
import OpenAI from "openai";
import { Run } from "../../../data/types";

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<Run | { error: string }>
) {
  try {
    const { threadId, runId } = req.query;
    const response = await openai.beta.threads.runs.retrieve(
      threadId as string,
      runId as string
    );
    res.status(200).json(response);
  } catch (error) {
    res.status(500).json({ error: "Error retrieving thread" });
  }
}
