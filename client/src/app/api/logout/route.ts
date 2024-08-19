import {NextResponse} from "next/server";

export async function GET() {
    const next = new NextResponse( null, {
        status: 302,
    });

    next.cookies.delete('next.access.token');
    next.cookies.delete('next.refresh.token');
    next.cookies.delete('next-auth.session-token');
    next.cookies.delete('next-auth.csrf-token');
    next.cookies.delete('next-auth.pkce.code_verifier');
    next.cookies.delete('next-auth.callback-url');
    next.cookies.delete('next-auth.state');
    next.cookies.delete('_ga_undefined');
    next.cookies.delete('_ga');


    return next;
}