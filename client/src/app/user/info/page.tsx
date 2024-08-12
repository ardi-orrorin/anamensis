'use client';
import React from "react";
import UserInfo from "@/app/user/info/{components}/userInfo";
import ProfileImg from "@/app/user/info/{components}/profileImg";
import {useQuery} from "@tanstack/react-query";
import userInfoApiService from "@/app/user/info/{services}/userInfoApiService";

export default function Page() {

    const {data: profile} = useQuery(userInfoApiService.profile());


    return (
        <main className={'flex flex-col gap-7 w-full justify-center items-center'}>
            <ProfileImg />
            {
                profile && <UserInfo profileInfo={profile} />
            }
        </main>
    )
}
