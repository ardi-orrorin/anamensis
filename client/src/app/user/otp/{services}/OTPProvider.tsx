import {createContext, Dispatch, SetStateAction} from "react";

export interface OTPContextI {
    otp : OTPProps;
    setOtp: Dispatch<SetStateAction<OTPProps>>
}

export interface OTPProps {
    existOtp    : boolean;
    otpQRLink   : string;
    callApiReq  : boolean;
    verifyCode  : string;
    verifyState : 'success' | 'fail' | undefined;
}

const OTPProvider = createContext<OTPContextI>({} as OTPContextI);

export default OTPProvider;

