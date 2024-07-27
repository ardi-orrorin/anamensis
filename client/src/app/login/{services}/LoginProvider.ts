import {createContext, Dispatch, SetStateAction} from "react";
import {AuthType} from "@/app/login/{services}/types";


export interface LoginI {
    username : string;
    password : string;
    verify?: boolean;
    authType?: AuthType;
    code?: number;
    oauth2?: boolean;
}

export interface LoginProviderI {
    user: LoginI
    setUser: Dispatch<SetStateAction<LoginI>>
}

const LoginProvider = createContext<LoginProviderI>({} as LoginProviderI);

export default LoginProvider;