import type { NextApiRequest, NextApiResponse } from "next";
import { openai } from "../../../../lib/openai";
import {
  AssistantDeleted,
  AssistantUpdateParams,
} from "openai/resources/beta/assistants/assistants";
import { Assistant } from "../../../../data/types";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<Assistant | AssistantDeleted | { error: string }>
) {
  try {
    if (req.method === "POST") {
      const { assistant_id } = req.query;

      const body = req.body;
      const response = await openai.beta.assistants.update(
        assistant_id as string,
        JSON.parse(body) as AssistantUpdateParams
      );
      res.status(200).json(response);
    } else if (req.method === "DELETE") {
      const { assistant_id } = req.query;

      const response = await openai.beta.assistants.del(assistant_id as string);
      res.status(200).json(response);
    } else {
      res.status(405).json({ error: "Method not allowed" });
    }
  } catch (error) {
    res.status(500).json({ error });
  }
}
