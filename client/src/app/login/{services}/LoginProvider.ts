import {createContext, Dispatch, SetStateAction} from "react";
import {User} from "@/app/login/{services}/types";

export interface LoginProviderI {
    user: User.Login
    setUser: Dispatch<SetStateAction<User.Login>>
}

const LoginProvider = createContext<LoginProviderI>({} as LoginProviderI);

export default LoginProvider;