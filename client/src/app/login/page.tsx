'use client';

import React from "react";
import Login from "@/app/login/{componens}/Login";
import NoneAuth from "@/app/login/{componens}/NoneAuth";
import OTPAuth from "@/app/login/{componens}/OTPAuth";
import EmailAuth from "@/app/login/{componens}/EmailAuth";
import {User} from "@/app/login/{services}/types";
import {useLogin} from "@/app/login/{hooks}/LoginProvider";

export default function Page() {

    const {user} = useLogin();

    return (
        <main className={'flex flex-col min-h-screen justify-center items-center'}>
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
        </main>
    );
}
