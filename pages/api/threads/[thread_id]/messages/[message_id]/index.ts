import type { NextApiRequest, NextApiResponse } from "next";
import {
  MessageCreateParams,
  ThreadMessage,
} from "../../../../../../data/types";
import { openai } from "../../../../../../lib/openai";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<ThreadMessage | { error: string }>
) {
  try {
    const { thread_id, message_id } = req.query;

    if (req.method === "GET") {
      const response = await openai.beta.threads.messages.retrieve(
        thread_id as string,
        message_id as string
      );
      res.status(200).json(response);
    } else if (req.method === "POST") {
      const body: MessageCreateParams = req.body;
      const response = await openai.beta.threads.messages.update(
        thread_id as string,
        message_id as string,
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
