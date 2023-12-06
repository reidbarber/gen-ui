import type { NextApiRequest, NextApiResponse } from "next";
import { Run, RunUpdateParams } from "../../../data/types";
import { openai } from "../../../lib/openai";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<Run | { error: string }>
) {
  try {
    const body: RunUpdateParams = req.body;
    const { threadId, runId } = req.query;
    const response = await openai.beta.threads.runs.update(
      threadId as string,
      runId as string,
      body
    );
    res.status(200).json(response);
  } catch (error) {
    res.status(500).json({ error });
  }
}
