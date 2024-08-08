interface ChangePasswordI {
    curPwd: string;
    newPwd: string;
    status: ChangePasswordStatusEnum;
}

enum ChangePasswordStatusEnum {
    READY     = 'READY',
    CONFIRMED = 'CONFIRMED',
    SUCCESS   = 'SUCCESS',
}

enum StatueEnum {
    READY,
    CONFIRMED,
    FAILED
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
    export import Statue               = StatueEnum;
    export import ChangePasswordStatus = ChangePasswordStatusEnum;
    export type ChangePassword         = ChangePasswordI;
    export type Loading                = LoadingT;
    export type Pwd                    = PwdT;
}