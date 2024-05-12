import {BlockProps} from "@/app/{commons}/{components}/block/type/Types";
import React, {CSSProperties, DetailedHTMLProps, InputHTMLAttributes} from "react";

export default function InputBase({
   data, style
}:{
    data: BlockProps,
    style: CSSProperties
}){

    const {
        onKeyUpHandler,
        onKeyDownHandler, onChangeHandler,
        value, isView,
        size, color, bg,
        blockRef, seq
    } = data;

    const defaultBg = {
        input: 'rgba(230,230,230,0.2)',
        span: ''
    }

    const customStyle: CSSProperties = {
        outline: 'none',
        border: 'none',
        width: '100%',
        fontSize: (size && size !== '') ? size : style.fontSize,
        color: (color && color !== '') ? color : style.color,
        fontWeight: style.fontWeight,
        padding: style.padding,
        letterSpacing: style.letterSpacing,
    };

    const props: DetailedHTMLProps<InputHTMLAttributes<HTMLInputElement>, HTMLInputElement> = {
        ref: el => blockRef.current[seq] = el,
        onKeyUp: onKeyUpHandler,
        onKeyDown: onKeyDownHandler,
        onChange: onChangeHandler,
        value,
    }

    return (
        <div style={{display: 'flex', width: '100%', padding: '0.5rem'}}>
            {
                isView
                ? <span style={{...customStyle, backgroundColor: bg || defaultBg.span}} {...props}>{value}</span>
                : <input style={{...customStyle, backgroundColor: bg || defaultBg.input}} {...props}/>
            }
        </div>
    )
}