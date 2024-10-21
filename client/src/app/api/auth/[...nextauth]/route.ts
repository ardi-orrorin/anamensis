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
import apiCall from "@/app/{commons}/func/api";
import {System} from "@/app/system/{services}/types";

interface RouteHandlerContext {
    params: { nextauth: string[] }
}

async function handler(req: NextRequest, context: RouteHandlerContext) {

    const systemSettings = await apiCall<System.PrivateResponse>({
        path: '/public/master/system-settings/oauth',
        method: 'GET',
        call: 'Server',
        setAuthorization: true,
        isReturnData: true,
    });

    const {github, google, kakao, naver, custom} = systemSettings.oauth;

    const providers = [];

    github.enabled
    && providers.push(Github({
        clientId: github.clientId,
        clientSecret: github.clientSecret,
    }));

    google.enabled
    && providers.push(Google({
        clientId: google.clientId,
        clientSecret: google.clientSecret,
    }));

    kakao.enabled
    && providers.push(Kakao({
        clientId: kakao.clientId,
        clientSecret: kakao.clientSecret,
    }));

    naver.enabled
    && providers.push(Naver({
        clientId: naver.clientId,
        clientSecret: naver.clientSecret,
    }));

    custom.enabled
    && providers.push(Custom({
        clientId: custom.clientId,
        clientSecret: custom.clientSecret,
        url: custom.url,
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

