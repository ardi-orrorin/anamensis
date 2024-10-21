import {System} from "@/app/system/message/{services}/types";
import ResetPwdProgress = User.ResetPwdProgress;

interface UserI {
    userId   : string;
    name     : string;
    email    : string;
}

interface LoginI {
    username  : string;
    password  : string;
    verify?   : boolean;
    authType? : User.AuthType;
    code?     : number;
    oauth2?   : boolean;
}

interface OAuth2I extends UserI {
    provider : string;
}

interface LoginAuthI {
    verity   : boolean;
    authType : User.AuthType;
}

interface ErrorResponseI {
    status   : number;
    message  : string;
    use      : boolean
}


type LoginResponseT = {
    accessToken           : string,
    accessTokenExpiresIn  : number,
    refreshToken          : string,
    refreshTokenExpiresIn : number,
} & LoginUserInfoT

type LoginUserInfoT = {
    username : string,
    roles    : System.Role[]
}

type OAuthProviderT = {
    provider      : string;
    bgColor       : string;
    hoverBgColor  : string;
    size          : number;
}


type FindUserT = {
    email       : string;
    verifyCode  : string;
    isVerify    : boolean;
}

type FindUserResponseT = {
    verified   : boolean;
    userId     : string;
}

interface ResetPwdII {
    progress      : ResetPwdProgress;
    userId        : string;
    email         : string;
    verifyCode?   : string;
    isVerified?   : boolean;
    pwd?          : string;
}

type ResetPwdResponseT = {
    progress: ResetPwdProgress;
    verified: boolean;
}

type ResetPwdVerifiedT = {
    confirmed     : boolean;
    verified      : boolean;
    reset         : boolean;
    [key: string] : boolean;
}

type PasswordT = {
    pwd        : string;
    pwdCheck   : string;
}

interface UserInfoI extends UserI{
    phone         : string;
    point         : number;
    sauthType     : User.AuthType;
    sauth         : boolean;
    createAt      : string;
    isOAuth       : boolean;
    [key: string] : any;
}

interface AuthPropsI {
    sauthType : User.AuthType;
    sauth     : boolean;
}


export namespace User {
    export type Login              = LoginI;
    export type OAuth2             = OAuth2I;
    export type Auth               = LoginAuthI;
    export type ErrorResponse      = ErrorResponseI;
    export type LoginResponse      = LoginResponseT;
    export type LoginUserInfo      = LoginUserInfoT;
    export type OAuthProvider      = OAuthProviderT;
    export type FindUser           = FindUserT;
    export type FindUserResponse   = FindUserResponseT;
    export type ResetPwd           = ResetPwdII;
    export type ResetPwdResponse   = ResetPwdResponseT;
    export type ResetPwdVerified   = ResetPwdVerifiedT;
    export type Password           = PasswordT;
    export type UserInfo           = UserInfoI;
    export type AuthProps          = AuthPropsI;


    export enum ResetPwdProgress {
        CONFIRMED = 'CONFIRMED',
        VERIFIED  = 'VERIFIED',
        RESET     = 'RESET',
        FAIL      = 'fail'
    }

    export enum AuthType {
        INTRO = 'INTRO',
        NONE  = 'NONE',
        OTP   = 'OTP',
        EMAIL = 'EMAIL',
        OAUTH = 'OAUTH',
    }
}