'use client';

import React, {useEffect, useState} from "react";
import ModalProvider, {ModalI} from "@/app/user/{services}/modalProvider";
import LeftNavBar from "@/app/user/{components}/LeftNavBar";
import Contents from "@/app/user/{components}/Contents";
import ModalBackground from "@/app/user/{components}/ModalBackground";
import UserProvider, {AttendInfoI, BoardSummaryI, PointSummaryI} from "@/app/user/{services}/userProvider";
import useSWR, {preload} from "swr";
import apiCall from "@/app/{commons}/func/api";
import {RoleType} from "@/app/user/system/{services}/types";


export default function Layout({children}: {children: React.ReactNode & {test:'1'}}) {

    const [boardSummary, setBoardSummary] = useState<BoardSummaryI[]>([]);
    const [attendInfo, setAttendInfo] = useState<AttendInfoI>({} as AttendInfoI);
    const [pointSummary, setPointSummary] = useState<PointSummaryI[]>([]);
    const [roles, setRoles] = React.useState<RoleType[]>([]);

    const [isOpen, setIsOpen] = useState<boolean>(false);
    const [modal, setModal] = useState<ModalI>({} as ModalI);
    const [isModalMode, setIsModalMode] = React.useState<boolean>(false);

    useEffect(() => {
        if(typeof window === 'undefined') return;

        localStorage.getItem('isModalMode') || localStorage.setItem('isModalMode', JSON.stringify(false));

        const isModalMode = JSON.parse(localStorage.getItem('isModalMode')!);
        setIsModalMode(isModalMode);
    },[isModalMode]);

    useSWR('/user/attend', async () => {
        return await apiCall<AttendInfoI>({
            path: "/api/user/attend",
            method: "GET",
            isReturnData: true,
        })
        .then((data) => {
            setAttendInfo(data);
        });
    })

    preload('/api/board/summary', async () => {
        return await apiCall<BoardSummaryI[]>({
            path: "/api/board/summary",
            params: {page:1, size: 8},
            method: "GET",
            isReturnData: true
        })
    })
    .then((data) => {
        setBoardSummary(data);
    });

    preload('/api/user/point-history/summary', async () => {
        return await apiCall<PointSummaryI[]>({
            path: "/api/user/point-history/summary",
            params: {page:1, size: 8},
            method: "GET",
            isReturnData: true,
        })
    })
    .then((data) => {
        setPointSummary(data);
    });


    return (
        <UserProvider.Provider value={{
            boardSummary, setBoardSummary,
            attendInfo, setAttendInfo,
            pointSummary, setPointSummary,
            roles, setRoles
        }}>
            <main className={'flex items-start min-h-screen h-auto'}>
                <ModalProvider.Provider value={{modal, setModal}}>
                    <LeftNavBar {...{isOpen, setIsOpen, isModalMode, setIsModalMode}}/>
                    <Contents {...{isOpen, setIsOpen, isModalMode}}>
                        {children}
                    </Contents>
                    {
                        modal.component
                    }
                    <ModalBackground isOpen={modal.isOpen} />
                </ModalProvider.Provider>
            </main>
        </UserProvider.Provider>
    )
}