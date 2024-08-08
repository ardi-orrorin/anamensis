import {createContext} from "react";


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