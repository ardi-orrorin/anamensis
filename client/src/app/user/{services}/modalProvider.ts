import {createContext, Dispatch, SetStateAction} from "react";

export type ModalContextType = {
    modal: ModalI;
    setModal: Dispatch<SetStateAction<ModalI>>
}

export interface ModalI {
    route: string;
    id: string;
    params: any;
    isOpen: boolean;
    component: React.ReactNode;
}

const ModalProvider = createContext<ModalContextType>({} as ModalContextType);


export default ModalProvider;