'use client';

import UserInfoWindow from "@/app/user/info/{components}/UserInfoWindow";
import {useMemo, useState} from "react";
import {faWindowRestore} from "@fortawesome/free-solid-svg-icons";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {faWindowMinimize} from "@fortawesome/free-solid-svg-icons/faWindowMinimize";
import AttendInfo from "@/app/user/{components}/AttendInfo";

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
            component: <UserInfoWindow key={'win1'} openKey={'win1'} title={'출석체크'} open={open} setOpen={setOpen}><AttendInfo/></UserInfoWindow>
        },
        {
            id: 2, open: open.win2,
            component: <UserInfoWindow key={'win2'} openKey={'win2'} title={'제목2'} open={open} setOpen={setOpen}>test</UserInfoWindow>
        },
        {
            id: 3, open: open.win3,
            component: <UserInfoWindow key={'win3'} openKey={'win3'} title={'제목3'} open={open} setOpen={setOpen}>test</UserInfoWindow>
        },
        {
            id: 4, open: open.win4,
            component: <UserInfoWindow key={'win4'} openKey={'win4'} title={'제목4'} open={open} setOpen={setOpen}>test</UserInfoWindow>
        },
        {
            id: 5, open: open.win5,
            component: <UserInfoWindow key={'win5'} openKey={'win5'} title={'제목5'} open={open} setOpen={setOpen}>test</UserInfoWindow>
        },
    ]

    const windowToggle = (set: boolean) => {
        setOpen({
            win1: set,
            win2: set,
            win3: set,
            win4: set,
            win5: set,
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
                    0 < sortEle.filter((e)=> !e.open).length
                    ? <button className={'w-[50px] h-10 bg-blue-400 text-white rounded'} onClick={()=> windowToggle(true)}>
                          <FontAwesomeIcon icon={faWindowRestore} />
                      </button>
                    : <button className={'w-[50px] h-10 bg-blue-400 text-white rounded'} onClick={()=> windowToggle(false)}>
                          <FontAwesomeIcon icon={faWindowMinimize} />
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