import type { NextApiRequest, NextApiResponse } from "next";
import { Run, RunSubmitToolOutputsParams } from "../../../../../../data/types";
import { openai } from "../../../../../../lib/openai";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<Run | { error: string }>
) {
  try {
    if (req.method === "POST") {
      const body: RunSubmitToolOutputsParams = req.body;
      const { thread_id, run_id } = req.query;
      const response = await openai.beta.threads.runs.cancel(
        thread_id as string,
        run_id as string
      );
      res.status(200).json(response);
    } else {
      res.status(405).json({ error: "Method not allowed" });
    }
  } catch (error) {
    res.status(500).json({ error });
  }
}
