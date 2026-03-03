import { NextResponse } from "next/server";
import { supabase } from "@/lib/supabase";

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);

  const category = searchParams.get("category");
  const featured = searchParams.get("featured");
  const search = searchParams.get("search");

  let query = supabase.from("product").select("*");

  if (category) {
    query = query.eq("category", category);
  }

  if (featured === "true") {
    query = query.eq("isFeatured", true);
  }

  if (search) {
    query = query.ilike("name", `%${search}%`);
  }

  query = query.order("display_order", {
    ascending: true,
    nullsFirst: false,
  });

  const { data, error } = await query;

  if (error) {
    console.error(error);
    return NextResponse.json(
      { error: "Failed to fetch products" },
      { status: 500 }
    );
  }

  return NextResponse.json(data);
}
