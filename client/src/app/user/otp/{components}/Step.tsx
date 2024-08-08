import Link from "next/link";
import {OTP} from "@/app/user/otp/{services}/types";



const OTPStep = ({step}: {step: OTP.OTPStep}) => {

    const currentStyle = 'font-bold text-blue-700';

    return (
        <div className={'flex gap-5 justify-center'}>
            <Link className={step === OTP.OTPStep.INIT ? currentStyle : ''} href={`?step=${OTP.OTPStep.INIT}`}>
              등록 단계
            </Link>
            <span> {'>'} </span>
            <Link className={step === OTP.OTPStep.OTP ? currentStyle : ''} href={`?step=${OTP.OTPStep.OTP}`}>
                OTP 등록
            </Link>
            <span> {'>'} </span>
            <Link className={step === OTP.OTPStep.VERIFY ? currentStyle : ''} href={`?step=${OTP.OTPStep.VERIFY}`}>
                OTP 인증
            </Link>
        </div>
    );
}


export default OTPStep;