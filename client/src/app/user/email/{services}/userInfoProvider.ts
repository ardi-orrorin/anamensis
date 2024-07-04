import {AuthType} from "@/app/login/{services}/types";
import {createContext} from "react";

export interface UserInfoI {
    userId: string;
    email: string;
    phone: string;
    name: string;
    point: number;
    sauthType: AuthType;
    sauth: boolean;
    [key: string]: any;
}

interface UserInfoProviderI {
    userInfo: UserInfoI
    setUserInfo: React.Dispatch<React.SetStateAction<UserInfoI>>;
}

const UserInfoProvider = createContext({} as UserInfoProviderI);

export default UserInfoProvider