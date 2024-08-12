'use client';

import React, {useCallback, useEffect, useState} from "react";
import apiCall from "@/app/{commons}/func/api";
import {Root} from "@/app/{services}/types";
import {faBell} from "@fortawesome/free-solid-svg-icons";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import moment from "moment/moment";
import {useRouter} from "next/navigation";
import {AxiosError} from "axios";
import {useQuery, useQueryClient} from "@tanstack/react-query";
import rootApiService from "@/app/{services}/rootApiService";

const ScheduleAlert = () => {

    const {data: alert, refetch} = useQuery(rootApiService.scheduleAlert());
    const [toggle ,setToggle] = useState<boolean>(false);
    const router = useRouter();

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
        try {
            await apiCall({
                method: 'GET',
                path: `/api/schedule/alert/${sch.id}`,
            })

            setToggle(false);

            await refetch();
            router.push(`/board/${sch.boardId}#block-${sch.hashId}`);
        } catch (e) {
            const err = e as AxiosError;
            console.error(e);
        }

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
                'absolute z-50 top-12 w-80 flex flex-col bg-white  text-xs border-solid border-y-main rounded shadow-md overflow-y-auto',
                toggle ? 'border-y-2' : 'border-y-0'
            ].join(' ')}>
                <div className={[
                    ' duration-300',
                    toggle ? 'max-h-60' : 'max-h-0 '
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
                                    className={'w-full min-h-9 p-2 flex flex-col justify-center items-start gap-1 text-black hover:bg-blue-400 hover:text-white duration-300'}
                                    onClick={() => onClickAlert(sch)}
                            >
                                <div className={'w-full flex justify-start'}>
                                <span className={'line-clamp-1'}>
                                    {sch.title}
                               </span>
                                </div>
                                <div className={'w-full flex justify-between gap-1'}>
                                    <div className={'flex'}>
                                        <span>(</span>
                                        <span className={'max-w-32 line-clamp-1'}>
                                        {sch.BoardTitle}
                                    </span>
                                        <span>)</span>
                                    </div>
                                    <span>
                                    {alertText(sch.alertTime)}
                                </span>
                                </div>
                            </button>
                        ))
                    }
                </div>
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