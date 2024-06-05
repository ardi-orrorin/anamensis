'use client'

import React, {CSSProperties, useMemo} from "react";
import {BlockProps} from "@/app/board/{components}/block/type/Types";

type TodoType = {
    check : boolean;
}
const CheckBlock = (props: BlockProps) => {
    const {
        seq, blockRef,
        value, extraValue,
        isView,
        onChangeValueHandler, onChangeExtraValueHandler,
        onKeyUpHandler, onKeyDownHandler,
        onFocusHandler
    } = props;

    const checked = useMemo(()=>(extraValue as TodoType)?.check || false,[extraValue])

    const containerStyle: CSSProperties = {
        display         : 'flex',
        width           : '100%',
        border          : 'none',
        outline         : 'none',
        wordBreak       : 'break-all',
        padding         : '0.5rem',
        backgroundColor : isView ? '' : 'rgba(230,230,230,0.2)',
        gap             : '0.5rem',
    }

    const commonStyle: CSSProperties = {
    }

    const checkBoxStyle: CSSProperties = {
        outline         : 'none',
        width           :  '1.3rem',
        accentColor     : '#3B82F6',
        borderRadius    : '1rem',
    }

    const checkBoxViewStyle: CSSProperties = {
        display         : 'flex',
        justifyContent  : 'start',
        alignItems      : 'center',
        height          : 'auto',
        fontSize        : '0.8rem',
        width           : '2.3rem',
        color           : checked ? 'blue' : 'red',
    }

    const pStyle: CSSProperties = {
        fontSize        : '0.8rem',
        outline         : 'none',
        padding         : '0 0.5rem',
        border          : '1px black',
        width           : 'auto',
        color           : isView ? checked ? 'blue' : 'red' : 'black',
        wordBreak       : 'break-all',
        letterSpacing   : '0.03rem',
        textDecoration  : checked ? 'line-through' : 'none',
    };

    const inputStyle: CSSProperties = {
        fontSize        : '0.8rem',
        outline         : 'none',
        padding         : 'none',
        border          : 'none',
        width           : '100%',
        letterSpacing   : '0.03rem',
        textDecoration  : checked ? 'line-through' : 'none',
        backgroundColor : 'rgba(230,230,230,0)',
    };

    const onCheckChangeHandler = (e: React.ChangeEvent<HTMLInputElement>) => {
        const data:TodoType  = {check : e.target.checked};
        onChangeExtraValueHandler && onChangeExtraValueHandler(data);

    }

    const onChangeHandler = (e: React.ChangeEvent<HTMLInputElement>) => {
        onChangeValueHandler && onChangeValueHandler(e.target.value);
    }

    return (
        <div id={`block-${seq}`} className={'w-full'}>
            <div style={containerStyle}>
                {
                    !isView
                    ? <input style={{...commonStyle, ...checkBoxStyle}}
                              type={'checkbox'}
                              name={'check'}
                              value={''}
                              checked={checked || false}
                              onChange={onCheckChangeHandler}
                    />
                    : <p style={{...commonStyle, ...checkBoxViewStyle}}>
                        {checked ? '완료' : '진행중'}
                    </p>
                }

                {
                    isView
                    ? <p style={{...commonStyle, ...pStyle}}>
                        {value || ''}
                    </p>
                    : <input style={{...commonStyle, ...inputStyle}}
                           value={value || ''}
                           onChange={onChangeHandler}
                           onKeyUp={onKeyUpHandler}
                           onKeyDown={onKeyDownHandler}
                           onFocus={onFocusHandler}
                           ref={e=> blockRef!.current[seq] = e}
                           aria-roledescription={'todo'}
                    />
                }
            </div>
        </div>
    )
}

export default CheckBlock;