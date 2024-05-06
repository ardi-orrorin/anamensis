import {NextResponse} from "next/server";

export async function GET() {
    const next = new NextResponse( null, {
        status: 302,
    });

    next.cookies.set('next.access.token', '', {
        maxAge: 0
    });

    next.cookies.set('next.refresh.token', '', {
        maxAge: 0
    });

    return next;
}