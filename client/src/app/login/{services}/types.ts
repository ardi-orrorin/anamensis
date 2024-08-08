import {RoleType} from "@/app/user/system/{services}/types";

enum AuthTypeE {
    INTRO = 'INTRO',
    NONE  = 'NONE',
    OTP   = 'OTP',
    EMAIL = 'EMAIL',
    OAUTH = 'OAUTH',
}

interface LoginI {
    username  : string;
    password  : string;
    verify?   : boolean;
    authType? : User.AuthType;
    code?     : number;
    oauth2?   : boolean;
}

interface OAuth2I {
    userId   : string;
    name     : string;
    email    : string;
    provider : string;
}

interface LoginAuthI {
    verity: boolean;
    authType: User.AuthType;
}

interface ErrorResponseI {
    status: number;
    message: string;
    use: boolean
}


type LoginResponseT = {
    accessToken: string,
    accessTokenExpiresIn: number,
    refreshToken: string,
    refreshTokenExpiresIn: number,
} & LoginUserInfoT

type LoginUserInfoT = {
    username : string,
    roles    : RoleType[]
}

type OAuthProviderT = {
    provider      : string;
    bgColor       : string;
    hoverBgColor  : string;
    size          : number;
}


export namespace User {
    export import AuthType     = AuthTypeE;
    export type Login          = LoginI;
    export type OAuth2         = OAuth2I;
    export type Auth           = LoginAuthI;
    export type ErrorResponse  = ErrorResponseI;
    export type LoginResponse  = LoginResponseT;
    export type UserInfo       = LoginUserInfoT;
    export type OAuthProvider  = OAuthProviderT;
}