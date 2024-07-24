import React from "react";
import {AuthType} from "@/app/login/{services}/types";
import apiCall from "@/app/{commons}/func/api";
import UserInfoEmail from "@/app/user/email/{components}/UserInfoEmail";

export interface UserInfoI {
    userId: string;
    email: string;
    phone: string;
    name: string;
    point: number;
    sauthType: AuthType;
    sauth: boolean;
    [key: string]: any;
}

export interface AuthPropsI {
    sauthType: AuthType;
    sauth: boolean;
}


export default async function Page() {

    const userInfoData = await apiCall<UserInfoI>({
        path: '/api/user/info',
        method: 'GET',
        call: 'Server',
        setAuthorization: true,
        isReturnData: true,
    });

    return (
        <>
            <UserInfoEmail userInfoData={userInfoData} />
        </>
    )
}

