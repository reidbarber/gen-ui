import type { NextApiRequest, NextApiResponse } from "next";
import {
  FileListParams,
  MessageFilesPage,
} from "../../../../../../../data/types";
import { openai } from "../../../../../../../lib/openai";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<MessageFilesPage | { error: string }>
) {
  try {
    const { thread_id, message_id, ...query } = req.query;

    if (req.method === "GET") {
      const response = await openai.beta.threads.messages.files.list(
        thread_id as string,
        message_id as string,
        query as FileListParams
      );
      res.status(200).json(response);
    } else {
      res.status(405).json({ error: "Method not allowed" });
    }
  } catch (error) {
    res.status(500).json({ error });
  }
}
