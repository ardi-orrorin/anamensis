import {createContext, Dispatch, SetStateAction} from "react";
import {AuthType} from "@/app/login/page";


export interface LoginI {
    username : string;
    password : string;
    verify?: boolean;
    authType?: AuthType;
    code?: number;
}

export interface LoginProviderI {
    user: LoginI
    setUser: Dispatch<SetStateAction<LoginI>>
}

const LoginProvider = createContext<LoginProviderI>({} as LoginProviderI);

export default LoginProvider;