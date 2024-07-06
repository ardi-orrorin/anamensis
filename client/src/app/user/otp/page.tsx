'use client';

import {useEffect, useState} from "react";
import OTPStep, {OTPStepEnum} from "@/app/user/otp/{components}/Step";
import {useSearchParams} from "next/navigation";
import OTPFooter from "@/app/user/otp/{components}/OTPFooter";
import OTPProvider, {OTPProps} from "@/app/user/otp/{services}/OTPProvider";
import axios from "axios";
import OTPMain from "@/app/user/otp/{components}/OTPMain";
import apiCall from "@/app/{commons}/func/api";


export default function Page() {

    const step = useSearchParams().get('step') as OTPStepEnum || OTPStepEnum.INIT;

    const [otp, setOtp] = useState<OTPProps>({} as OTPProps);

    useEffect(() => {
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