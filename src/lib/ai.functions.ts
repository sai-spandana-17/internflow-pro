import { createServerFn } from "@tanstack/react-start";
import { generateText } from "ai";
import { createOpenAICompatible } from "@ai-sdk/openai-compatible";

export const generateEssay = createServerFn({ method: "POST" })
  .inputValidator((d: { role: string; company: string; skills?: string[]; kind: "essay" | "cover" }) => d)
  .handler(async ({ data }) => {
    const key = process.env.LOVABLE_API_KEY;
    if (!key) throw new Error("Missing LOVABLE_API_KEY");
    const gateway = createOpenAICompatible({
      name: "lovable",
      baseURL: "https://ai.gateway.lovable.dev/v1",
      headers: { "Lovable-API-Key": key },
    });
    const model = gateway("google/gemini-3-flash-preview");

    const skills = (data.skills ?? []).slice(0, 8).join(", ");
    const prompt = data.kind === "cover"
      ? `Write a concise, sincere cover letter (≤220 words) for an internship as ${data.role} at ${data.company}. Skills: ${skills}. Use first person, no clichés, no em-dashes, plain text only.`
      : `Write a "Why I want to join ${data.company}" essay for a ${data.role} intern role. 120–180 words, first person, specific, sincere. Skills context: ${skills}. No clichés, no em-dashes, plain text only.`;
    const { text } = await generateText({ model, prompt });
    return { text };
  });
