import {ExpendBlockProps} from "@/app/board/{components}/block/type/Types";
import FullCalendar from "@fullcalendar/react";
import dayGridPlugin from '@fullcalendar/daygrid'
import timeGridPlugin from '@fullcalendar/timegrid'
import listGridPlugin from '@fullcalendar/list'
import interactionPlugin from "@fullcalendar/interaction"
import {CalendarOptions, EventChangeArg, EventInput, ToolbarInput} from "@fullcalendar/core";
import {useCallback, useContext, useEffect, useMemo, useRef, useState} from "react";
import BoardProvider from "@/app/board/{services}/BoardProvider";
import {blockTypeFlatList} from "@/app/board/{components}/block/list";
import {useRouter} from "next/navigation";
import {EventExtraValue} from "@/app/board/{components}/block/extra/eventBlock";
import moment from "moment/moment";
import koLocale from '@fullcalendar/core/locales/ko';

const CalenderBlock = (props: ExpendBlockProps) => {
    const {
        hash, type,
        code, blockRef,
        isView,
    } = props;

    const router = useRouter();

    const { board, setBoard } = useContext(BoardProvider);

    const [more, setMore] = useState<boolean>(true);
    const [viewCalender, setViewCalender] = useState<boolean>(true);

    const setTimer = useRef<NodeJS.Timeout>();

    useEffect(()=>{
        return () => {
            if(setTimer.current) clearTimeout(setTimer.current)
        }
    },[])

    const events = useMemo(()=> {
        const subBlocks = blockTypeFlatList.find(item => item.code === code)?.subBlock;
        if(!subBlocks) return [];
        const blockCodes = subBlocks.map(item => item.code);
        const blockValues = board.data.content.list.filter(item => blockCodes.includes(item.code));
        return blockValues.map(item => item.extraValue as EventInput).filter(item => item.title)
    },[board]);

    const onChangeView = useCallback(()=> {
        setMore(!more)
        if(more) {
            setTimer.current = setTimeout(() => {
                setViewCalender(!viewCalender)
            }, 600)
        } else {
            setViewCalender(!viewCalender)
        }
    },[isView, viewCalender]);

    const onChangeEvent = useCallback((event: EventChangeArg) => {
        const timeFormat = event.event.allDay ? 'YYYY-MM-DD' : 'YYYY-MM-DDTHH:mm';

        const changeEvent: EventExtraValue = {
            id     : event.event.id,
            code   : event.event.extendedProps.code,
            title  : event.event.title,
            allDay : event.event.allDay,
            start  : moment(event.event.start).format(timeFormat),
            end    : moment(event.event.end || event.event.start).format(timeFormat),
        }

        board.data.content.list.map(item => {
            if(item.hash === event.event.id) {
                item.extraValue = changeEvent;
            }
            return item;
        });
        setBoard({...board});
    },[board, isView]);

    return (
        <div id={`block-${hash}`}
             className={[
                 'w-full flex flex-col justify-start overflow-y-hidden duration-700',
                 more ? 'max-h-[1000px] gap-4' : 'max-h-8',
             ].join(' ')}
             aria-roledescription={type}
             ref={el => {
                 if(!blockRef?.current) return ;
                 blockRef!.current[props.seq] = el
             }}
        >
            {
                viewCalender
                && <FullCalendar editable={!isView}
                                 locale={koLocale}
                                 eventClick={(click) => {
                                    router.push(`#block-${click.event.id}`)
                                 }}
                                 eventChange={onChangeEvent}
                                 {...{headerToolbar, plugins, events, options}}
                />
            }
            <div className={'w-full h-8 flex flex-col items-center justify-center'}>
                <button className={'w-40 h-full bg-white rounded-md text-sm text-gray-500'}
                        onClick={onChangeView}>
                     캘린더 { more ? '접기' : '더보기' }
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

export default CalenderBlock;