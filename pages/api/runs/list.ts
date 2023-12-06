import type { NextApiRequest, NextApiResponse } from "next";
import { RunsPage, RunListParams } from "../../../data/types";
import { openai } from "../../../lib/openai";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<RunsPage | { error: string }>
) {
  try {
    const { threadId, query } = req.query;
    const response = await openai.beta.threads.runs.list(
      threadId as string,
      query as RunListParams
    );
    res.status(200).json(response);
  } catch (error) {
    res.status(500).json({ error });
  }
}
