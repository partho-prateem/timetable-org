import { RequestHandler } from "express";
import { z } from "zod";
import { generateObject } from "ai";
import { createOpenAI } from "@ai-sdk/openai";

const bodySchema = z.object({
  items: z.array(
    z.object({
      id: z.string(),
      title: z.string(),
      day: z.string(),
      hour: z.number(),
    }),
  ),
});

export const aiSuggest: RequestHandler = async (req, res) => {
  if (!process.env.OPENAI_API_KEY) {
    res.status(501).send("OPENAI_API_KEY not configured");
    return;
  }
  const parse = bodySchema.safeParse(req.body);
  if (!parse.success) {
    res.status(400).json({ error: parse.error.flatten() });
    return;
  }
  try {
    const openai = createOpenAI({ apiKey: process.env.OPENAI_API_KEY! });
    const { object } = await generateObject({
      model: openai("gpt-4o-mini"),
      system:
        "You are a timetable assistant. Given a list of sessions with day and hour, propose non-conflicting improvements by adjusting day/hour. Keep the same ids. Only change positions when it reduces conflicts (same hour and day).",
      prompt: JSON.stringify(parse.data.items),
      schema: z.object({
        updates: z.array(
          z.object({
            id: z.string(),
            day: z.enum(["Mon", "Tue", "Wed", "Thu", "Fri"]),
            hour: z.number(),
          }),
        ),
        rationale: z.string(),
      }),
    });
    res.json(object);
  } catch (e: any) {
    res.status(500).json({ error: e.message ?? "AI error" });
  }
};
