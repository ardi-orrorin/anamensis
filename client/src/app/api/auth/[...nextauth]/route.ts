import NextAuth, {AuthOptions} from "next-auth";
import Google from "next-auth/providers/google";
import {OAuth2I} from "@/app/login/{services}/LoginProvider";
import {ResponseCookie} from "next/dist/compiled/@edge-runtime/cookies";
import axios from "axios";
import {cookies} from "next/headers";
import {NextRequest} from "next/server";

interface RouteHandlerContext {
    params: { nextauth: string[] }
}

async function handler(req: NextRequest, context: RouteHandlerContext) {

    const options: AuthOptions = {
        providers: [
            Google(({
                clientId: process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID || '',
                clientSecret: process.env.NEXT_PUBLIC_GOOGLE_CLIENT_SECRET || '',

            }))
        ],
        callbacks: {
            async signIn({account, credentials, user}) {
                const loginUser  = {} as OAuth2I;
                if(account?.provider === 'google' && user?.email) {
                    loginUser.userId = user.id;
                    loginUser.email = user.email;
                    loginUser.name = user.name || '';
                    loginUser.provider = account.provider;
                }

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
                    const resData = await axios.post(url, loginUser, {
                        headers,
                        withCredentials: true
                    })
                        .then(res => res.data)

                    const cookieInit: Partial<ResponseCookie> = {
                        httpOnly: true,
                        secure: false,
                        sameSite: 'lax',
                        path: '/'
                    }

                    cookies().set('next.access.token', resData.accessToken, {
                        ...cookieInit,
                        maxAge: resData.accessTokenExpiresIn / 1000
                    });

                    cookies().set('next.refresh.token', resData.refreshToken, {
                        ...cookieInit,
                        maxAge: resData.refreshTokenExpiresIn / 1000
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

