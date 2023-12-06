import type { NextApiRequest, NextApiResponse } from "next";
import { RunStep } from "../../../../../../../data/types";
import { openai } from "../../../../../../../lib/openai";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<RunStep | { error: string }>
) {
  try {
    if (req.method === "GET") {
      const { thread_id, run_id, step_id } = req.query;
      const response = await openai.beta.threads.runs.steps.retrieve(
        thread_id as string,
        run_id as string,
        step_id as string
      );
      res.status(200).json(response);
    } else {
      res.status(405).json({ error: "Method not allowed" });
    }
  } catch (error) {
    res.status(500).json({ error });
  }
}
