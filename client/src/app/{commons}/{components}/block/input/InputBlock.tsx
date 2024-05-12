import {BlockProps} from "@/app/{commons}/{components}/block/type/Types";
import React, {CSSProperties} from "react";
import InputBase from "@/app/{commons}/{components}/block/input/InputBase";

export default function InputBlock (props: BlockProps, customStyle: CSSProperties) {

    const style: CSSProperties = {
        color: props.color,
        backgroundColor: props.bg,
    }

    return (
        <>
            <InputBase data={props} style={{...style, ...customStyle}} />
        </>
    )
};

