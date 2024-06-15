'use client';

import React, {useEffect, useState} from "react";
import ModalProvider, {ModalI} from "@/app/user/{services}/modalProvider";
import LeftNavBar from "@/app/user/{components}/LeftNavBar";
import Contents from "@/app/user/{components}/Contents";
import {bodyScrollToggle} from "@/app/user/{services}/modalSetting";
import ModalBackground from "@/app/user/{components}/ModalBackground";


export default function Layout({children}: {children: React.ReactNode}) {

    const [isOpen, setIsOpen] = useState<boolean>(false);
    const [modal, setModal] = useState<ModalI>({} as ModalI);
    const [isModalMode, setIsModalMode] = React.useState<boolean>(false);

    useEffect(() => {
        if(typeof window === 'undefined') return;

        localStorage.getItem('isModalMode') || localStorage.setItem('isModalMode', JSON.stringify(false));

        const isModalMode = JSON.parse(localStorage.getItem('isModalMode')!);
        setIsModalMode(isModalMode);
    },[isModalMode]);

    return (
        <main className={'flex items-start'}>
            <ModalProvider.Provider value={{modal, setModal}}>
                <LeftNavBar isOpen={isOpen}
                            setIsOpen={setIsOpen}
                            isModalMode={isModalMode}
                            setIsModalMode={setIsModalMode}
                />
                <Contents isOpen={isOpen} setIsOpen={setIsOpen} isModalMode={isModalMode}>
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