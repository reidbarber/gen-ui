import type { NextApiRequest, NextApiResponse } from "next";
import {
  Run,
  RunCreateParams,
  RunListParams,
  RunsPage,
} from "../../../../../data/types";
import { openai } from "../../../../../lib/openai";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<Run | RunsPage | { error: string }>
) {
  try {
    if (req.method === "GET") {
      const { thread_id, ...query } = req.query;
      const response = await openai.beta.threads.runs.list(
        thread_id as string,
        query as RunListParams
      );
      res.status(200).json(response);
    }
    if (req.method === "POST") {
      const body: RunCreateParams = JSON.parse(req.body);
      const { thread_id } = req.query;
      const response = await openai.beta.threads.runs.create(
        thread_id as string,
        body
      );
      res.status(200).json(response);
    } else {
      res.status(405).json({ error: "Method not allowed" });
    }
  } catch (error) {
    res.status(500).json({ error });
  }
}
