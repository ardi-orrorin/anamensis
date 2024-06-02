import {createContext, Dispatch, SetStateAction} from "react";

export interface OTPContextI {
    otp : OTPProps;
    setOtp: Dispatch<SetStateAction<OTPProps>>
}

export interface OTPProps {
    existOtp        : boolean;
    otpQRLink       : string;
    isViewOtpQRCode : boolean;
    callApiReq      : boolean;
    verifyCode      : string;
    verifyState?    : boolean;
}

const OTPProvider = createContext<OTPContextI>({} as OTPContextI);

export default OTPProvider;

