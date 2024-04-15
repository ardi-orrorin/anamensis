import {NextRequest, NextResponse} from "next/server";

export async function GET(req: NextRequest, res: NextResponse) {
    const next = new NextResponse(null, {
        status: 302,
    });

    next.cookies.set('accessToken', '', {
        maxAge: 0
    });

    next.cookies.set('refreshToken', '', {
        maxAge: 0
    });

    return next;
}