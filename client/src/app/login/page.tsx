'use client';

import React, {useState} from "react";
import LoginProvider, {LoginI} from "@/app/login/{services}/LoginProvider";
import Login from "@/app/login/{componens}/Login";
import NoneAuth from "@/app/login/{componens}/NoneAuth";
import Auth from "@/app/login/{componens}/Auth";


export interface LoginAuth {
    verity: boolean;
    authType: AuthType;
}

export interface ErrorResponse {
    status: number;
    message: string;
    use: boolean
}

export interface GeoLocation {
    countryCode: string;
    countryName: string;
    state: string;
    city: string;
    ipv4: string;
    latitude: number;
    longitude: number;
}

export enum AuthType {
    INTRO = 'INTRO',
    NONE  = 'NONE',
    OTP   = 'OTP',
    EMAIL = 'EMAIL',
}
export default function page() {

    const [user, setUser] = useState<LoginI>({
        username: '',
        password: '',
        authType: AuthType.INTRO,
    });
    return (
        <main className={'flex flex-col min-h-screen justify-center items-center'}>
            <LoginProvider.Provider value={{user, setUser}}>
                {
                    !user.verify && user.authType === AuthType.INTRO &&
                    <Login />
                }
                {
                    !user.verify && user.authType === AuthType.NONE &&
                    <NoneAuth />
                }
                {
                    user.verify && user.authType === AuthType.OTP &&
                    <Auth />
                }
            </LoginProvider.Provider>
        </main>
    );
}