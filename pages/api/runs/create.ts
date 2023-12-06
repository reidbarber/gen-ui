import type { NextApiRequest, NextApiResponse } from "next";
import { Run } from "../../../data/types";
import { openai } from "../../../lib/openai";
import { RunCreateParams } from "openai/resources/beta/threads/runs/runs";

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
