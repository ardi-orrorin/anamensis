'use client';

import UserInfoWindow from "@/app/user/info/{components}/UserInfoWindow";
import {useEffect, useMemo, useState} from "react";
import {sort} from "next/dist/build/webpack/loaders/css-loader/src/utils";
import {faWindowRestore} from "@fortawesome/free-solid-svg-icons";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";

export type OpenType = {
    win1: boolean,
    win2: boolean,
    win3: boolean,
    win4: boolean,
    win5: boolean,
    [key: string]: boolean
}
export default function Page() {

    const [open, setOpen] = useState<OpenType>({
        win1: true,
        win2: true,
        win3: true,
        win4: true,
        win5: true,
    });

    const ele = [
        {
            id: 1, open: open.win1,
            component: <UserInfoWindow openKey={'win1'} title={'제목1'} open={open} setOpen={setOpen}>test</UserInfoWindow>
        },
        {
            id: 2, open: open.win2,
            component: <UserInfoWindow openKey={'win2'} title={'제목2'} open={open} setOpen={setOpen}>test</UserInfoWindow>
        },
        {
            id: 3, open: open.win3,
            component: <UserInfoWindow openKey={'win3'} title={'제목3'} open={open} setOpen={setOpen}>test</UserInfoWindow>
        },
        {
            id: 4, open: open.win4,
            component: <UserInfoWindow openKey={'win4'} title={'제목4'} open={open} setOpen={setOpen}>test</UserInfoWindow>
        },
        {
            id: 5, open: open.win5,
            component: <UserInfoWindow openKey={'win5'} title={'제목5'} open={open} setOpen={setOpen}>test</UserInfoWindow>
        },
    ]

    const openAll = () => {
        setOpen({
            win1: true,
            win2: true,
            win3: true,
            win4: true,
            win5: true,
        })
    }

    const sortEle = useMemo(() => {
         return ele.sort((a, b) => a.id - b.id)
                   .sort((a, b) => (a.open ? -1 : 1) - (b.open ? -1 : 1))
    },[open])

    return (
        <main className={'flex flex-col gap-3'}>
            <div className={'flex gap-4 flex-wrap duration-300'}>
                {
                    sortEle.filter((e)=> !e.open).map((e) => (
                        {...e.component}
                    ))
                }
                {
                    Object.keys(open).length === sortEle.filter((e)=> !e.open).length &&
                    <button className={'w-[120px] h-10 bg-blue-400 text-white'} onClick={openAll}>
                      <FontAwesomeIcon icon={faWindowRestore} />
                      &nbsp;<span>Open All</span>
                    </button>
                }
            </div>
            <div className={'flex  gap-4 flex-wrap duration-300'}>
                {
                   sortEle.filter((e)=> e.open).map((e) => (
                        {...e.component}
                   ))
                }
            </div>
        </main>
    )
}