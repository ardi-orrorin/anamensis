'use client';

import React, {useContext, useEffect, useMemo, useState} from "react";
import OTPStep, {OTPStepEnum} from "@/app/user/otp/{components}/Step";
import {useRouter, useSearchParams} from "next/navigation";
import OTPProvider, {OTPProps} from "@/app/user/otp/{services}/OTPProvider";
import OTPMain from "@/app/user/otp/{components}/OTPMain";
import apiCall from "@/app/{commons}/func/api";
import UserProvider from "@/app/user/{services}/userProvider";
import {RoleType} from "@/app/user/system/{services}/types";


export default function Page() {

    const step = useSearchParams().get('step') as OTPStepEnum || OTPStepEnum.INIT;
    const {roles} = useContext(UserProvider);

    const [otp, setOtp] = useState<OTPProps>({} as OTPProps);
    const isOAuthUser = useMemo(()=> roles.some((role) => role === RoleType.OAUTH),[roles])
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