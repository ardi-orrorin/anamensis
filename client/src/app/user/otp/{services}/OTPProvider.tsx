import {createContext, Dispatch, SetStateAction} from "react";
import {OTP} from "@/app/user/otp/{services}/types";

export interface OTPContextI {
    otp : OTP.Props;
    setOtp: Dispatch<SetStateAction<OTP.Props>>
}

const OTPProvider = createContext<OTPContextI>({} as OTPContextI);

export default OTPProvider;

