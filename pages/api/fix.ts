// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from "next";
import { ChatOpenAI } from "langchain/chat_models/openai";
import { SystemChatMessage } from "langchain/schema";

type Data = {
  response?: string;
  error?: string;
};

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<Data>
) {
  const openAIApiKey = process.env.OPENAI_KEY;
  let {
    prompt,
    model: modelName,
    temperature,
    max_tokens: maxTokens,
    code,
  } = req.body;
  // Fix a bug in the existing app.
  // Use error cocdes, and the optional text prompt to fix the bug.
  // Return a patch file to apply to the existing app.

  const chat = new ChatOpenAI({
    temperature,
    openAIApiKey,
    modelName,
    maxTokens,
  });
  try {
    const response = await chat.call([new SystemChatMessage(prompt)]);
    res.status(200).send({ response: response.text });
  } catch (error) {
    res.status(500).json({ error });
  }
}
