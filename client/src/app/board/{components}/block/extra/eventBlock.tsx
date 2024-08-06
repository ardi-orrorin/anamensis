import {ExpendBlockProps} from "@/app/board/{components}/block/type/Types";
import {EventInput} from "@fullcalendar/core";
import ObjectTemplate from "@/app/board/{components}/block/ObjectTemplate";
import React, {useCallback, useEffect, useMemo, useRef, useState} from "react";
import moment from "moment/moment";
import boardProvider from "@/app/board/{services}/BoardProvider";

export type EventExtraValue = {
    id      : string;
    groupId : string;
    code    : string;
    title   : string;
    date    : string;
    allDay  : boolean;
    start?  : string;
    end?    : string;
} extends EventInput ? EventInput : EventInput & EventExtraValue;

const EventBlock = (props: ExpendBlockProps) => {

    const {
        hash, type,
        code, seq,
        value, blockRef,
        isView,
        onChangeExtraValueHandler, onChangeValueHandler,
    } = props;

    const [more, setMore] = useState(true);
    const [toggle, setToggle] = useState(true);
    const timeout = useRef<NodeJS.Timeout>();

    useEffect(()=>{
        return () => {
            if(timeout.current) clearTimeout(timeout.current)
        }
    },[]);

    useEffect(()=> {
        if(extraValue.id && extraValue.title) return;
        if(!onChangeExtraValueHandler) return;
        onChangeExtraValueHandler({
            id: hash,
            groupId: '',
            code,
            title: '',
            date: '',
            allDay: false,
            start: moment().startOf('days').format('YYYY-MM-DDTHH:mm'),
            end: moment().endOf('days').format('YYYY-MM-DDTHH:mm'),
        } as EventExtraValue);
    },[]);

    const extraValue = props.extraValue as EventExtraValue;

    const onChangeInputHandler = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
        const {name, value} = e.target;
        if(!onChangeExtraValueHandler) return;
        onChangeExtraValueHandler({...extraValue, [name]: value});
    },[extraValue, isView]);

    const onChangeCheckboxHandler = useCallback(() => {
        if(!onChangeExtraValueHandler) return;
        onChangeExtraValueHandler({...extraValue, allDay: !extraValue.allDay} as EventExtraValue);
    },[extraValue, isView]);

    const onChangeValue = useCallback((e: React.ChangeEvent<HTMLTextAreaElement>) => {
        if(!onChangeValueHandler) return;
        onChangeValueHandler(e.target.value);
    },[isView]);

    const moreChangeHandler = () => {
        setToggle(!toggle)
        if(more) {
            timeout.current = setTimeout(() => {
                setMore(false)
            },350);
        } else {
            setMore(true);
        }
    }

    return (
        <ObjectTemplate {...props}>
            <div className={[
                'flex flex-col w-full p-2 gap-2 overflow-y-hidden duration-300',
                toggle ? 'max-h-[1000px]' : 'max-h-16',
            ].join(' ')}
                 style={{backgroundColor: 'rgba(230,230,230,0.2)'}}
            >
                <div className={'w-full text-sm'}>
                    {
                        isView
                        ? <div className={'flex gap-1'}>
                            <span className={'font-bold'}>
                                이벤트 :
                            </span>
                            <span>{extraValue.title}</span>
                        </div>
                        : <input className={'w-full p-1 outline-0'}
                                 type={'text'}
                                 name={'title'}
                                 placeholder={'이벤트 이름 입력하세요'}
                                 value={extraValue.title}
                                 onChange={onChangeInputHandler}
                            />
                    }
                </div>
                {
                    more
                    && <>
                        <div className={'flex h-10 items-center gap-2'}>
                          <label className={'text-sm font-bold'}>하루종일</label>
                          <input type="checkbox"
                                 className={"sr-only peer hidden"}
                                 checked={extraValue.allDay}
                          />
                          <div className="relative w-11 h-6 ray-200 peer-focus:outline-none peer-focus:ring-4
                                        peer-focus:ring-blue-300 dark:peer-focus:ring-blue-800 rounded-full peer dark:bg-gray-300
                                        peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full
                                        peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:start-[2px]
                                        after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5
                                        after:transition-all dark:border-gray-400 peer-checked:bg-main"
                               onClick={onChangeCheckboxHandler}
                          />
                        </div>
                            {
                                extraValue.allDay
                                    ? <div className={'flex gap-2 items-center outline-0 text-sm'}>
                                        <label className={'font-bold'}>날짜 :</label>
                                        {
                                            isView
                                                ? <span>{moment(extraValue.date).format('YYYY-MM-DD')}</span>
                                                : <input className={'p-1 rounded outline-0'}
                                                         type={'date'}
                                                         name={'date'}
                                                         value={extraValue.date as string}
                                                         onChange={onChangeInputHandler}
                                                />
                                        }
                                    </div>
                                    : <div className={'w-full flex gap-2 justify-start text-sm'}>
                                        <div className={'flex gap-2 items-center outline-0'}>
                                            <label className={'font-bold'}>시작일 :</label>
                                            {
                                                isView
                                                    ? <span>{moment(extraValue.start as string).format('YYYY년 MM월 DD일 HH:mm')}</span>
                                                    : <input className={'p-1 rounded outline-0'}
                                                             type={'datetime-local'}
                                                             name={'start'}
                                                             value={extraValue.start as string}
                                                             onChange={onChangeInputHandler}
                                                    />
                                            }
                                        </div>
                                        <div className={'flex gap-2 items-center'}>
                                            <label className={'font-bold'}>종료일 :</label>
                                            {
                                                isView
                                                    ? <span>{moment(extraValue.end as string).format('YYYY년 MM월 DD일 HH:mm')}</span>
                                                    : <input className={'p-1 rounded outline-0'}
                                                             type={'datetime-local'}
                                                             name={'end'}
                                                             value={extraValue.end as string}
                                                             onChange={onChangeInputHandler}
                                                    />
                                            }
                                        </div>
                                    </div>
                            }
                        <div className={'flex flex-col gap-2 text-sm'}>
                          <label className={'font-bold'}>내용</label>
                            {
                                isView
                                    ? <p className={'whitespace-pre-line outline-0'}>
                                        { value }
                                    </p>
                                    : <textarea className={'w-full p-2 outline-0 resize-none rounded'}
                                                name={'content'}
                                                placeholder={'이벤트 내용을 입력하세요'}
                                                rows={5}
                                                value={value}
                                                onChange={onChangeValue}
                                    />
                            }
                        </div>
                    </>
                }

                <div className={'w-full min-h-8 flex flex-col items-center justify-center'}>
                    <button className={'w-40 h-full rounded-md text-sm text-gray-700'}
                            onClick={moreChangeHandler}>
                        { more ? '접기' : '더보기' }
                    </button>
                </div>
            </div>
        </ObjectTemplate>
    )
}

export default EventBlock;