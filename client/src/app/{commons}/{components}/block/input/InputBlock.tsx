import {BlockProps} from "@/app/{commons}/{components}/block/type/Types";
import React, {CSSProperties} from "react";
import InputBase from "@/app/{commons}/{components}/block/input/InputBase";

export default function InputBlock (props: BlockProps, customStyle: CSSProperties) {
    return (
        <>
            <InputBase data={props} style={{...props.textStyle, ...customStyle}} />
        </>
    )
};

