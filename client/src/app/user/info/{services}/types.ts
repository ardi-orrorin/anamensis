interface ChangePasswordI {
    curPwd: string;
    newPwd: string;
    status: UserInfoSpace.ChangePasswordStatus;
}

type LoadingT = {
    profile : boolean,
    img     : boolean
}

type PwdT = {
    newPwd: string
    isNewPwd: boolean;
    confirmPwd: string;
    isConfirmPwd: boolean;
    [key: string]: string | boolean;
}


export namespace UserInfoSpace {
    export type ChangePassword = ChangePasswordI;
    export type Loading        = LoadingT;
    export type Pwd            = PwdT;

    export enum ChangePasswordStatus {
        READY     = 'READY',
        CONFIRMED = 'CONFIRMED',
        SUCCESS   = 'SUCCESS',
    }

    export enum Statue {
        READY,
        CONFIRMED,
        FAILED
    }

}