import {createContext, Dispatch, SetStateAction} from "react";
export interface ModalI {
    route: string;
    id: string;
    isOpen: boolean;
}

export type ModalContextType = {
    modal: ModalI;
    setModal: Dispatch<SetStateAction<ModalI>>
}


const ModalProvider = createContext<ModalContextType>({} as ModalContextType);


export default ModalProvider;