'use client';
import {BlockProps} from "@/app/board/{components}/block/type/Types";
import React, {CSSProperties, DetailedHTMLProps, InputHTMLAttributes, useMemo} from "react";

export default function InputBase({
   data, style
}:{
    data: BlockProps,
    style: CSSProperties
}){

    const {
        onKeyUpHandler, onFocusHandler,
        onKeyDownHandler, onChangeHandler,
        onBlurHandler, onMouseEnterHandler,
        value, isView,
        textStyle, hash,
        blockRef, seq
    } = data;

    const defaultBg = useMemo(() => ({
        input : 'rgba(230,230,230,0.2)',
        p     : ''
    }),[]);

    const customStyle: CSSProperties = useMemo(() => ({
        outline         : 'none',
        border          : 'none',
        width           : '100%',
        wordBreak       : 'break-all',
        wordWrap        : 'break-word',
        height          : textStyle?.height         || style.height,
        fontSize        : textStyle?.fontSize       || style.fontSize,
        color           : textStyle?.color          || style.color,
        fontWeight      : textStyle?.fontWeight     || style.fontWeight,
        fontStyle       : textStyle?.fontStyle      || style.fontStyle,
        borderLeft      : textStyle?.borderLeft     || style.borderLeft,
        textDecoration  : textStyle?.textDecoration || style.textDecoration,
        padding         : style.padding,
        letterSpacing   : style.letterSpacing,
    }),[style, textStyle]);

    const props: DetailedHTMLProps<InputHTMLAttributes<HTMLInputElement>, HTMLInputElement> = useMemo(() => ({
        value,
        ref           : el => {
            if(!blockRef?.current) return;
            blockRef.current[seq] = el
        },
        onKeyUp       : onKeyUpHandler,
        onKeyDown     : onKeyDownHandler,
        onChange      : onChangeHandler,
        onFocus       : onFocusHandler,
        onBlur        : onBlurHandler,
        onMouseEnter  : onMouseEnterHandler,
    }),[blockRef?.current, value, onKeyDownHandler]);

    return (
        <div id={`block-${hash}`}
             className={'flex w-full'}
        >
            {
                isView
                ? <p style={{...customStyle, backgroundColor: textStyle?.backgroundColor || defaultBg.p}}
                     {...props}
                >{value}</p>
                : <input style={{...customStyle, backgroundColor: textStyle?.backgroundColor || defaultBg.input, padding: '0.5rem'}}
                         aria-roledescription={'text'}
                         {...props}
                />
            }
        </div>
    )
}