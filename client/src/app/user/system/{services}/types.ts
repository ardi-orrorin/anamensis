interface WebSysI {
    code: string;
    name: string;
    description: string;
    permission: string;
    edit: boolean;
}

interface SysMessageI {
    id: string;
    webSysPk: string;
    subject: string;
    content: string;
    extra1: string;
    extra2: string;
    extra3: string;
    extra4: string;
    extra5: string;
    isUse: boolean;
    [key: string]: string | boolean;
}

type LoadingT = {
    loading: boolean;
    listLoading: boolean;
}


export namespace System {
    export type WebSys     = WebSysI;
    export type SysMessage = SysMessageI;
    export type Loading    = LoadingT;

    export enum Role {
        ADMIN  = 'ADMIN',
        USER   = 'USER',
        MASTER = 'MASTER',
        GUEST  = 'GUEST',
        OAUTH  = 'OAUTH',
    }
}