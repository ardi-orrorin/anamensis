'use client';

import {usePrefetchQuery} from "@tanstack/react-query";
import userApiService from "@/app/user/{services}/userApiService";
import rootApiService from "@/app/{services}/rootApiService";
import userInfoApiService from "@/app/user/info/{services}/userInfoApiService";
import React from "react";
import systemApiServices from "@/app/system/{services}/apiServices";

const GlobalState = () => {

    usePrefetchQuery(systemApiServices.getPublicSystemConfig());

    return <></>
}

export default React.memo(GlobalState);