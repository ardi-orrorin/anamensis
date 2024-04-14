import {NextRequest, NextResponse} from "next/server";
import {cookies} from "next/headers";

export async function GET(req: NextRequest, res: NextResponse) {
    req.nextUrl.pathname = '/';

    const url = req.nextUrl;
    url.pathname = '/';

    const next = new NextResponse(null, {
        status: 302,
        url: url.toString()
    });


    next.cookies.set('accessToken', '', {
        maxAge: 0
    });

    next.cookies.set('refreshToken', '', {
        maxAge: 0
    });

    return next;
}