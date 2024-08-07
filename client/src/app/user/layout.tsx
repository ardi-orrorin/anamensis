'use client';

import React, {useEffect, useState} from "react";
import LeftNavBar from "@/app/user/{components}/LeftNavBar";
import Contents from "@/app/user/{components}/Contents";
import UserProvider, {AttendInfoI, BoardSummaryI, PointSummaryI} from "@/app/user/{services}/userProvider";
import {System} from "@/app/user/system/{services}/types";

export default function Layout({children}: {children: React.ReactNode & {test:'1'}}) {

    const [boardSummary, setBoardSummary] = useState<BoardSummaryI[]>([]);
    const [attendInfo, setAttendInfo] = useState<AttendInfoI>({} as AttendInfoI);
    const [pointSummary, setPointSummary] = useState<PointSummaryI[]>([]);
    const [roles, setRoles] = React.useState<System.Role[]>([]);
    const [profileImg, setProfileImg] = React.useState<string>('');

    const [isOpen, setIsOpen] = useState<boolean>(false);
    const [isModalMode, setIsModalMode] = React.useState<boolean>(false);

    useEffect(() => {
        if(typeof window === 'undefined') return;

        localStorage.getItem('isModalMode') || localStorage.setItem('isModalMode', JSON.stringify(false));

        const isModalMode = JSON.parse(localStorage.getItem('isModalMode')!);
        setIsModalMode(isModalMode);
    },[isModalMode]);

    return (
        <UserProvider.Provider value={{
            boardSummary, setBoardSummary,
            attendInfo, setAttendInfo,
            pointSummary, setPointSummary,
            roles, setRoles,
            profileImg, setProfileImg
        }}>
            <main className={'flex items-start min-h-screen h-full'}>
                <LeftNavBar {...{isOpen, setIsOpen, isModalMode, setIsModalMode}}/>
                <Contents {...{isOpen, setIsOpen, isModalMode}}>
                    {children}
                </Contents>
            </main>
        </UserProvider.Provider>
    )
}