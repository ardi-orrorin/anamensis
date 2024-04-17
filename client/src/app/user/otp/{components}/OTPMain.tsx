import {OTPStepEnum} from "@/app/user/otp/{components}/Step";
import InitStep from "@/app/user/otp/{components}/InitStep";
import OTPGenerate from "@/app/user/otp/{components}/OTPGenerate";
import OTPVerify from "@/app/user/otp/{components}/OTPVerify";
import OTPProvider, {OTPContextI} from "@/app/user/otp/{services}/OTPProvider";
import {useContext} from "react";
import OTPInit from "@/app/user/otp/{components}/OTPInit";

const OTPMain = ({step}: {step: OTPStepEnum}) => {

    const {otp, setOtp} = useContext<OTPContextI>(OTPProvider);

    return (
        <main className={'flex flex-col gap-5 min-w-[400px] max-w-1/3'}>
            {
                [OTPStepEnum.INIT, OTPStepEnum.OTP, OTPStepEnum.VERIFY].includes(step) &&
                <InitStep />
            }
            {
                otp.existOtp &&
                <OTPInit />
            }
            {
                [OTPStepEnum.OTP, OTPStepEnum.VERIFY].includes(step) &&
                <OTPGenerate />
            }
            {
                [OTPStepEnum.VERIFY].includes(step) && otp.callApiReq && otp.isViewOtpQRCode &&
                <OTPVerify />
            }
        </main>
    );
}

export default OTPMain;