import { getToken } from "next-auth/jwt";
import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
export { default } from "next-auth/middleware";

export async function middleware(request: NextRequest) {
    const token = await getToken({ req: request });
    const url = request.nextUrl.pathname;

    if (
        token &&
        (url.startsWith("/login") ||
            url.startsWith("/signup") ||
            url.startsWith("/verify"))||
            url.startsWith("/")
    ) {
        return NextResponse.redirect(new URL("/dashboard", request.url));
    }
    
}

export const config = {
    matcher: ["/login", "/signup", "/", "/verify", "/dashboard/:path*"],
};
