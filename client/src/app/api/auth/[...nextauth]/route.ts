import NextAuth, {AuthOptions} from "next-auth";
import Google from "next-auth/providers/google";
import axios from "axios";
import {cookies} from "next/headers";
import {NextRequest} from "next/server";
import Github from "next-auth/providers/github";
import loginConstants from "@/app/login/{services}/constants";
import Naver from "next-auth/providers/naver";
import {User} from "@/app/login/{services}/types";
import Kakao from "next-auth/providers/kakao";
import {Custom} from "@/app/api/auth/[...nextauth]/custom";

interface RouteHandlerContext {
    params: { nextauth: string[] }
}

async function handler(req: NextRequest, context: RouteHandlerContext) {

    const providers = [];

    process.env.GOOGLE_CLIENT_ID
    && process.env.GOOGLE_CLIENT_SECRET
    && providers.push(Google({
        clientId: process.env.GOOGLE_CLIENT_ID,
        clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    }));

    process.env.GITHUB_CLIENT_ID
    && process.env.GITHUB_CLIENT_SECRET
    && providers.push(Github({
        clientId: process.env.GITHUB_CLIENT_ID,
        clientSecret: process.env.GITHUB_CLIENT_SECRET,
    }));

    process.env.NAVER_CLIENT_ID
    && process.env.NAVER_CLIENT_SECRET
    && providers.push(Naver({
        clientId: process.env.NAVER_CLIENT_ID,
        clientSecret: process.env.NAVER_CLIENT_SECRET,
    }));

    process.env.KAKAO_CLIENT_ID
    && process.env.KAKAO_CLIENT_SECRET
    && providers.push(Kakao({
        clientId: process.env.KAKAO_CLIENT_ID,
        clientSecret: process.env.KAKAO_CLIENT_SECRET,
    }));

    process.env.CUSTOM_CLIENT_ID
    && process.env.CUSTOM_CLIENT_SECRET
    && process.env.CUSTOM_OAUTH2_SERVER_URL
    && providers.push(Custom({
        clientId: process.env.CUSTOM_CLIENT_ID,
        clientSecret: process.env.CUSTOM_CLIENT_SECRET,
    }));

    const options: AuthOptions = {
        providers,
        callbacks: {
            async signIn({account, credentials, user}) {
                if(!account?.provider) return false;

                const loginUser  = {
                    userId   : user.id,
                    email    : user.email ?? '',
                    name     : user.name   ?? '',
                    provider : account.provider,
                } as User.OAuth2;

                const url = process.env.NEXT_PUBLIC_SERVER + '/public/api/user/oauth'
                const clientIp = req.ip ?? req.headers.get('x-real-ip') ?? req.headers.get('x-forwarded-for');

                const ipRegExp = /(\d{1,3}\.\d{1,3}\.\d{1,3}\.\d{1,3})/;
                const ipMatch = ipRegExp.exec(clientIp ?? '');

                const headers = {
                    'Content-Type': 'application/json',
                    'User-Agent': req.headers.get('User-Agent') ?? '',
                    'Ip': ipMatch?.[0] ?? '',
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
            redirect(params) {
                return '/';
            },
        },
    }

    return await NextAuth(req, context, options)
}

export { handler as GET, handler as POST };

