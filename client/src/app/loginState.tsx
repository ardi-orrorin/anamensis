'use client';
import {usePrefetchQuery} from "@tanstack/react-query";
import userApiService from "@/app/user/{services}/userApiService";
import rootApiService from "@/app/{services}/rootApiService";
import userInfoApiService from "@/app/user/info/{services}/userInfoApiService";
import React from "react";

const LoginState = () => {
    usePrefetchQuery(userApiService.profileImg());
    usePrefetchQuery(rootApiService.userRole());
    usePrefetchQuery(userInfoApiService.profile());

    return <></>
}

export default React.memo(LoginState);