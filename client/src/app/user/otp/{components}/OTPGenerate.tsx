import {useContext, useState} from "react";
import OTPProvider from "@/app/user/otp/{services}/OTPProvider";
import axios from "axios";
import {useRouter} from "next/navigation";
import LoadingSpinner from "@/app/{commons}/LoadingSpinner";

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


        await axios.get('./otp/api')
            .then((res) => {
                setOtp({
                    ...otp,
                    callApiReq: true,
                    otpQRLink: res.data
                });

                router.push('?step=verify');
            })
            .finally(() => {
                setLoading(false);
            });
    }

    const qrcode = () => {
        setOtp({
            ...otp,
            isViewOtpQRCode: true
        });
        window.open(otp.otpQRLink, '_blank');
    }

    return (
        <div className={'flex flex-col gap-3'}>
            <button className={[
                'w-full py-3 text-white rounded duration-500',
                (loading || otp.callApiReq)     ?
                'bg-gray-400 hover:bg-gray-600' :
                'bg-blue-300 hover:bg-blue-600'
            ].join(' ')}
                    disabled={loading || otp.callApiReq}
                    onClick={generateOTP}
            >{
                loading ? <LoadingSpinner size={12}/> : 'OTP 생성'
            }</button>
            {
                otp.callApiReq &&
                <button className={'w-full bg-blue-300 py-3 hover:bg-blue-600 text-white rounded duration-500'}
                        onClick={qrcode}
                >QR 코드 보기</button>
            }
        </div>
    )
}

export default OTPGenerate;