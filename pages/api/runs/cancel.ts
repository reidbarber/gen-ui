import type { NextApiRequest, NextApiResponse } from "next";
import { Run } from "../../../data/types";
import { openai } from "../../../lib/openai";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<Run | { error: string }>
) {
  try {
    const { threadId, runId } = req.query;
    const response = await openai.beta.threads.runs.cancel(
      threadId as string,
      runId as string
    );
    res.status(200).json(response);
  } catch (error) {
    res.status(500).json({ error });
  }
}
