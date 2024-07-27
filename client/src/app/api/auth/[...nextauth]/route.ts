import NextAuth, {AuthOptions} from "next-auth";
import Google from "next-auth/providers/google";
import {OAuth2I} from "@/app/login/{services}/LoginProvider";
import {NextApiRequest, NextApiResponse} from "next";
import {NextResponse} from "next/server";
import {ResponseCookie} from "next/dist/compiled/@edge-runtime/cookies";
import axios from "axios";
import {cookies} from "next/headers";


// todo: cookie 저장

async function handler(req: NextApiRequest, res: NextApiResponse) {

    const options: AuthOptions = {
        providers: [
            Google(({
                clientId: process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID || '',
                clientSecret: process.env.NEXT_PUBLIC_GOOGLE_CLIENT_SECRET || '',

            }))
        ],
        callbacks: {
            async signIn({account, credentials, user}) {
                if(account?.provider === 'google' && user?.email) {
                    const loginUser: OAuth2I = {
                        userId: user.id,
                        email: user.email,
                        name: user.name || '',
                        provider: account.provider,
                    }

                    const url = process.env.NEXT_PUBLIC_SERVER + '/public/api/user/oauth'
                    const headers = req.headers;
                    const clientIp = headers['ip'] || headers['x-real-ip'] || headers['x-forwarded-for'];
                    const ipRegExp = /(\d{1,3}\.\d{1,3}\.\d{1,3}\.\d{1,3})/;
                    const ipMatch = ipRegExp.exec(clientIp?.toString() || '');

                    const reqHeaders = {
                        'Content-Type': 'application/json',
                        'User-Agent': headers['User-Agent']?.toString() || '',
                        'Ip': ipMatch?.[0] || '',
                        'Location': `Test`
                    }

                    try {
                        const resData = await axios.post(url, loginUser, {
                            headers: reqHeaders,
                            withCredentials: true
                        })
                            .then(res => res.data)

                        const next = new NextResponse(JSON.stringify(resData), {
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
                }

                return true;
            },
            redirect(params ) {
                return '/';
            },
        },
    }



    return await NextAuth(req, res , options)
}

export {handler as GET, handler as POST};

