import type { NextApiRequest, NextApiResponse } from "next";
import OpenAI from "openai";
import { Run, ThreadCreateAndRunParams } from "../../../data/types";

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<Run | { error: string }>
) {
  try {
    const body: ThreadCreateAndRunParams = req.body;
    const response = await openai.beta.threads.createAndRun(body);
    res.status(200).json(response);
  } catch (error) {
    res.status(500).json({ error: "Error creating thread" });
  }
}
