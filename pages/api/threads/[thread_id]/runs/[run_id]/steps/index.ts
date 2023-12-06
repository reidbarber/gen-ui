import type { NextApiRequest, NextApiResponse } from "next";
import { RunStepsPage, StepListParams } from "../../../../../../../data/types";
import { openai } from "../../../../../../../lib/openai";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<RunStepsPage | { error: string }>
) {
  try {
    if (req.method === "GET") {
      const { thread_id, run_id } = req.query;
      const response = await openai.beta.threads.runs.steps.list(
        thread_id as string,
        run_id as string,
        req.query as StepListParams
      );
      res.status(200).json(response);
    } else {
      res.status(405).json({ error: "Method not allowed" });
    }
  } catch (error) {
    res.status(500).json({ error });
  }
}
