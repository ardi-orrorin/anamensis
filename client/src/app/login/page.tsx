'use client';

import React, {useState} from "react";
import LoginProvider from "@/app/login/{services}/LoginProvider";
import Login from "@/app/login/{componens}/Login";
import NoneAuth from "@/app/login/{componens}/NoneAuth";
import OTPAuth from "@/app/login/{componens}/OTPAuth";
import EmailAuth from "@/app/login/{componens}/EmailAuth";
import {User} from "@/app/login/{services}/types";

export default function Page() {

    const [user, setUser] = useState<User.Login>({
        username: '',
        password: '',
        authType: User.AuthType.INTRO,
    });

    return (
        <main className={'flex flex-col min-h-screen justify-center items-center'}>
            <LoginProvider.Provider value={{user, setUser}}>
                {
                    !user.verify && user.authType === User.AuthType.INTRO &&
                    <Login />
                }
                {
                    !user.verify && user.authType === User.AuthType.NONE &&
                    <NoneAuth />
                }
                {
                    user.verify && user.authType === User.AuthType.OTP &&
                    <OTPAuth />
                }
                {
                    user.verify && user.authType === User.AuthType.EMAIL &&
                    <EmailAuth />
                }
            </LoginProvider.Provider>
        </main>
    );
}
