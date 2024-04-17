'use client';

import {useEffect, useState} from "react";
import OTPStep, {OTPStepEnum} from "@/app/user/otp/{components}/Step";
import {useSearchParams} from "next/navigation";
import OTPFooter from "@/app/user/otp/{components}/OTPFooter";
import InitStep from "@/app/user/otp/{components}/InitStep";
import OTPGenerate from "@/app/user/otp/{components}/OTPGenerate";
import OTPProvider, {OTPProps} from "@/app/user/otp/{services}/OTPProvider";
import OTPVerify from "@/app/user/otp/{components}/OTPVerify";
import axios from "axios";


export default function Page() {

    const step = useSearchParams().get('step') as OTPStepEnum || OTPStepEnum.INIT;

    const [otp, setOtp] = useState<OTPProps>({} as OTPProps);

    useEffect(() => {
        axios.get('./otp/exist')
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
                <nav>
                    <OTPStep step={step} />
                </nav>
                <main className={'flex flex-col gap-5 min-w-[400px] max-w-1/3'}>
                    {
                        [OTPStepEnum.INIT, OTPStepEnum.OTP, OTPStepEnum.VERIFY].includes(step) &&
                        <InitStep />
                    }
                    {
                        [OTPStepEnum.OTP, OTPStepEnum.VERIFY].includes(step) &&
                        <OTPGenerate />
                    }
                    {
                        [OTPStepEnum.VERIFY].includes(step) && otp.callApiReq && otp.otpQRLink &&
                        <OTPVerify />
                    }
                </main>
                <footer className={'w-full'}>
                    <OTPFooter cur={step} />
                </footer>
            </OTPProvider.Provider>
        </div>
    )
}