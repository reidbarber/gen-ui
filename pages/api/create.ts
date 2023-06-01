// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from "next";
import { ChatOpenAI } from "langchain/chat_models/openai";
import { HumanChatMessage, SystemChatMessage } from "langchain/schema";
import { components } from "../../data/components.js";
import {
  getCreateSystemMessage,
  getSummaryPrompt,
  getWriteCodeSystemMessage,
} from "../prompts/create";
import { getPropTypes } from "../../services/docs-loader/getPropTypes";

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
    console.log("------------- 1. System Message");
    console.log(getCreateSystemMessage());
    console.log("------------- 2. User input");
    console.log(prompt);
    const { text: plan } = await chat.call([
      new SystemChatMessage(getCreateSystemMessage()),
      new HumanChatMessage(prompt),
    ]);
    console.log("------------- 3. Plan");
    console.log(plan);

    const { text: summary } = await chat.call([
      new HumanChatMessage(getSummaryPrompt(plan)),
    ]);

    // Get components used in plan
    let allComponents = new Set(components);
    let usedComponents = plan
      .split(" ")
      .filter((word) => {
        word = word.replace(/\W/g, "");
        return allComponents.has(word);
      })
      .map((word) => {
        return word.replace(/\W/g, "");
      });
    console.log("------------- 4. Used Components");
    console.log(usedComponents);

    let planWithExamples = getWriteCodeSystemMessage(plan);
    planWithExamples += `## Components Used\n\n`;
    // Get prop types and an example for each component
    usedComponents.forEach(async (component) => {
      planWithExamples += `\n\n## ${component}\n\n`;
      planWithExamples += `### Props\n\n`;
      // TODO: Get prop types for each and append to plan
      planWithExamples += `${getPropTypes(component)}\n\n`;
      planWithExamples += `### Example\n\n`;
      planWithExamples += `${await getExample(component)}\n\n`;
    });

    console.log("------------- 5. Plan with Examples");
    console.log(planWithExamples);

    // Generate code based on plan
    const { text: code } = await chat.call([
      new SystemChatMessage(planWithExamples),
      new HumanChatMessage(planWithExamples),
    ]);

    console.log("------------- 6. Code");
    console.log(code);

    res.status(200).send({
      response: `# Summary\n\n${summary}\n\n# Plan\n\n${plan}\n\n# Code${code}`,
    });
  } catch (error) {
    res.status(500).json({ error });
  }
}
