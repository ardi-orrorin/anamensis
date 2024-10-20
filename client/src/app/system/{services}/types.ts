import {SystemSMTP} from "@/app/system/smtp/{services}/types";
import {SystemAccount} from "@/app/system/account/types";
import {SystemOAuth} from "@/app/system/oauth/{services}/types";

interface RequestI<T> {
    key     : System.Key;
    value   : T;
}

interface PrivateResponseI {
    smtp    : SystemSMTP.Smtp;
    oauth   : SystemOAuth.OAuth2;
}


interface PublicResponseI {
    sign_up : SystemAccount.SignUp;
    login   : SystemAccount.Login;
}

export namespace System {
    export type Request<T> = RequestI<T>;
    export type PrivateResponse = PrivateResponseI;
    export type PublicResponse = PublicResponseI;
    export enum Key {
        SMTP    = 'smtp',
        SIGN_UP = 'sign_up',
        LOGIN   = 'login',
        OAUTH   = 'oauth',
    }
    
}