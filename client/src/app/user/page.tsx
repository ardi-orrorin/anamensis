'use client';

import UserInfoWindow, {UserInfoWindowProps} from "@/app/user/{components}/UserInfoWindow";
import {useCallback, useMemo, useState} from "react";
import {faWindowRestore} from "@fortawesome/free-solid-svg-icons";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {faWindowMinimize} from "@fortawesome/free-solid-svg-icons/faWindowMinimize";
import dynamic from "next/dynamic";
import LoadingSpinner from "@/app/{commons}/LoadingSpinner";


const DynamicAttendInfo = dynamic(() => import('@/app/user/{components}/AttendInfo'),{
    loading: () => <Loading/>,
    ssr: false
});
const DynamicBoardSummary = dynamic(() => import('@/app/user/{components}/BoardSummary'),{
    loading: () => <Loading/>,
    ssr: false
});
const DynamicPointSummary = dynamic(() => import('@/app/user/{components}/PointSummary'),{
    loading: () => <Loading/>,
    ssr: false
});

const Loading = () => <div className={'w-full h-full flex justify-center items-center'}>
    <LoadingSpinner size={40} />
</div>;

export default function Page() {

    const [windowList, setWindowList] = useState<UserInfoWindowProps[]>([
        {winKey: 'win1', title: '출석체크', open: true, children: <DynamicAttendInfo/>},
        {winKey: 'win2', title: '최근 작성글', open: true, children: <DynamicBoardSummary/>},
        {winKey: 'win3', title: '최근 포인트적립 내역', open: true, children: <DynamicPointSummary /> },
    ]);


    const onClickHandler = (winKey: string, open: boolean) => {
        const list = windowList.map(e =>
            e.winKey === winKey ? {...e, open} : e
        );
        setWindowList(list);
    }

    const windowToggle = useCallback((open: boolean) => {
        setWindowList(windowList.map(e => ({...e, open})));
    },[windowList]);

    const minimizeWindows = useMemo(() =>
            windowList
                .filter(e=> !e.open)
                .map((e, i ) => (
                    <button key={'btn'+i}
                            className={'w-auto px-4 h-10 bg-gray-400 text-sm whitespace-pre-wrap text-white rounded'}
                            onClick={() => onClickHandler(e.winKey, true)}
                    >
                        {e.title}
                    </button>
                ))
    ,[windowList])

    const minimizedSize = useMemo(() => windowList.filter(e => !e.open).length > 0, [windowList]);

    const toggle = useMemo(() =>
        <button className={'w-[50px] h-10 bg-main text-white rounded'}
                onClick={()=> windowToggle(minimizedSize)}
                data-testid={'toggle-window'}
        >
            <FontAwesomeIcon icon={minimizedSize ? faWindowRestore : faWindowMinimize} />
        </button>
    ,[windowList]);

    const maximizeWindows = useMemo(() =>
        windowList.map((e, i ) => (
            <UserInfoWindow key={`window-${i}`}
                            onClick={onClickHandler}
                            {...e}
            />
        ))
    ,[windowList])

    return (
        <main className={'flex flex-col gap-3'}>
            <div className={'flex gap-4 flex-wrap duration-300'}
                 data-testid={'minimize-window'}
            >
                { minimizeWindows }
                { toggle }
            </div>
            <div className={'h-full flex gap-4 flex-wrap duration-300'}>
                { maximizeWindows }
            </div>
        </main>
    )
}