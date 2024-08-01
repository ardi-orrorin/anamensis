import {createContext} from "react";
import {UserInfoI} from "@/app/user/email/page";
import {PageI} from "@/app/{commons}/types/commons";


export interface ModalI {
    id     : number;
    toggle : boolean;
}
export interface ModalProviderI {
    modal: ModalI;
    setModal: React.Dispatch<React.SetStateAction<ModalI>>;
}

const ModalProvider = createContext({} as ModalProviderI);

export default ModalProvider;