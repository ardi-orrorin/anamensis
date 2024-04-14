import {NextRequest, NextResponse} from "next/server";
import axios from "axios";
import {cookies} from "next/headers";

export async function middleware(req: NextRequest) {
    const isLogged = cookies().get('accessToken') !== undefined && cookies().get('refreshToken') !== undefined;
    const url = req.nextUrl.clone();
    if(req.nextUrl.pathname === '/public') {
        url.pathname = '/login';
        return NextResponse.redirect(url);
    }

    if(req.nextUrl.pathname === '/logout') {
        if(isLogged) return ;
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