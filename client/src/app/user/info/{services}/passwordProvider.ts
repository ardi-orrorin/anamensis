import {createContext, Dispatch, SetStateAction} from "react";
import {UserInfoSpace} from "@/app/user/info/{services}/types";
export interface PasswordProviderI {
    changePwd    : UserInfoSpace.ChangePassword;
    setChangePwd  : Dispatch<SetStateAction<UserInfoSpace.ChangePassword>>
}

const PasswordProvider = createContext({} as PasswordProviderI);

export default PasswordProvider;