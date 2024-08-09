import React from "react";
import UserInfo from "@/app/user/info/{components}/userInfo";
import ProfileImg from "@/app/user/info/{components}/profileImg";
import apiCall from "@/app/{commons}/func/api";
import {User} from "@/app/login/{services}/types";



export default async function Page() {

    const profile = await apiCall<User.UserInfo>({
        path: '/api/user/info',
        method: 'GET',
        call: 'Server',
        setAuthorization: true,
        isReturnData: true,
    });

    return (
        <main className={'flex flex-col gap-7 w-full justify-center items-center'}>
            <ProfileImg />
            <UserInfo profileInfo={profile} />
        </main>
    )
}
