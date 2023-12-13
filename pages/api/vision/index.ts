import type { NextApiRequest, NextApiResponse } from "next";
import { openai } from "../../../lib/openai";
import {
  ChatCompletion,
  ChatCompletionContentPartImage,
} from "openai/resources";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<ChatCompletion | { error: string }>
) {
  try {
    if (req.method === "POST") {
      let images: string[] = req.body.images;
      let hasMultiple = images.length > 1;
      const response = await openai.chat.completions.create({
        model: "gpt-4-vision-preview",
        max_tokens: 1024 * images.length,
        messages: [
          {
            role: "user",
            content: [
              {
                type: "text",
                text: `I need you to provide a detailed description of ${
                  hasMultiple ? "these UI designs" : "this UI design"
                } so that I can write code to implement it. It uses components from Adobe's Spectrum design system, so use those to describe it where applicable.`,
              },
              ...images.map(
                (image) =>
                  ({
                    type: "image_url",
                    image_url: {
                      url: image,
                    },
                  } as ChatCompletionContentPartImage)
              ),
            ],
          },
        ],
      });
      res.status(200).json(response);
    } else {
      res.status(405).json({ error: "Method not allowed" });
    }
  } catch (error) {
    res.status(500).json({ error });
  }
}
