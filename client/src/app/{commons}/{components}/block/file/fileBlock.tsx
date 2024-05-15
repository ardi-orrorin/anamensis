'use client';

import React from "react";
import {BlockProps} from "@/app/{commons}/{components}/block/type/Types";
import FileUpload from "@/app/{commons}/{components}/block/file/fileUpload";
import FileImage from "@/app/{commons}/{components}/block/file/fileImage";
import FileFile from "@/app/{commons}/{components}/block/file/fileFile";

export default function FileBlock (data: BlockProps) {
    const {seq, value, code} = data;

    const codes = [
        // {code: '000010', component: FileUpload},
        {code: '000011', component: FileImage},
        {code: '000012', component: FileFile},
    ]

    const onUploadFileUrl = (value: string) => {
        console.log('onUploadFileUrl', value);
    }

    return (
        <>
            {
                code === '000010' &&
                <FileUpload seq={seq}
                            code={code}
                            value={value}
                            onUploadFileUrl={onUploadFileUrl}
                />
            }
            {
                value &&
                codes.map((c, i) => {
                    if(c.code === code){
                        const Component = c.component;
                        return <Component key={i} value={value} />
                    }
                })
            }
        </>
    )
}