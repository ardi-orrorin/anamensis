import {useContext} from "react";
import OTPProvider from "@/app/user/otp/{services}/OTPProvider";
import axios from "axios";
import {useRouter} from "next/navigation";
import Link from "next/link";

const OTPGenerate = () => {

    const router = useRouter();

    const {otp, setOtp} = useContext(OTPProvider);

    const generateOTP = async () => {
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

                // router.push('?step=verify');
            });
    }

    const qrcode = () => {
        window.open(otp.otpQRLink, '_blank');
    }

    return (
        <div className={'flex flex-col gap-3'}>
            <button className={'w-full bg-blue-300 py-3 hover:bg-blue-600 text-white rounded duration-500'}
                    onClick={generateOTP}>OTP 생성</button>
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