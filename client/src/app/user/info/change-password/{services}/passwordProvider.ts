import {createContext, Dispatch, SetStateAction} from "react";


export interface ChangePasswordI {
    curPwd: string;
    newPwd: string;
    status: ChangePasswordStatus;
}

export enum ChangePasswordStatus {
    READY     = 'READY',
    CONFIRMED = 'CONFIRMED',
    SUCCESS   = 'SUCCESS',
}

export interface PasswordProviderI {
    changePwd    : ChangePasswordI;
    setChangePwd  : Dispatch<SetStateAction<ChangePasswordI>>
}

const PasswordProvider = createContext({} as PasswordProviderI);

export default PasswordProvider;