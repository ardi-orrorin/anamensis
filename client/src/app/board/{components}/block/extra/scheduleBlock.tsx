import {ExpendBlockProps} from "@/app/board/{components}/block/type/Types";
import FullCalendar from "@fullcalendar/react";
import dayGridPlugin from '@fullcalendar/daygrid'
import timeGridPlugin from '@fullcalendar/timegrid'
import listGridPlugin from '@fullcalendar/list'
import interactionPlugin from "@fullcalendar/interaction"
import {ButtonTextCompoundInput, CalendarOptions, EventInput, ToolbarInput} from "@fullcalendar/core";
import {useCallback, useContext, useEffect, useRef, useState} from "react";
import BoardProvider from "@/app/board/{services}/BoardProvider";

export type EventExtraValue = {
    code: string;
    title: string;
    date: string;
    allDay?: boolean;
    start?: string;
    end?: string;
} extends EventInput ? EventInput : EventInput & EventExtraValue;

const ScheduleBlock = (props: ExpendBlockProps) => {
    const {
        hash, type,
        code, seq,
        value, blockRef,
    } = props;

    const { board } = useContext(BoardProvider);

    const [isView, setIsView] = useState<boolean>(true);
    const [viewCalender, setViewCalender] = useState<boolean>(true);

    const setTimer = useRef<NodeJS.Timeout>();

    useEffect(()=>{
        return () => {
            if(setTimer.current) clearTimeout(setTimer.current)
        }
    },[])

    const [events, setEvents] = useState<EventInput[]>([
        { title: 'event 1', date: '2024-08-01 10:00:00'},
        { title: 'event 2', date: '2024-08-02'}
    ])

    const onChangeView = useCallback(()=> {
        setIsView(!isView)
        if(isView) {
            setTimer.current = setTimeout(() => {
                setViewCalender(!viewCalender)
            }, 600)
        } else {
            setViewCalender(!viewCalender)
        }
    },[isView, viewCalender]);


    return (
        <div id={`block-${hash}`}
             className={[
                 'w-full flex flex-col justify-start overflow-y-hidden duration-700',
                 isView ? 'max-h-[1000px] gap-4' : 'max-h-8',
             ].join(' ')}
             aria-roledescription={type}
             ref={el => {
                 if(!blockRef?.current) return ;
                 blockRef!.current[props.seq] = el
             }}
        >
            {
                viewCalender
                && <FullCalendar eventAdd={(add) => {
                                     console.log(add)
                                 }}
                                 editable={true}
                                 eventChange={(change) => {
                                     console.log(change)
                                 }}
                                 {...{headerToolbar, buttonText, plugins, events, options}}
                />
            }
            <div className={'w-full h-8 flex flex-col items-center justify-center'}>
                <button className={'w-40 h-full bg-white rounded-md text-sm text-gray-500'}
                        onClick={onChangeView}>
                     캘린더 { isView ? '접기' : '더보기' }
                </button>
            </div>
        </div>
    )
}

const options: CalendarOptions = {
    initialView: 'dayGridMonth',
    locale: 'ko',
    selectable: true,
    selectMirror: true,
    dayMaxEvents: true,
    weekends: true,
    editable: true,
    droppable: true,

}

const headerToolbar: ToolbarInput = {
    left: 'prev,next today',
    center: 'title',
    right: 'dayGridMonth,timeGridWeek,timeGridDay,listYear'
}

const plugins = [
    dayGridPlugin, timeGridPlugin
    , listGridPlugin, interactionPlugin
]

const buttonText: ButtonTextCompoundInput = {
    today: '오늘',
    month: '월',
    week: '주',
    day: '일',
    list: '목록',
    year: '년',
}

export default ScheduleBlock;