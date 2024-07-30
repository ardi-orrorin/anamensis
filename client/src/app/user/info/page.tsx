import React from "react";
import UserInfo from "@/app/user/info/{components}/userInfo";
import ProfileImg from "@/app/user/info/{components}/profileImg";
import apiCall from "@/app/{commons}/func/api";
import {UserInfoI} from "@/app/user/email/page";

export type LoadingType = {
    profile : boolean,
    img     : boolean
}

export default async function Page() {

    const profile = await apiCall<UserInfoI>({
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
