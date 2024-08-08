import {User} from "@/app/login/{services}/types";

interface PropsI {
    existOtp        : boolean;
    otpQRLink       : string;
    isViewOtpQRCode : boolean;
    callApiReq      : boolean;
    verifyCode      : string;
    verifyState?    : boolean;
}

interface InfoI {
    id: number
    sAuth: boolean
    sauthType: User.AuthType
    createAt: string
}

enum OTPStepEnum {
    INIT   = 'init',
    OTP    = 'otp',
    VERIFY = 'verify',
}


export namespace OTP {
    export type Props     = PropsI;
    export type Info      = InfoI;
    export import OTPStep = OTPStepEnum;
}