// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from "next";
import { ChatOpenAI } from "langchain/chat_models/openai";
import { HumanChatMessage, SystemChatMessage } from "langchain/schema";
import {components} from "../../data/components.js";
import { getCreateSystemMessage, getWriteCodeSystemMessage } from "../prompts/create.js";

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
  } = req.body;

  const chat = new ChatOpenAI({
    temperature,
    openAIApiKey,
    modelName,
    maxTokens,
  });

  /**
   * 1. Create a plan using user's prompt.
   *  - Create a plan, you may only use these components.
   *  - Just output the plan
   * 
   * 2. Using plan, write code to build the application
   *  - Include documentation for each UI component
   * 
   * Return plan, follwed by code
   */

  try {
    // Make plan
    const {text: plan} = await chat.call([
      new SystemChatMessage(getCreateSystemMessage()),
      new HumanChatMessage(prompt)
    ]);
    
    // Get components used in plan
    let allComponents = new Set(components);
    let usedComponents = plan.split(" ").filter((word) => {
      word = word.replace(/\W/g, '');
      return allComponents.has(word);
    });

    let planWithExamples = getWriteCodeSystemMessage(plan);
    // Get prop types and an example for each component
    usedComponents.forEach(async (component) => {
      planWithExamples += `\n\n## ${component}\n\n`;
      planWithExamples += `### Props\n\n`;
      // TODO: Get prop types for each and append to plan
      planWithExamples += `${getPropTypes(component)}\n\n`;
      planWithExamples += `### Example\n\n`;
      planWithExamples += `${await getExample(component)}\n\n`;
    });

    // Generate code based on plan
    const {text: code} = await chat.call([new SystemChatMessage(planWithExamples), new HumanChatMessage(planWithExamples)]);

    res.status(200).send({ response: `${plan}\n\n${code}`});
  } catch (error) {
    res.status(500).json({ error });
  }
}
