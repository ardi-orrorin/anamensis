'use client';

import React, {useEffect, useState} from "react";
import Contents from "@/app/user/{components}/Contents";
import dynamic from "next/dynamic";

const DynamicLeftNavBar = dynamic(() => import('@/app/user/{components}/LeftNavBar'),{
    ssr: false
});

export default function Layout({children}: {children: React.ReactNode}) {

    const [isOpen, setIsOpen] = useState<boolean>(false);
    const [isModalMode, setIsModalMode] = React.useState<boolean>(false);

    useEffect(() => {
        if(typeof window === 'undefined') return;

        localStorage.getItem('isModalMode')
            ?? localStorage.setItem('isModalMode', JSON.stringify(false));

        const isModalMode = JSON.parse(localStorage.getItem('isModalMode')!);
        setIsModalMode(isModalMode);
    },[isModalMode]);

    return (
        <main className={'flex items-start h-full min-h-max'}>
            <DynamicLeftNavBar {...{isOpen, setIsOpen, isModalMode, setIsModalMode}}/>
            <Contents {...{isOpen, setIsOpen, isModalMode}}>
                {children}
            </Contents>
        </main>
    )
}