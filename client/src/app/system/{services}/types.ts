import {SMTP} from "@/app/system/smtp/{services}/types";

interface RequestI<T> {
    key: System.Key;
    value: T;
}

interface ResponseI {
    smtp: SMTP.Smtp;
}

export namespace System {
    export type Request<T> = RequestI<T>;
    export type Response = ResponseI;
    export enum Key {
        SMTP = 'smtp',
    }
    
}