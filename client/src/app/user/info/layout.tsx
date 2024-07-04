'use client';

import UserinfoProvider from "@/app/user/info/{services}/userinfoProvider";
import {useState} from "react";
import {preload} from "swr";
import apiCall from "@/app/{commons}/func/api";
import {UserInfoI} from "@/app/user/email/{services}/userInfoProvider";

export default function Layout({children}: {children: React.ReactNode}) {

    const [img, setImg] = useState<string>('');
    const [profile, setProfile] = useState<UserInfoI>({} as UserInfoI);

    preload('/user/info', async () => {
        return await apiCall<UserInfoI>({
            path: '/api/user/info',
            method: 'GET',
            isReturnData: true,
        })
    }).then((res) => {
        setProfile(res)
    });


    return <UserinfoProvider.Provider value={{
        img, setImg,
        profile, setProfile
    }}>
        {children}
    </UserinfoProvider.Provider>;
}