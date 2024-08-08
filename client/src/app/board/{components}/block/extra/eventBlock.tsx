import {ExpendBlockProps} from "@/app/board/{components}/block/type/Types";
import {EventInput} from "@fullcalendar/core";
import ObjectTemplate from "@/app/board/{components}/block/ObjectTemplate";
import React, {useCallback, useEffect, useMemo, useRef, useState} from "react";
import moment from "moment/moment";
import {colorSet} from "@/app/{services}/constants";

export type EventExtraValue = {
    id      : string;
    groupId : string;
    code    : string;
} extends EventInput ? EventInput : EventInput & EventExtraValue;

const EventBlock = (props: ExpendBlockProps) => {
    const {
        hash, type,
        code, seq,
        value, blockRef,
        isView,
        onChangeExtraValueHandler, onChangeValueHandler,
        onClickDeleteHandler
    } = props;

    const extraValue = props.extraValue as EventExtraValue;

    const [more, setMore] = useState(true);
    const [toggle, setToggle] = useState(true);
    const timeout = useRef<NodeJS.Timeout>();

    const timeFormat = useCallback((reserve?: boolean, ko?: boolean) => {
        const condition = reserve ? !extraValue.allDay : extraValue.allDay;
        if(ko) return condition ? 'YYYY년 MM월 DD일' : 'YYYY년 MM월 DD일 HH:mm';
        return condition ? 'YYYY-MM-DD' : 'YYYY-MM-DDTHH:mm';
    },[extraValue.allDay, isView]);

    const startOfDate = useCallback((date?: string, reverse?: boolean) =>
        moment(date).startOf('days').format(timeFormat(reverse))
        ,[timeFormat]) ;
    const endOfDate = useCallback((date?:string, reverse?: boolean) =>
        moment(date).endOf('days').format(timeFormat(reverse))
        ,[timeFormat]) ;

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
            allDay: false,
            start: startOfDate(),
            end: endOfDate(),
        } as EventExtraValue);
    },[]);

    const onChangeInputHandler = (e: React.ChangeEvent<HTMLInputElement>) => {
        let {name, value} = e.target;

        if(name === 'end' && moment(extraValue.start).isAfter(value)) {
            value = extraValue.start as string;
        }

        if(!onChangeExtraValueHandler) return;

        onChangeExtraValueHandler({...extraValue, [name]: value});
    }

    const onChangeCheckboxHandler = () => {
        if(isView) return;
        if(!onChangeExtraValueHandler) return;

        const value: EventExtraValue = {
            allDay: !extraValue.allDay,
            start: startOfDate(extraValue.start as string, true),
            end: endOfDate(extraValue.end as string, true),
        };

        onChangeExtraValueHandler({...extraValue, ...value} as EventExtraValue);
    }

    const onChangeValue = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
        if(!onChangeValueHandler) return;
        onChangeValueHandler(e.target.value);
    }

    const moreChangeHandler = useCallback(() => {
        setToggle(!toggle)

        if(!more) {
            return setMore(true);
        }

        timeout.current = setTimeout(() => {
            setMore(false)
        },350);
    },[more, toggle]);

    const onClickDelete = () => {
        if(!onClickDeleteHandler) return;
        onClickDeleteHandler(seq);
    }

    const onChaneColorHandler = (color: string, isBackground: boolean) => {
        if (!onChangeExtraValueHandler) return;
        const key = isBackground ? 'backgroundColor' : 'textColor';
        onChangeExtraValueHandler({...extraValue, [key]: color} as EventExtraValue);
    }

    return (
        <ObjectTemplate {...props}>
            <div className={[
                'flex flex-col w-full p-2 gap-2 overflow-y-hidden duration-300',
                toggle ? 'max-h-[1000px]' : 'max-h-20',
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
                        : <input className={'w-full py-1 px-2 outline-0'}
                                 type={'text'}
                                 name={'title'}
                                 maxLength={20}
                                 placeholder={'이벤트 이름 입력하세요 (최대 20자)'}
                                 value={extraValue.title}
                                 onChange={onChangeInputHandler}
                                 ref={el => {
                                     if(isView) return;
                                     blockRef!.current[seq] = el;
                                 }}
                            />
                    }
                </div>
                {
                    more
                    && <>
                        <div className={'flex h-10 items-center gap-4'}>
                            <div className={'flex gap-2'}>
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
                            <div className={'flex gap-2 text-sm items-center'}>
                                <span className={'font-bold'}>
                                  배경색
                                </span>
                                <ColorPicker color={extraValue.backgroundColor as string}
                                             isView={isView || false}
                                             onClick={(color) => onChaneColorHandler(color, true)}
                                />
                            </div>
                            <div className={'flex gap-2 text-sm items-center'}>
                                <span className={'font-bold'}>
                                  글자색
                                </span>
                                <ColorPicker color={extraValue.textColor as string}
                                             isView={isView || false}
                                             onClick={(color) => onChaneColorHandler(color, false)}
                                />
                            </div>
                        </div>
                        <div className={'w-full flex gap-2 justify-start text-sm'}>
                            <div className={'flex gap-2 items-center outline-0'}>
                                <label className={'font-bold'}>시작일 :</label>
                                {
                                    isView
                                        ? <span>{moment(extraValue.start as string).format(timeFormat(false, true))}</span>
                                        : <input className={'p-1 rounded outline-0'}
                                                 type={extraValue.allDay ? 'date' : 'datetime-local'}
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
                                        ? <span>{moment(extraValue.end as string).format(timeFormat(false, true))}</span>
                                        : <input className={'p-1 rounded outline-0'}
                                                 type={extraValue.allDay ? 'date' : 'datetime-local'}
                                                 name={'end'}
                                                 value={extraValue.end as string}
                                                 onChange={onChangeInputHandler}
                                        />
                                }
                            </div>
                        </div>
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

                <div className={'w-full min-h-8 flex gap-3 items-center justify-center'}>
                    <button className={'w-40 h-full rounded-md text-sm text-gray-700 border-solid border border-gray-400 hover:border-gray-700'}
                            onClick={moreChangeHandler}>
                        { more ? '접기' : '더보기' }
                    </button>
                    {
                        !isView
                        && <button className={'w-40 h-full rounded-md text-sm text-gray-700 border-solid border border-gray-400 hover:border-gray-700'}
                                   onClick={onClickDelete}
                        >
                            블록 삭제
                        </button>
                    }
                </div>
            </div>
        </ObjectTemplate>
    )
}


const ColorPicker = ({
    isView,
    color,
    onClick
} : {
    isView: boolean,
    color: string,
    onClick: (color: string) => void
}) => {
    const [toggle, setToggle] = useState(false);

    const isDark = useMemo(() =>
        colorSet.find(item => item.color === color)?.dark
    ,[color]);

    return (
        <div className={[
            'relative flex flex-col w-16',
        ].join(' ')}>

            <button className={'flex w-full p-1 items-center justify-center border border-solid border-gray-400 rounded-md duration-500 hover:border-gray-700'}
                    onClick={() => setToggle(!toggle)}
                    disabled={isView}
            >
                <span className={[
                    'w-full h-4 text-xs px-2 py-1 rounded',
                    isDark ? 'text-white' : 'text-black'
                ].join(' ')}
                      style={{backgroundColor: color || '#000000'}}
                />
            </button>
            <div className={[
                'absolute w-full top-7 flex flex-col overflow-y-auto duration-500',
                toggle ? 'max-h-60' : 'max-h-0',
            ].join(' ')}
                 onMouseLeave={() => setToggle(false)}
            >
                {
                    colorSet.map((color, index) => {
                        return (
                            <button key={'color' + index}
                                    className={'flex w-full min-h-8 items-center justify-center'}
                                    style={{backgroundColor: color.color}}
                                    onClick={() => onClick(color.color)}
                            />
                        )
                    })
                }
            </div>

        </div>
    )

}

export default EventBlock;