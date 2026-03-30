import type { NextApiRequest, NextApiResponse } from "next";
import { GoogleGenAI } from "@google/genai";

type SuccessResponse = {
  review_title: string;
  review_description: string;
};

type ErrorResponse = {
  message: string;
  raw?: string;
};

const MODEL = "gemini-2.5-flash-lite";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<SuccessResponse | ErrorResponse>,
) {
  if (req.method !== "POST") {
    return res.status(405).json({ message: "Method not allowed" });
  }

  try {
    const { title, description, rating } = req.body;

    if (!title || !description) {
      return res.status(400).json({
        message: "Title or description is missing",
      });
    }

    if (!rating || rating < 1 || rating > 5) {
      return res.status(400).json({
        message: "Rating must be between 1 and 5",
      });
    }
    const prompt = `
      You are a real customer writing a product review after using the product.

      Product: ${title}
      Details: ${description}
      Rating: ${rating}/5

      Write like a human:
      - Natural, conversational tone
      - Include a small personal experience or feeling
      - Avoid generic phrases like "good product" or "worth buying"
      - Keep it concise and realistic

      Tone guide:
      - 5 → very happy, enthusiastic
      - 4 → positive with a small drawback
      - 3 → mixed experience
      - 2 → mostly disappointed
      - 1 → unhappy

      Constraints:
      - Title: max 3 words
      - Description: max 8-15 words
      - No markdown or backticks

      Return ONLY valid JSON:
      {"review_title":"...","review_description":"..."}
    `;
    const ai = new GoogleGenAI({
      apiKey: process.env.GEMINI_API_KEY!,
    });

    const timeout = new Promise((_, reject) =>
      setTimeout(() => reject(new Error("AI timeout")), 5000),
    );

    const ai_cal = ai.models.generateContent({
      model: MODEL,
      contents: prompt,
    });

    const response: any = await Promise.race([ai_cal, timeout]);

    let text: string = response.text;

    text = text
      ?.replace(/```json\s*/i, "")
      .replace(/```/g, "")
      .trim();

    let parsed;

    try {
      parsed = JSON.parse(text);
    } catch {
      // 🔁 Retry once if parsing fails
      const retry_response = await ai.models.generateContent({
        model: MODEL,
        contents: prompt,
      });

      let retry_text = retry_response.text
        ?.replace(/```json\s*/i, "")
        .replace(/```/g, "")
        .trim();

      try {
        parsed = JSON.parse(retry_text as string);
      } catch {
        return res.status(500).json({
          message: "Invalid AI JSON response",
          raw: retry_text,
        });
      }
    }

    if (
      !parsed ||
      typeof parsed.review_title !== "string" ||
      typeof parsed.review_description !== "string"
    ) {
      return res.status(500).json({
        message: "Invalid AI structure",
        raw: text,
      });
    }

    return res.status(200).json({
      review_title: parsed.review_title,
      review_description: parsed.review_description,
    });
  } catch (error: any) {
    console.error("AI error:", error);

    return res.status(500).json({
      message: error?.message || "Something went wrong",
    });
  }
}
