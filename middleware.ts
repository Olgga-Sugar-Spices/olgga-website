import { NextRequest, NextResponse } from "next/server";

export function middleware(req: NextRequest) {

  const host = req.headers.get("host") || "";

  const pathname = req.nextUrl.pathname;

  // ADMIN SUBDOMAIN
  if (host.startsWith("admin.")) {

    if (pathname === "/") {

      return NextResponse.rewrite(
        new URL("/admin/orders", req.url)
      );
    }
  }

  return NextResponse.next();
}