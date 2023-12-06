import type { NextApiRequest, NextApiResponse } from "next";
import { Run, RunCreateParams } from "../../../data/types";
import { openai } from "../../../lib/openai";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<Run | { error: string }>
) {
  try {
    const body: RunCreateParams = req.body;
    const { threadId } = req.query;
    const response = await openai.beta.threads.runs.create(
      threadId as string,
      body
    );
    res.status(200).json(response);
  } catch (error) {
    res.status(500).json({ error });
  }
}
