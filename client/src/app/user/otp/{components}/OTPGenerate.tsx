import {useContext, useState} from "react";
import OTPProvider from "@/app/user/otp/{services}/OTPProvider";
import axios from "axios";
import {useRouter} from "next/navigation";
import LoadingSpinner from "@/app/{commons}/LoadingSpinner";
import apiCall from "@/app/{commons}/func/api";
import Image from "next/image";

const OTPGenerate = () => {

    const router = useRouter();

    const {otp, setOtp} = useContext(OTPProvider);

    const [loading, setLoading] = useState(false);

    const generateOTP = async () => {
        setLoading(true);
        setOtp({
            ...otp,
            callApiReq: false
        });

        await apiCall({
            path: '/api/user/otp/generate',
            method: 'GET'
        })
        .then((res) => {
            setOtp({
                ...otp,
                callApiReq: true,
                otpQRLink: res.data,
                isViewOtpQRCode: true
            });
            router.push('?step=verify');
        })
        .finally(() => {
            setLoading(false);
        });
    }

    return (
        <div className={'flex flex-col gap-3'}>
            <button className={[
                'w-full py-3 text-white rounded duration-500',
                (loading || otp.callApiReq || otp.existOtp)
                    ? 'bg-gray-400 hover:bg-gray-600'
                    : 'bg-blue-300 hover:bg-blue-600'
            ].join(' ')}
                    disabled={loading || otp.callApiReq || otp.existOtp}
                    onClick={generateOTP}
            >{
                loading ? <LoadingSpinner size={12}/> : 'OTP 생성'
            }</button>
        </div>
    )
}

export default OTPGenerate;