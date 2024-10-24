import {SystemSMTP} from "@/app/system/smtp/{services}/types";
import {SystemAccount} from "@/app/system/account/{services}/types";
import {SystemOAuth} from "@/app/system/oauth/{services}/types";
import {SystemCache} from "@/app/system/cache/{services}/types";

interface RequestI<T> {
    key     : System.Key;
    value   : T;
}

interface StatusResponseI {
    status : 'success' | 'error';
    message: string;
}

interface PrivateResponseI {
    smtp    : SystemSMTP.Smtp;
    oauth   : SystemOAuth.OAuth2;
    redis   : SystemCache.Redis;
}


interface PublicResponseI {
    sign_up : SystemAccount.SignUp;
    login   : SystemAccount.Login;
    site    : System.Site;
}

interface SiteI {
    domain          : string;
    cdnUrl          : string;
    ssl             : boolean;
    [key: string]   : string | boolean;
}



export namespace System {
    export type Site            = SiteI;
    export type Request<T>      = RequestI<T>;
    export type PrivateResponse = PrivateResponseI;
    export type PublicResponse  = PublicResponseI;
    export type StatusResponse  = StatusResponseI;
    export enum Key {
        SMTP    = 'smtp',
        SIGN_UP = 'sign_up',
        LOGIN   = 'login',
        OAUTH   = 'oauth',
        SITE    = 'site',
        REDIS   = 'redis',
        POINT   = 'point',
    }

    export enum JobStatus {
        COMPLETED = 'COMPLETED',
        READY = 'READY',
        FAILED = 'FAILED',
        PROCESSING = 'PROCESSING',
    }
    
}