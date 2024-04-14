import {NextRequest, NextResponse} from "next/server";
import {cookies} from "next/headers";

export async function middleware(req: NextRequest) {
    const isLogged = cookies().get('accessToken') !== undefined && cookies().get('refreshToken') !== undefined;
    const url = req.nextUrl.clone();

    if (!isLogged) {
        url.pathname = '/';
        return NextResponse.redirect(url)
    }

    return NextResponse.next();
}


export const config = {
    matcher: [
        '/public/:path*',
        '/logout/:path*',
    ]
}