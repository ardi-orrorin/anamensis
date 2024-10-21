interface OAuth2ItemI {
    enabled     : boolean;
    clientId    : string;
    clientSecret: string;
}

interface CustomOAuth2ItemI extends OAuth2ItemI {
    url: string;
}

interface OAuth2I {
    kakao           : SystemOAuth.OAuth2Item;
    google          : SystemOAuth.OAuth2Item;
    naver           : SystemOAuth.OAuth2Item;
    github          : SystemOAuth.OAuth2Item;
    custom          : SystemOAuth.CustomOAuth2Item;
    [key: string]   : SystemOAuth.OAuth2Item | SystemOAuth.CustomOAuth2Item;
}

export namespace SystemOAuth {
    export type OAuth2              = OAuth2I;
    export type OAuth2Item          = OAuth2ItemI;
    export type CustomOAuth2Item    = CustomOAuth2ItemI;
}