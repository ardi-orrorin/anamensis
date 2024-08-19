'use client'

import React, {CSSProperties, useMemo} from "react";
import {ExpendBlockProps} from "@/app/board/{components}/block/type/Types";
import ObjectTemplate from "@/app/board/{components}/block/ObjectTemplate";

type TodoType = {
    check : boolean;
}
const CheckBlock = (props: ExpendBlockProps) => {
    const {
        seq, blockRef,
        value, extraValue,
        isView, hash,
        type,
        onChangeValueHandler, onChangeExtraValueHandler,
        onKeyUpHandler, onKeyDownHandler,
        onFocusHandler,
        onMouseEnterHandler, onMouseLeaveHandler,
    }: ExpendBlockProps = props;

    const checked = useMemo(()=>(extraValue as TodoType)?.check || false,[extraValue])


    const onCheckChangeHandler = (e: React.ChangeEvent<HTMLInputElement>) => {
        const data:TodoType  = {check : e.target.checked};
        onChangeExtraValueHandler && onChangeExtraValueHandler(data);
    }

    const onChangeHandler = (e: React.ChangeEvent<HTMLInputElement>) => {
        onChangeValueHandler && onChangeValueHandler(e.target.value);
    }

    return (
        <ObjectTemplate {...{hash, seq, type, isView, blockRef, onMouseEnterHandler, onMouseLeaveHandler}}>
            <div className={'flex w-full break-all p-2 gap-2'}
                 style={{backgroundColor: isView ? '' : 'rgba(230,230,230,0.2)'}}
            >
                {
                    !isView
                    ? <input className={'w-4 rounded accent-blue-500'}
                             type={'checkbox'}
                             name={'check'}
                             value={''}
                             checked={checked || false}
                             onChange={onCheckChangeHandler}
                             ref={el => {
                                 if(!blockRef?.current) return;
                                 blockRef!.current[seq] = el
                             }}
                    />
                    : <p className={[
                        'w-auto py-0.5 text-sm outline-0 break-all',
                        checked && 'line-through',
                        isView ? checked ? 'text-blue-700' : 'text-red-600' : 'text-black',
                        ].join(' ')}
                    >
                        {checked ? '완료' : '진행중'}
                    </p>
                }

                {
                    isView
                    ? <p className={[
                            'w-auto py-0.5 text-sm outline-0 break-all',
                            checked && 'line-through',
                            isView ? checked ? 'text-blue-700' : 'text-red-600' : 'text-black',
                        ].join(' ')}
                    >
                        {value || ''}
                    </p>
                    : <input className={['w-full text-sm outline-0', checked && 'line-through'].join(' ')}
                             style={{backgroundColor: 'rgba(230,230,230,0)'}}
                             value={value || ''}
                             onChange={onChangeHandler}
                             onKeyUp={onKeyUpHandler}
                             onKeyDown={onKeyDownHandler}
                             onFocus={onFocusHandler}
                             ref={e=> {blockRef!.current[seq] = e}}
                             aria-roledescription={'todo'}
                    />
                }
            </div>
        </ObjectTemplate>
    )
}

export default CheckBlock;