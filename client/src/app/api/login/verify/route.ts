import {NextRequest, NextResponse} from "next/server";
import axios from "axios";
import {LoginI, OAuth2I} from "@/app/login/{services}/LoginProvider";
import {ResponseCookie} from "next/dist/compiled/@edge-runtime/cookies";
import {ErrorResponse} from "@/app/login/page";

export async function POST(req: NextRequest){

    const reqBody = await req.json();
    const user = reqBody?.provider
        ? await reqBody as OAuth2I
        : await reqBody as LoginI;

    const url = process.env.NEXT_PUBLIC_SERVER + (
        reqBody?.provider
            ? '/public/api/user/oauth2'
            : '/public/api/user/verify'
    )

    const clientIp = req.ip || req.headers.get('x-real-ip') || req.headers.get('x-forwarded-for');

    const ipRegExp = /(\d{1,3}\.\d{1,3}\.\d{1,3}\.\d{1,3})/;
    const ipMatch = ipRegExp.exec(clientIp || '');

    const headers = {
        'Content-Type': 'application/json',
        'User-Agent': req.headers.get('User-Agent') || '',
        'Ip': ipMatch?.[0] || '',
        'Location': `Test`
    }

    try {
        const resData = await axios.post(url, user, {
            headers,
            withCredentials: true
        })
        const next = new NextResponse(JSON.stringify(resData.data), {
            status: 200,
            headers: {
                'Content-Type': 'application/json',
            },
        });

        const cookieInit: Partial<ResponseCookie> = {
            httpOnly: true,
            secure: false,
            sameSite: 'lax',
            path: '/'
        }

        next.cookies.set('next.access.token', resData.data.accessToken, {
            ...cookieInit,
            maxAge: resData.data.accessTokenExpiresIn / 1000
        });

        next.cookies.set('next.refresh.token', resData.data.refreshToken, {
            ...cookieInit,
            maxAge: resData.data.refreshTokenExpiresIn / 1000
        });

        return next;

    } catch (err: any) {
        const errResponse: ErrorResponse = {
            status: err.response.status,
            message: err.response.data.message,
            use: true
        }

        return new NextResponse(JSON.stringify(errResponse), {
            status: err.response.status,
            headers: {
                'Content-Type': 'application/json',
            }
        });
    }
}