'use client';

import {createContext, useCallback, useContext} from "react";
import {SystemTrigger} from "@/app/system/trigger/{services}/types";

export interface TriggerProviderI {
    days: string[],
    hours: string[],
    minutes: string[],
    convertObjectToCron: (obj: SystemTrigger.CronObj) => string,
    convertCronToObject: ({cron, enabled}: SystemTrigger.Item) => SystemTrigger.CronObj
}

const TriggerContext = createContext({} as TriggerProviderI);

export const TriggerProvider = ({children} : {children: React.ReactNode}) => {

    const days = [...Array.from({length: 31}, (_, i) => i + 1 + ''), 'L', '?'];

    const hours = Array.from({length: 24}, (_, i) => i + '');

    const minutes = Array.from({length: 60}, (_, i) => i + '');


    const convertObjectToCron = useCallback((obj: SystemTrigger.CronObj) => {

        const week = obj.week.length === 0
            ? '?'
            : obj.week.join(',');

        const day = obj.day === '*' && obj.hour === '*' && obj.minute === '*'
            ? '1'
            : obj.week.length === 0
                ? obj.day
                : '?';

        const hour = obj.hour === '*' && obj.minute === '*'
            ? '0'
            : obj.hour;

        const minute = obj.minute === '*' && obj.hour === '*'
            ? '0'
            : obj.minute;

        return `0 ${minute} ${hour} ${day} * ${week}`;

    },[]);

    const convertCronToObject = useCallback(({cron, enabled}: SystemTrigger.Item): SystemTrigger.CronObj => {
        const [second, minute, hour, day, month, week] = cron.split(' ');

        return {
            day,
            hour,
            minute,
            week: week === '?' ? [] : week.split(',') ,
            enabled,
        }
    },[]);

    return (
        <TriggerContext.Provider value={{
            days, hours, minutes,
            convertObjectToCron, convertCronToObject
        }}>
            {children}
        </TriggerContext.Provider>
    )
}

export const useTrigger = () => {
    const context = useContext(TriggerContext);

    if(!context) {
        throw new Error('useTrigger must be used within a TriggerProvider');
    }

    return useContext(TriggerContext);
}


