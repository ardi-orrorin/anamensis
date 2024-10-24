'use client';

import SystemContainer from "@/app/system/{components}/systemContainer";
import React, {useCallback, useEffect, useState} from "react";
import {useQuery} from "@tanstack/react-query";
import systemApiServices from "@/app/system/{services}/apiServices";
import {System} from "@/app/system/{services}/types";
import {SystemTrigger} from "@/app/system/trigger/{services}/types";
import {AxiosError} from "axios";
import SystemToggle from "@/app/system/{components}/SystemToggle";
import {useTrigger} from "@/app/system/trigger/hooks/useTrigger";
import Key = System.Key;
import LoadingSpinner from "@/app/{commons}/LoadingSpinner";

type Props = {
    jobName: string
    headline: string
    description: string
}

const TriggerTemplate = ({jobName, headline, description}: Props) => {
    const {data, refetch} = useQuery(systemApiServices.getPrivateSystemConfig());

    const {
        days, hours, minutes,
        convertObjectToCron, convertCronToObject
    } = useTrigger();


    const [loading, setLoading] = useState(false);
    const [response, setResponse] = useState({} as System.StatusResponse);
    const [cron, setCron] = useState({
        day: '*',
        hour: '*',
        minute: '*',
        week: [],
        enabled: false,
    } as SystemTrigger.CronObj);

    useEffect(() => {
        if(data?.trigger){
            const cron = convertCronToObject(data.trigger[jobName]);
            setCron({...cron, enabled: data.trigger[jobName].enabled});
        }
    }, [data?.trigger]);

    const onChangeHandler = (e: React.ChangeEvent<HTMLSelectElement>) => {
        const {name, value} = e.target;

        if(value === '*' && name === 'day'){
            setCron({...cron, [name]: value, week: []});
            return;
        }

        setCron({...cron, [name]: value});
    }

    const onChangeWeekHandler = (e: React. MouseEvent<HTMLButtonElement>) => {
        const {value} = e.target as HTMLButtonElement;

        const week = cron.week.includes(value) ? cron.week.filter((v) => v !== value) : [...cron.week, value];

        if(week.length == 7 || week.length == 0) {
            setCron({...cron, day: '*', week: []});
            return;
        }

        setCron({...cron, day: '?', week});
    }

    const onSaveHandler = async () => {
        setLoading(true);

        const body = {
            key: Key.TRIGGER,
            value: {
                [jobName]: {
                    cron: convertObjectToCron(cron),
                    enabled: cron.enabled,
                }
            }
        } as System.Request<SystemTrigger.Trigger>

        try {
            await systemApiServices.save({body});

            await refetch();

            setResponse({status: 'success', message: '저장되었습니다.'});

        } catch (e) {
            const err = e as AxiosError;
            console.log(err.response?.data);

            setResponse({status: 'error', message: err.response?.data as string});
        } finally {
            setLoading(false);
        }
    }

    const onCancelHandler = useCallback(() => {
        const cron = convertCronToObject(data.trigger[jobName]);
        setCron(cron);
    },[data?.trigger]);

    // todo: add initHandler


    return (
        <SystemContainer {...{headline}}>
            <div className={'list-disc text-sm'}>
                <li>{description}</li>
            </div>
            <div className={'flex flex-col gap-2'}>
                <div className={'flex gap-2'}>
                    <WeekButton {...{name: '월', value: 'MON', onClick: onChangeWeekHandler, cron}} />
                    <WeekButton {...{name: '화', value: 'TUE', onClick: onChangeWeekHandler, cron}} />
                    <WeekButton {...{name: '일', value: 'SUN', onClick: onChangeWeekHandler, cron}} />
                    <WeekButton {...{name: '수', value: 'WED', onClick: onChangeWeekHandler, cron}} />
                    <WeekButton {...{name: '목', value: 'THU', onClick: onChangeWeekHandler, cron}} />
                    <WeekButton {...{name: '금', value: 'FRI', onClick: onChangeWeekHandler, cron}} />
                    <WeekButton {...{name: '토', value: 'SAT', onClick: onChangeWeekHandler, cron}} />
                </div>
                <div className={'flex gap-2 items-center'}>
                    <SelectBox {...{name: 'day', initText: '매일', options: days, value: cron.day, onChangeHandler}}/>
                    <SelectBox {...{name: 'hour', initText: '매시간', options: hours, value: cron.hour, onChangeHandler}}/>
                    <SelectBox {...{name: 'minute', initText: '매분', options: minutes, value: cron.minute, onChangeHandler}}/>
                </div>
                <div>
                    <SystemToggle toggle={cron.enabled} onClick={() => setCron({...cron, enabled: !cron.enabled})}/>
                </div>
            </div>
            <div className={'flex gap-2 text-sm items-center'}>
                <button className={'bg-blue-500 text-white w-14 py-1.5 disabled:bg-gray-300 disabled:text-gray-700'}
                        onClick={onSaveHandler}
                        disabled={loading}
                >
                    {
                        loading
                            ? <LoadingSpinner size={10} />
                            : '저장'
                    }
                </button>
                <button className={'bg-red-500 text-white w-14 py-2 disabled:bg-gray-300 disabled:text-gray-700'}
                        onClick={onCancelHandler}
                        disabled={loading}
                >
                    {
                        loading
                            ? <LoadingSpinner size={10} />
                            : '취소'
                    }
                </button>
                <button className={'bg-green-600 text-white w-20 py-2 disabled:bg-gray-300 disabled:text-gray-700'}
                        onClick={() => console.log(convertObjectToCron(cron))}
                        disabled={loading}
                >
                    {
                        loading
                            ? <LoadingSpinner size={10} />
                            : '초기화'
                    }
                </button>
                {
                    loading && !response?.status
                        ? <span className={'text-blue-600 text-sm'}>저장중</span>
                        : response?.status === 'success'
                            ? <span className={'text-blue-600 text-sm'}>{response?.message}</span>
                            : <span className={'text-red-600 text-sm'}>{response?.message}</span>
                }
            </div>
        </SystemContainer>
    )
}

const WeekButton = ({
    value, onClick, cron, name
}: {
    name: string,
    value: string,
    onClick: (e: React.MouseEvent<HTMLButtonElement>) => void,
    cron    : SystemTrigger.CronObj
}) => {
    return (
        <button className={`w-12 h-8 text-sm ${cron.week.includes(value) ? 'bg-blue-500 text-white' : 'bg-gray-300 text-gray-700'}`}
                value={value}
                onClick={onClick}
        >
            {name}
        </button>
    )
}

const SelectBox = ({
    name, value,
    initText, options = [],
    onChangeHandler
}: {
    name            : string;
    value           : string;
    initText        : string;
    options         : string[];
    onChangeHandler : (e: React.ChangeEvent<HTMLSelectElement>) => void
}) => {
    return (
        <div className="relative inline-block w-20">
            <select
                className="block appearance-none w-full bg-white text-sm border border-gray-300 hover:border-gray-500 px-4 py-2 leading-tight focus:outline-none focus:shadow-outline"
                name={name}
                value={value}
                onChange={onChangeHandler}
            >
                <option value={'*'}>{initText}</option>
                {
                    options.map((option, index) => (
                        <option key={index}
                                value={option}
                        >
                            {option === '?' ? '요일' : option}
                        </option>
                    ))
                }
            </select>
            <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-700">
                <svg className="fill-current h-4 w-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20">
                    <path d="M5.516 7.548L10 12.032l4.484-4.484L16.451 8l-6.451 6.451L3.55 8z"/>
                </svg>
            </div>
        </div>
    )
}

export default React.memo(TriggerTemplate, (prevProps, nextProps) => {
    return prevProps.jobName === nextProps.jobName;
});