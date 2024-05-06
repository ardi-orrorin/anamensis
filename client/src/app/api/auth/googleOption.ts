import {NextAuthOptions} from "next-auth";
import GoogleProvider from "next-auth/providers/google";
import CredentialsProvider from "next-auth/providers/credentials";
import {LoginI} from "@/app/login/{services}/LoginProvider";
import {AuthType} from "@/app/login/{services}/types";
import axios from "axios";
import {cookies} from "next/headers";
import {AdapterUser} from "next-auth/adapters";


interface UserType extends AdapterUser {
    accessToken: string;
    accessTokenExpiresIn: number;
    refreshToken: string;
    refreshTokenExpiresIn: number;
}

export const googleOption: NextAuthOptions = {
    providers: [
        GoogleProvider({
            clientId: process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID || '',
            clientSecret: process.env.NEXT_PUBLIC_GOOGLE_CLIENT_SECRET || '',
        }),
        CredentialsProvider({
            id: 'server',
            name: 'server',
            credentials: {
                username: {label: "Email", type: "email"},
                password: {label: "Password", type: "password"}
            },
            async authorize(credentials, req) {
                const url = process.env.NEXT_PUBLIC_SERVER + '/public/api/user/verify';
                const data: LoginI = {
                    username: 'admin1',
                    password: 'adminAdmin1',
                    verify: true,
                    authType: AuthType.NONE,
                    code: 200
                }

                const res = await axios.post(url, data, {
                    headers: {
                        'Content-Type': 'application/json',
                        'User-Agent': req.headers && req.headers['user-agent'],
                        'Location': `select`,
                    },
                });

                return res.data;
            },
        })
    ],
    callbacks: {
        async signIn({account, email, user, profile, credentials}) {
            const data = user as UserType;

            cookies().set('next.access.token', data.accessToken, {
                httpOnly: true,
                secure: false,
                path: '/',
                sameSite: 'lax',
                maxAge: data.accessTokenExpiresIn / 1000
            });
            cookies().set('next.refresh.token', data.refreshToken, {
                httpOnly: true,
                secure: false,
                path: '/',
                sameSite: 'lax',
                maxAge: data.refreshTokenExpiresIn / 1000
            });
            return true
        },
        async redirect({url, baseUrl}) {
            return baseUrl + '/user';
        }
    },
    useSecureCookies: false,
}

