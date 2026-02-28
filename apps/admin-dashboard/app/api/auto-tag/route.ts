export const runtime = "nodejs";
export const dynamic = "force-dynamic";

import OpenAI from "openai";
import { NextResponse } from "next/server";

const client = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

const TAG_OPTIONS = ["Blue", "Red", "Green", "Cat", "Dog", "Bird"] as const;


/*
|--------------------------------------------------------------------------
| Helpers
|--------------------------------------------------------------------------
*/

function stripJsonFences(s: string) {
  const trimmed = (s ?? "").trim();
  if (trimmed.startsWith("```")) {
    return trimmed
      .replace(/^```[a-zA-Z]*\n?/, "")
      .replace(/```$/, "")
      .trim();
  }
  return trimmed;
}

function isImageUrl(url: string): boolean {
  return (
    /\.(jpg|jpeg|png|gif|webp|bmp)$/i.test(url) ||
    url.includes("gstatic.com/images") ||
    url.includes("imgur.com") ||
    url.includes("cloudfront.net")
  );
}

async function extractUrlText(url: string): Promise<string> {
  try {
    console.log("Fetching URL content...");

    const res = await fetch(url, {
      headers: {
        "User-Agent": "Mozilla/5.0",
      },
    });

    if (!res.ok) {
      console.log("Failed to fetch URL:", res.status);
      return "";
    }

    const html = await res.text();

    const cleaned = html
      .replace(/<script[\s\S]*?>[\s\S]*?<\/script>/gi, "")
      .replace(/<style[\s\S]*?>[\s\S]*?<\/style>/gi, "")
      .replace(/<[^>]+>/g, " ")
      .replace(/\s+/g, " ")
      .trim();

    console.log("Extracted text length:", cleaned.length);

    return cleaned.slice(0, 8000);
  } catch (err) {
    console.log("Error extracting URL text:", err);
    return "";
  }
}


/*
|--------------------------------------------------------------------------
| Main POST handler
|--------------------------------------------------------------------------
*/

export async function POST(req: Request) {
  try {
    if (!process.env.OPENAI_API_KEY) {
      return NextResponse.json(
        { error: "Missing OPENAI_API_KEY" },
        { status: 500 }
      );
    }

    const { title, description, url, resourceType } = await req.json();

    console.log("AUTO TAG REQUEST:");
    console.log({ title, description, url, resourceType });

    let resp;

    /*
    |--------------------------------------------------------------------------
    | IMAGE URL → use vision
    |--------------------------------------------------------------------------
    */
    if (url && isImageUrl(url)) {
      console.log("Detected IMAGE URL — using vision");

      resp = await client.responses.create({
        model: "gpt-4.1-mini",
        input: [
          {
            role: "user",
            content: [
              {
                type: "input_text",
                text: `
              Return JSON only:
              {"tags": string[], "evidence": string[]}

              Allowed tags: ${TAG_OPTIONS.join(", ")}

              Analyze this image and tag appropriately.
              `,
              },
              {
                type: "input_image",
                image_url: url,
              },
            ],
          },
        ],
        text: {
          format: {
            type: "json_object",
          },
        },
      });

    } else {

      /*
      |--------------------------------------------------------------------------
      | WEBPAGE / TEXT → extract content first
      |--------------------------------------------------------------------------
      */

      console.log("Detected WEBPAGE/TEXT URL");

      let urlText = "";

      if (url) {
        urlText = await extractUrlText(url);
      }

      const prompt = `
      Return JSON only:
      {"tags": string[], "evidence": string[]}

      Rules:
      - Tags must be chosen ONLY from: ${TAG_OPTIONS.join(", ")}
      - Use resource content primarily
      - Use metadata secondarily

      Resource Metadata:
      Title: ${title ?? ""}
      Description: ${description ?? ""}
      URL: ${url ?? ""}
      Type: ${resourceType ?? ""}

      Resource Content:
      ${urlText}
      `;

      resp = await client.responses.create({
        model: "gpt-4.1-mini",
        input: prompt,
        text: {
          format: {
            type: "json_object",
          },
        },
      });
    }

    /*
    |--------------------------------------------------------------------------
    | Parse result safely
    |--------------------------------------------------------------------------
    */

    console.log("OPENAI RAW OUTPUT:");
    console.log(resp.output_text);

    const raw = stripJsonFences(resp.output_text);

    const data = JSON.parse(raw);

    const allowed = new Set(TAG_OPTIONS);

    const tags = Array.isArray(data.tags)
      ? data.tags.filter((t: any) => allowed.has(t))
      : [];

    const evidence = Array.isArray(data.evidence)
      ? data.evidence
      : [];

    console.log("FINAL TAG RESULT:");
    console.log({ tags, evidence });

    return NextResponse.json({
      tags,
      evidence,
    });

  } catch (err: any) {

    console.error("AUTO TAG ERROR:", err);

    return NextResponse.json(
      {
        error: "Auto-tag failed",
        message: err?.message ?? String(err),
      },
      { status: 500 }
    );
  }
}
