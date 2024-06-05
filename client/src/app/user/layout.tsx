'use client';

import React, {useState} from "react";
import ModalProvider, {ModalI} from "@/app/user/{services}/modalProvider";
import LeftNavBar from "@/app/user/{components}/LeftNavBar";
import Contents from "@/app/user/{components}/Contents";
import {bodyScrollToggle} from "@/app/user/{services}/modalSetting";
import ModalBackground from "@/app/user/{components}/ModalBackground";


export default function Layout({children}: {children: React.ReactNode}) {

    const [isOpen, setIsOpen] = useState<boolean>(false);
    const [modal, setModal] = useState<ModalI>({} as ModalI);

    const modalClose = () => {
        bodyScrollToggle();
        setModal({} as ModalI);
    }

    return (
        <main className={'flex items-start'}>
            <ModalProvider.Provider value={{modal, setModal}}>
                <LeftNavBar isOpen={isOpen} setIsOpen={setIsOpen} />
                <Contents isOpen={isOpen} setIsOpen={setIsOpen}>
                    {children}
                </Contents>
                {
                    modal.component
                }
                <ModalBackground isOpen={modal.isOpen} />
            </ModalProvider.Provider>
        </main>
    )
}