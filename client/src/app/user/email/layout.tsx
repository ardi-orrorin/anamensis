'use client';
import {useState} from "react";
import UserInfoProvider, {UserInfoI} from "@/app/user/email/{services}/userInfoProvider";

export default function Layout({children}: {children: React.ReactNode}) {
    const [userInfo, setUserInfo] = useState<UserInfoI>({} as UserInfoI);

    return (
        <UserInfoProvider.Provider value={{userInfo, setUserInfo}}>
            {children}
        </UserInfoProvider.Provider>
    )
}