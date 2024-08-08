import InitStep from "@/app/user/otp/{components}/InitStep";
import OTPGenerate from "@/app/user/otp/{components}/OTPGenerate";
import OTPVerify from "@/app/user/otp/{components}/OTPVerify";
import OTPProvider, {OTPContextI} from "@/app/user/otp/{services}/OTPProvider";
import {useContext} from "react";
import OTPInit from "@/app/user/otp/{components}/OTPInit";
import {OTP} from "@/app/user/otp/{services}/types";

const OTPMain = ({step}: {step: OTP.OTPStep}) => {

    const {otp, setOtp} = useContext<OTPContextI>(OTPProvider);

    return (
        <main className={'flex flex-col gap-5 min-w-[400px] max-w-1/3'}>
            {
                [OTP.OTPStep.INIT, OTP.OTPStep.OTP, OTP.OTPStep.VERIFY].includes(step)
                && <InitStep />
            }
            {
                [OTP.OTPStep.INIT, OTP.OTPStep.OTP, OTP.OTPStep.VERIFY].includes(step)
                && otp.existOtp
                && <OTPInit />
            }
            {
                [OTP.OTPStep.INIT, OTP.OTPStep.OTP, OTP.OTPStep.VERIFY].includes(step)
                && <OTPGenerate />
            }
            {
                [OTP.OTPStep.VERIFY].includes(step)
                && otp.callApiReq
                && otp.isViewOtpQRCode
                && <OTPVerify />
            }
        </main>
    );
}

export default OTPMain;