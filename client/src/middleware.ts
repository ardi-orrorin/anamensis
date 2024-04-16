import {NextRequest, NextResponse} from "next/server";
import {cookies} from "next/headers";
import {RequestCookie} from "next/dist/compiled/@edge-runtime/cookies";

export async function middleware(req: NextRequest) {
    const accessToken = cookies().get('accessToken');

    const url = req.nextUrl.clone();

    const refreshToken = cookies().get('refreshToken');


    if(!accessToken && refreshToken) {
        const result = await generateRefreshToken(refreshToken);
        const ssl = process.env.NEXT_PUBLIC_SSL === 'TRUE';

        const next = NextResponse.next();
        next.headers.set('Set-Cookie', result + '; Secure; SameSite=Strict; path=/; HttpOnly');
        return next;
    }

    if (!accessToken) {
        url.pathname = '/';
        url.search = '';
        return NextResponse.redirect(url)
    }

    return NextResponse.next();
}

const generateRefreshToken = async (refreshToken: RequestCookie): Promise<string> => {
    const refresh = await fetch(process.env.NEXT_PUBLIC_SERVER + '/user/refresh', {
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${refreshToken.value}`
        }
    });

    const accessToken = refresh.headers.getSetCookie().find((cookie: string) => {
        const [key, value] = cookie.split(';')[0].split('=');
        if(key === 'accessToken') {
            return cookie;
        }
    });

    // @ts-ignore
    return accessToken;
}

export const config = {
    matcher: [
        '/public/:path*',
        '/logout/:path*',
        '/user/:path*',
    ]
}