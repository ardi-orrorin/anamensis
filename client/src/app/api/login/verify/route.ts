import {NextRequest, NextResponse} from "next/server";
import axios from "axios";
import loginConstants from "@/app/login/{services}/constants";
import {User} from "@/app/login/{services}/types";

export async function POST(req: NextRequest){

    const reqBody = await req.json();
    const user = reqBody?.provider
        ? await reqBody as User.OAuth2
        : await reqBody as User.Login;

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
        const res = await axios.post(url, user, {
            headers,
            withCredentials: true
        })
        const next = new NextResponse(JSON.stringify(res.data), {
            status: 200,
            headers: {
                'Content-Type': 'application/json',
            },
        });

        next.cookies.set('next.access.token', res.data.accessToken, {
            ...loginConstants.cookieInit,
            maxAge: res.data.accessTokenExpiresIn
        });

        next.cookies.set('next.refresh.token', res.data.refreshToken, {
            ...loginConstants.cookieInit,
            maxAge: res.data.refreshTokenExpiresIn
        });

        return next;

    } catch (err: any) {
        const errResponse: User.ErrorResponse = {
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