import NextAuth, {AuthOptions} from "next-auth";
import Google from "next-auth/providers/google";
import {OAuth2I} from "@/app/login/{services}/LoginProvider";
import {ResponseCookie} from "next/dist/compiled/@edge-runtime/cookies";
import axios from "axios";
import {cookies} from "next/headers";
import {NextRequest} from "next/server";
import Github from "next-auth/providers/github";
import loginConstants from "@/app/login/{services}/constants";
import Kakao from "next-auth/providers/kakao";
import Naver from "next-auth/providers/naver";

interface RouteHandlerContext {
    params: { nextauth: string[] }
}

async function handler(req: NextRequest, context: RouteHandlerContext) {

    const providers = [];

    process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID
    && process.env.NEXT_PUBLIC_GOOGLE_CLIENT_SECRET
    && providers.push(Google({
        clientId: process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID,
        clientSecret: process.env.NEXT_PUBLIC_GOOGLE_CLIENT_SECRET,
    }));

    process.env.NEXT_PUBLIC_GITHUB_CLIENT_ID
    && process.env.NEXT_PUBLIC_GITHUB_CLIENT_SECRET
    && providers.push(Github({
        clientId: process.env.NEXT_PUBLIC_GITHUB_CLIENT_ID,
        clientSecret: process.env.NEXT_PUBLIC_GITHUB_CLIENT_SECRET,
    }));

    process.env.NEXT_PUBLIC_NAVER_CLIENT_ID
    && process.env.NEXT_PUBLIC_NAVER_CLIENT_SECRET
    && providers.push(Naver({
        clientId: process.env.NEXT_PUBLIC_NAVER_CLIENT_ID,
        clientSecret: process.env.NEXT_PUBLIC_NAVER_CLIENT_SECRET,
    }));

    process.env.NEXT_PUBLIC_KAKAO_CLIENT_ID
    && process.env.NEXT_PUBLIC_KAKAO_CLIENT_SECRET
    && providers.push(Kakao({
        clientId: process.env.NEXT_PUBLIC_KAKAO_CLIENT_ID,
        clientSecret: process.env.NEXT_PUBLIC_KAKAO_CLIENT_SECRET,
    }));


    const options: AuthOptions = {
        providers,
        callbacks: {
            async signIn({account, credentials, user}) {
                if(!account?.provider) return false;

                const loginUser  = {
                    userId: user.id,
                    email: user.email || '',
                    name: user.name || '',
                    provider: account.provider,
                } as OAuth2I;

                const url = process.env.NEXT_PUBLIC_SERVER + '/public/api/user/oauth'
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
                    const res = await axios.post(url, loginUser, {
                        headers,
                        withCredentials: true
                    })
                    .then(res => res.data)

                    cookies().set('next.access.token', res.accessToken, {
                        ...loginConstants.cookieInit,
                        maxAge: res.accessTokenExpiresIn
                    });

                    cookies().set('next.refresh.token', res.refreshToken, {
                        ...loginConstants.cookieInit,
                        maxAge: res.refreshTokenExpiresIn
                    });

                    return true;
                } catch (err: any) {
                    console.log(err)
                    return false;
                }
            },
            redirect(params ) {
                return '/';
            },
        },
    }

    return await NextAuth(req, context, options)
}

export { handler as GET, handler as POST };

