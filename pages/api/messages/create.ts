import type { NextApiRequest, NextApiResponse } from "next";
import OpenAI from "openai";
import { ThreadMessage } from "../../../data/types";
import { MessageCreateParams } from "openai/resources/beta/threads/messages/messages";

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<ThreadMessage | { error: string }>
) {
  try {
    const { threadId } = req.query;
    const message: MessageCreateParams = req.body;
    const response = await openai.beta.threads.messages.create(
      threadId as string,
      message
    );
    res.status(200).json(response);
  } catch (error) {
    res.status(500).json({ error: "Error retrieving thread" });
  }
}
