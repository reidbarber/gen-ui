import type { NextApiRequest, NextApiResponse } from "next";
import OpenAI from "openai";

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<OpenAI.Beta.Thread | { error: string }>
) {
  try {
    const body: OpenAI.Beta.ThreadCreateParams = req.body;
    const response = await openai.beta.threads.create(body);
    res.status(200).json(response);
  } catch (error) {
    res.status(500).json({ error: "Error creating thread" });
  }
}