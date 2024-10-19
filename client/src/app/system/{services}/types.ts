import {SystemSMTP} from "@/app/system/smtp/{services}/types";
import {SystemAccount} from "@/app/system/account/types";

interface RequestI<T> {
    key     : System.Key;
    value   : T;
}

interface PrivateResponseI {
    smtp: SystemSMTP.Smtp;
}
interface PublicResponseI {
    sign_up: SystemAccount.SignUp;
}

export namespace System {
    export type Request<T> = RequestI<T>;
    export type PrivateResponse = PrivateResponseI;
    export type PublicResponse = PublicResponseI;
    export enum Key {
        SMTP    = 'smtp',
        SIGN_UP = 'sign_up',
    }
    
}