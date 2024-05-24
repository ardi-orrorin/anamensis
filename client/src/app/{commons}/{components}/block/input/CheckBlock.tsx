'use client'

import React, {CSSProperties, useMemo} from "react";
import {BlockProps} from "@/app/{commons}/{components}/block/type/Types";

type TodoType = {
    check : boolean;
    value   : string;
}
const CheckBlock = (props: BlockProps) => {
    const {
        seq,
        value, isView,
        onChangeValueHandler,
        onKeyUpHandler, onKeyDownHandler
    } = props;

    const todo = useMemo(() => {
        try {
            if(value === '') return null;
            const todo: TodoType = JSON.parse(value as string);
            if(!todo?.check && !todo?.value) return null;
            return todo;
        } catch (e) {
            return null;
        }
    },[value]);

    const containerStyle: CSSProperties = {
        display         : 'flex',
        width           : '100%',
        border          : 'none',
        outline         : 'none',
        wordBreak       : 'break-all',
        padding         : '0.3rem',
        backgroundColor : isView ? '' : 'rgba(230,230,230,0.2)',
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
        justifyContent  : 'center',
        alignItems      : 'center',
        height          : 'auto',
        fontSize        : '0.8rem',
        width           : '2.3rem',
        color           : todo?.check ? 'blue' : 'red',
    }

    const pStyle: CSSProperties = {
        fontSize        : '1rem',
        outline         : 'none',
        padding         : '0 0.5rem',
        border          : '1px black',
        width           : '100%',
        color           : isView ? todo?.check ? 'blue' : 'red' : 'black',
        wordBreak       : 'break-all',
        letterSpacing   : '0.03rem',
        textDecoration  : todo?.check ? 'line-through' : 'none',
    };

    const inputStyle: CSSProperties = {
        fontSize        : '1rem',
        outline         : 'none',
        padding         : '0.5rem',
        border          : 'none',
        width           : '100%',
        letterSpacing   : '0.03rem',
        backgroundColor : 'rgba(230,230,230,0.2)',
        textDecoration  : todo?.check ? 'line-through' : 'none',
    };

    const onCheckChangeHandler = (e: React.ChangeEvent<HTMLInputElement>) => {
        const value = {...todo, check: e.target.checked};
        if (onChangeValueHandler) {
            onChangeValueHandler(JSON.stringify(value));
        }

    }

    const onChangeHandler = (e: React.ChangeEvent<HTMLInputElement>) => {
        const value = {...todo, value: e.target.value};
        if (onChangeValueHandler) {
            onChangeValueHandler(JSON.stringify(value));
        }
    }

    return (
        <div id={`block-${seq}`} style={containerStyle}>
            {
                !isView
                ? <input style={{...commonStyle, ...checkBoxStyle}}
                          type={'checkbox'}
                          name={'check'}
                          value={''}
                          checked={todo?.check as TodoType['check'] || false}
                          onChange={onCheckChangeHandler}
                />
                : <p style={{...commonStyle, ...checkBoxViewStyle}}>
                    {todo?.check ? '완료' : '진행중'}
                </p>
            }

            {
                isView
                ? <p style={{...commonStyle, ...pStyle}}>
                    {todo?.value || ''}
                </p>
                : <input style={{...commonStyle, ...inputStyle}}
                       value={todo?.value as TodoType['value'] || ''}
                       onChange={onChangeHandler}
                       onKeyUp={onKeyUpHandler}
                       onKeyDown={onKeyDownHandler}
                />
            }

        </div>
    )
}

export default CheckBlock;