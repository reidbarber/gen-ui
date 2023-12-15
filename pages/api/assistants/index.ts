import type { NextApiRequest, NextApiResponse } from "next";
import { openai } from "../../../lib/openai";
import {
  AssistantCreateParams,
  AssistantsPage,
} from "openai/resources/beta/assistants/assistants";
import { Assistant } from "../../../data/types";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<AssistantsPage | Assistant | { error: string }>
) {
  try {
    if (req.method === "GET") {
      const response = await openai.beta.assistants.list(); // TODO support query
      res.status(200).json(response);
    } else if (req.method === "POST") {
      const body = JSON.parse(req.body) as AssistantCreateParams;
      const response = await openai.beta.assistants.create(body);
      res.status(200).json(response);
    } else {
      res.status(405).json({ error: "Method not allowed" });
    }
  } catch (error) {
    res.status(500).json({ error });
  }
}
