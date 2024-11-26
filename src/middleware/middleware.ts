import { NextResponse } from "next/server";

export function middleware(request: Request) {
    const token = request.headers.get('Authorization');
    if (!token) return NextResponse.redirect(new URL('/login', request.url));
    return NextResponse.next();
  }