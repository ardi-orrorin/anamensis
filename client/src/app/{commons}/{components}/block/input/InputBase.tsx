'use client';
import {BlockProps} from "@/app/{commons}/{components}/block/type/Types";
import React, {CSSProperties, DetailedHTMLProps, InputHTMLAttributes} from "react";

export default function InputBase({
   data, style
}:{
    data: BlockProps,
    style: CSSProperties
}){

    const {
        onKeyUpHandler, onFocusHandler,
        onKeyDownHandler, onChangeHandler,
        onBlurHandler, onBlurCaptureHandler,
        onMouseEnterHandler,
        value, isView,
        textStyle,
        blockRef, seq
    } = data;

    const defaultBg = {
        input: 'rgba(230,230,230,0.2)',
        p    : ''
    }

    const customStyle: CSSProperties = {
        outline         : 'none',
        border          : 'none',
        width           : '100%',
        wordBreak       : 'break-all',
        wordWrap        : 'break-word',
        height          : textStyle?.height         ? textStyle.height         : style.height,
        fontSize        : textStyle?.fontSize       ? textStyle.fontSize       : style.fontSize,
        color           : textStyle?.color          ? textStyle.color          : style.color,
        fontWeight      : textStyle?.fontWeight     ? textStyle.fontWeight     : style.fontWeight,
        fontStyle       : textStyle?.fontStyle      ? textStyle.fontStyle      : style.fontStyle,
        borderLeft      : textStyle?.borderLeft     ? textStyle.borderLeft     : style.borderLeft,
        textDecoration  : textStyle?.textDecoration ? textStyle.textDecoration : style.textDecoration,
        padding         : style.padding,
        letterSpacing   : style.letterSpacing,

    };

    const props: DetailedHTMLProps<InputHTMLAttributes<HTMLInputElement>, HTMLInputElement> = {
        value,
        ref           : el => blockRef!.current[seq] = el,
        onKeyUp       : onKeyUpHandler,
        onKeyDown     : onKeyDownHandler,
        onChange      : onChangeHandler,
        onFocus       : onFocusHandler,
        onMouseEnter  : onMouseEnterHandler,
        onBlur        : onBlurHandler,
        onBlurCapture : onBlurCaptureHandler,
    }

    return (
        <div id={`block-${seq}`} style={{display: 'flex', width: '100%', padding: '0.1rem 0.5rem'}}>
            {
                isView
                ? <p style={{...customStyle, backgroundColor: textStyle?.backgroundColor || defaultBg.p}}
                     {...props}
                >{value}</p>
                : <input style={{...customStyle, backgroundColor: textStyle?.backgroundColor || defaultBg.input}}
                         placeholder={'내용을 입력하세요'}
                         {...props}
                />
            }
        </div>
    )
}