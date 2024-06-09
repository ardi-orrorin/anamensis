'use client';

import UserInfoWindow, {UserInfoWindowProps} from "@/app/user/{components}/UserInfoWindow";
import {useState} from "react";
import {faWindowRestore} from "@fortawesome/free-solid-svg-icons";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {faWindowMinimize} from "@fortawesome/free-solid-svg-icons/faWindowMinimize";
import AttendInfo from "@/app/user/{components}/AttendInfo";
import BoardSummary from "@/app/user/{components}/BoardSummary";
import PointSummary from "@/app/user/{components}/PointSummary";

export default function Page() {

    const [windowList, setWindowList] = useState<UserInfoWindowProps[]>([
        {winKey: 'win1', title: '출석체크', open: true, children: <AttendInfo/>},
        {winKey: 'win2', title: '최근 작성글', open: true, children: <BoardSummary/>},
        {winKey: 'win3', title: '최근 포인트적립 내역', open: true, children: <PointSummary /> },
        {winKey: 'win4', title: '제목4', open: true, children: "test"},
    ]);

    const onClickHandler = (winKey: string, open: boolean) => {
        const list = windowList.map(e =>
            e.winKey === winKey ? {...e, open} : e
        );
        setWindowList(list);
    }

    const windowToggle = (open: boolean) => {
        setWindowList(windowList.map(e => ({...e, open})));
    }

    return (
        <main className={'flex flex-col gap-3'}>
            <div className={'flex gap-4 flex-wrap duration-300'}>
                {
                    windowList
                        .filter(e=> !e.open)
                        .map((e, i ) => (
                            <button key={'btn'+i}
                                    className={'w-[100px] h-10 bg-gray-400 text-white rounded'}
                                    onClick={() => onClickHandler(e.winKey, true)}
                            >
                                {e.title}
                            </button>
                        ))
                }
                {
                    windowList.filter(e => !e.open).length > 0
                    ? <button className={'w-[50px] h-10 bg-blue-400 text-white rounded'} onClick={()=> windowToggle(true)}>
                          <FontAwesomeIcon icon={faWindowRestore} />
                      </button>
                    : <button className={'w-[50px] h-10 bg-blue-400 text-white rounded'} onClick={()=> windowToggle(false)}>
                          <FontAwesomeIcon icon={faWindowMinimize} />
                      </button>
                }
            </div>
            <div className={'h-full flex gap-4 flex-wrap duration-300'}>
                {
                    windowList.map((e, i ) => (
                        <UserInfoWindow key={`window-${i}`}
                                        onClick={onClickHandler}
                                        {...e}
                        />
                    ))
                }
            </div>
        </main>
    )
}