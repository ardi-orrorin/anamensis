import {createContext, Dispatch, SetStateAction} from "react";

export type ModalContextType = {
    modal: ModalI;
    setModal: Dispatch<SetStateAction<ModalI>>
}

export interface ModalI {
    route: string;
    id: string;
    isOpen: boolean;
}

const ModalProvider = createContext<ModalContextType>({} as ModalContextType);


export default ModalProvider;