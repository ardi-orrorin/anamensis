import {createContext} from "react";
import {User} from "@/app/login/{services}/types";

export interface UserinfoProviderI {
    img        : string;
    setImg     : React.Dispatch<React.SetStateAction<string>>;
    profile    : User.UserInfo;
    setProfile : React.Dispatch<React.SetStateAction<User.UserInfo>>;
}

const UserinfoProvider = createContext({} as UserinfoProviderI);

export default UserinfoProvider;