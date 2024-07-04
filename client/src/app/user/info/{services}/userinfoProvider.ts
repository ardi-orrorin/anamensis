import {createContext} from "react";
import {UserInfoI} from "@/app/user/email/{services}/userInfoProvider";

export interface UserinfoProviderI {
    img: string;
    setImg: React.Dispatch<React.SetStateAction<string>>;
    profile: UserInfoI;
    setProfile: React.Dispatch<React.SetStateAction<UserInfoI>>;
}

const UserinfoProvider = createContext({} as UserinfoProviderI);

export default UserinfoProvider;