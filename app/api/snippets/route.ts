import { NextResponse } from "next/server";
import { connectDB } from "@/lib/mongodb";
import { Snippet } from "@/models/snippets";

export async function POST(req: Request) {
  try {
    await connectDB();

    const body = await req.json();

    const snippet = await Snippet.create({
      snippet_name: body.snippet_name,
      snippet_lang: body.snippet_lang,
      snippet_tags: body.snippet_tags,
      snippet_code: body.snippet_code,
      snippet_desc: body.snippet_desc,
      snippet_visibility: body.snippet_visibility,
    });

    return NextResponse.json(snippet, { status: 201 });
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to create snippet" },
      { status: 500 }
    );
  }
}