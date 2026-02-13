// apps/adminwebapp/app/api/auto-tag/route.ts
export const runtime = "nodejs";
export const dynamic = "force-dynamic";

import OpenAI from "openai";
import { NextResponse } from "next/server";

const TAG_OPTIONS = ["Blue", "Red", "Green", "Cat", "Dog", "Bird"] as const;

export async function POST(req: Request) {
  try {
    if (!process.env.OPENAI_API_KEY) {
      return NextResponse.json(
        { error: "Missing OPENAI_API_KEY (set it in apps/adminwebapp/.env.local)" },
        { status: 500 }
      );
    }

    const client = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

    const { title, description, url, resourceType } = await req.json();

    // Need a specific crafted prompt
    const prompt = `
    Return JSON only with this shape:
    {"tags": string[], "evidence": string[]}

    Rules:
    - Tags must be chosen ONLY from: ${TAG_OPTIONS.join(", ")}
    - Pick 0-3 tags.
    - Evidence should be short bullet-like reasons.

    Resource:
    Title: ${title ?? ""}
    Description: ${description ?? ""}
    URL: ${url ?? ""}
    Type: ${resourceType ?? ""}
    `;

    const resp = await client.responses.create({
      model: "gpt-4.1-mini",
      input: prompt,
    });

    // resp.output_text should be a JSON string per the prompt
    const text = resp.output_text.trim();
    const data = JSON.parse(text);

    // hard-enforce allowed tags in case the model misbehaves
    const allowed = new Set(TAG_OPTIONS);
    data.tags = Array.isArray(data.tags) ? data.tags.filter((t: any) => allowed.has(t)) : [];
    data.evidence = Array.isArray(data.evidence) ? data.evidence : [];

    return NextResponse.json(data);
  } catch (err: any) {
    console.error("AUTO-TAG ERROR:", err);
    return NextResponse.json(
      {
        error: "Auto-tag failed",
        message: err?.message ?? String(err),
        name: err?.name,
        stack: err?.stack,
      },
      { status: 500 }
    );
  }
}
