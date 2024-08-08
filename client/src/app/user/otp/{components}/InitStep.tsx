import {useState} from "react";
import {preload} from "swr";
import apiCall from "@/app/{commons}/func/api";
import {User} from "@/app/login/{services}/types";

export interface OtpInfoI {
    id: number
    sAuth: boolean
    sauthType: User.AuthType
    createAt: string
}

const InitStep = () => {

    const [otpInfo, setOtpInfo] = useState<OtpInfoI>();

    preload('/api/user/otp', async () => {
       return await apiCall<OtpInfoI>({
           path: '/api/user/otp',
           method: 'GET',
           isReturnData: true,
       })
    })
    .then((data) => {
        setOtpInfo(data);
    });

    return (
        <div className={'flex flex-col gap-3 w-full h-32 p-4 border border-blue-200 border-solid rounded text-sm'}>
            <h1>OTP 내역</h1>
            <div className={'flex gap-2'}>
                <span>
                    마지막 생성일자 :
                </span>
                <span className={'font-bold'}>
                    {otpInfo?.createAt}
                </span>
            </div>
            <div className={'flex gap-2'}>
                <span>
                    OTP인증 사용 여부 :
                </span>
                <span className={'font-bold'}>
                    {
                        !otpInfo?.sauthType
                            ? ''
                            : otpInfo?.sauthType === User.AuthType.OTP
                                ? 'YES'
                                : 'NO'
                    }
                </span>
            </div>
        </div>
    )
}

export default InitStep;