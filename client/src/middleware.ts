import {NextRequest, NextResponse} from "next/server";
import axios from "axios";

export async function middleware(req: NextRequest) {
    if(req.nextUrl.pathname === '/public') {
        const url = req.nextUrl.clone();
        url.pathname = '/login';
        return NextResponse.redirect(url);
    }

    if(req.nextUrl.pathname === '/logout') {
        const url = req.nextUrl.clone();
        url.pathname = '/';
        return NextResponse.redirect(url)
    }
}


const config = {
    matcher: [
        '/public/*',
        '/logout/*',
    ]
}