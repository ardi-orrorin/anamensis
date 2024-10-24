'use client';

import React, {useContext, useEffect, useMemo, useState} from "react";
import OTPStep from "@/app/user/otp/{components}/Step";
import {useRouter, useSearchParams} from "next/navigation";
import OTPProvider from "@/app/user/otp/{services}/OTPProvider";
import OTPMain from "@/app/user/otp/{components}/OTPMain";
import apiCall from "@/app/{commons}/func/api";
import UserProvider from "@/app/user/{services}/userProvider";
import {OTP} from "@/app/user/otp/{services}/types";
import {System} from "@/app/system/message/{services}/types";
import {useQuery} from "@tanstack/react-query";
import rootApiService from "@/app/{services}/rootApiService";

export default function Page() {
    const {data: roles} = useQuery(rootApiService.userRole());

    const step = useSearchParams().get('step') as OTP.OTPStep || OTP.OTPStep.INIT;

    const [otp, setOtp] = useState({} as OTP.Props);
    const isOAuthUser = useMemo(()=>
        (roles as System.Role[])?.some((role) =>
            role === System.Role.OAUTH)
        ,[roles])
    const router = useRouter();

    useEffect(()=>{
        if(!isOAuthUser) return;
        alert('접근할 수 없는 페이지 입니다.');
        router.push('/user');
    },[roles])

    useEffect(() => {
        if(isOAuthUser) return;
        apiCall({
            path: '/api/user/otp/exist',
            method: 'GET',
        })
        .then(res => {
            setOtp({
                ...otp,
                existOtp: res.data
            });
        });
    }, [step])

    if(isOAuthUser) return <></>

    return (
        <div className={'flex flex-col gap-10 items-center justify-center'}>
            <OTPProvider.Provider value={{otp, setOtp}}>
                <OTPStep step={step} />
                <OTPMain step={step} />
                {/*<OTPFooter cur={step} />*/}
            </OTPProvider.Provider>
        </div>
    )
}