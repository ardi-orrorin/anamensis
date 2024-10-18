'use client';

import {createContext, useContext, useState} from "react";

export interface ActiveMenuI {
    toggle   : boolean;
    type     : ActiveMenuEnum;
    detailId : number;
}

export enum ActiveMenuEnum {
    PROFILE  = 'profile',
    CHAT     = 'chat',
    CHATLIST = 'chatlist',
    INFO     = 'info',
}


export interface ChatMenuProviderI {
    activeMenu: ActiveMenuI;
    changeToggleHandler: (toggle: boolean) => void;
    changeActiveMenuHandler: (type: ActiveMenuEnum, detailId: number) => void;
}

const ChatMenuContext = createContext<ChatMenuProviderI>({} as ChatMenuProviderI);

export const ChatMenuProvider = ({children}: { children: React.ReactNode }) => {

    const [activeMenu, setActiveMenu] = useState<ActiveMenuI>({
        toggle: false,
        type: ActiveMenuEnum.PROFILE,
        detailId: 0
    });

    const changeToggleHandler = (toggle: boolean) => {
        setActiveMenu({
            ...activeMenu,
            toggle
        })
    }

    const changeActiveMenuHandler = (type: ActiveMenuEnum, detailId: number = 0) => {
        setActiveMenu({
            ...activeMenu,
            detailId,
            type
        })
    }

    return (
        <ChatMenuContext.Provider value={{
            activeMenu, changeToggleHandler, changeActiveMenuHandler
        }}>
            {children}
        </ChatMenuContext.Provider>
    )
}


export const useChatMenu = () => {
    const context = useContext(ChatMenuContext);

    if (!context) {
        throw new Error('useChatMenu must be used within ChatMenuProvider');
    }

    return context;
}