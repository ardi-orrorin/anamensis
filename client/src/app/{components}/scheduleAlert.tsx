'use client';

import React, {useCallback, useEffect, useState} from "react";
import apiCall from "@/app/{commons}/func/api";
import {Root} from "@/app/{services}/types";
import {faBell} from "@fortawesome/free-solid-svg-icons";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import moment from "moment/moment";
import {useRouter} from "next/navigation";

const ScheduleAlert = () => {

    const [alert, setAlert] = useState<Root.ScheduleAlert[]>([]);
    const [toggle ,setToggle] = useState<boolean>(false);
    const router = useRouter();

    useEffect(()=>{
        apiCall<Root.ScheduleAlert[]>({
            method: 'GET',
            path: '/api/schedule/alert',
            isReturnData: true
        })
        .then(res => {
            setAlert(res);
        });
    },[]);

    const alertText = useCallback((alertTime: string)=> {
        const prevSecond = moment().diff(moment(alertTime), 'seconds');

        if(prevSecond < 60)       return `${prevSecond}초 전`
        if(prevSecond < 3600)     return `${Math.floor(prevSecond/60)}분 전`
        if(prevSecond < 86400)    return `${Math.floor(prevSecond/3600)}시간 전`
        if(prevSecond < 604800)   return `${Math.floor(prevSecond/86400)}일 전`
        if(prevSecond < 2592000)  return `${Math.floor(prevSecond/604800)}주 전`
        if(prevSecond < 31536000) return `${Math.floor(prevSecond/2592000)}달 전`

    },[])

    const onClickAlert = useCallback(async (sch: Root.ScheduleAlert) => {
        apiCall({
            method: 'GET',
            path: `/api/schedule/alert/${sch.id}`,
        })
        .then((_) => {
            setToggle(false);
        });

        router.push(`/board/${sch.boardId}#block-${sch.hashId}`);

        const list = alert.filter(v => v.id !== sch.id);
        setAlert(list);

    },[alert]);

    return (
        <div className={'relative h-full flex flex-col items-center gap-2'}>
            <button className={'relative w-10 h-10 px-1.5'}
                    onClick={()=>setToggle(!toggle)}
            >
                <FontAwesomeIcon icon={faBell} />
                <span className={'absolute w-4 h-4 top-0 right-0 bg-red-500 text-white rounded-full flex items-center justify-center text-xs'}>
                    {alert.length}
                </span>
            </button>
            <div className={[
                'absolute z-50 top-12 w-60 flex flex-col duration-300 bg-white overflow-y-auto text-xs border-solid border-y-amber-500 rounded shadow-md',
                toggle ? 'max-h-60 border-y-2' : 'max-h-0 '
            ].join(' ')}>
                {
                    alert.length === 0
                    && <button className={'w-full min-h-9 px-2 flex justify-center items-center gap-1 text-black border-y border-solid border-gray-400'}
                               onClick={() => setToggle(!toggle)}
                    >
                        알림이 없습니다.
                    </button>
                }
                {
                    alert.length > 0
                    && alert.map((sch,i)=> (
                        <button key={'schAlert'+ i}
                                className={'w-full min-h-9 px-2 flex justify-between items-center gap-1 text-black hover:bg-yellow-400 hover:text-white duration-300'}
                                onClick={() => onClickAlert(sch)}
                        >
                            <div className={'flex gap-1'}>
                                <span>
                                    {sch.title}
                                </span>
                                <div className={'flex'}>
                                    <span>(</span>
                                    <span className={'max-w-32 line-clamp-1'}>
                                        {sch.BoardTitle}
                                    </span>
                                    <span>)</span>
                                </div>
                            </div>
                            <span>
                                {alertText(sch.alertTime)}
                            </span>
                        </button>
                   ))
                }
            </div>
            {
                toggle
                && <div className={'fixed top-0 left-0 w-full h-full z-10'}
                        onClick={()=>setToggle(false)}
                />
            }
        </div>
    )
}

export default React.memo(ScheduleAlert);