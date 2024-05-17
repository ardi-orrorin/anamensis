'use client';

import React, {useContext} from "react";
import {BlockProps} from "@/app/{commons}/{components}/block/type/Types";
import FileUpload from "@/app/{commons}/{components}/block/file/fileUpload";
import FileImage from "@/app/{commons}/{components}/block/file/fileImage";
import FileFile from "@/app/{commons}/{components}/block/file/fileFile";
import BoardProvider from "@/app/board/{services}/BoardProvider";

export default function FileBlock (data: BlockProps) {
    const {seq, value, code,
        onChangeValueHandler,
        onMouseEnterHandler,
        onMouseLeaveHandler,
    } = data;

    const codes = [
        {code: '00011', component: FileImage},
        {code: '00012', component: FileFile},
    ]

    return (
        <>
            {
                !value &&
                <FileUpload seq={seq}
                            code={code}
                            value={value}
                            onUploadFileUrl={onChangeValueHandler!}
                            isImage={code === '00011'}
                />
            }
            {
                value &&
                codes.map((c, i) => {
                    if(c.code === code){
                        const Component = c.component;
                        return <Component key={i}
                                          value={value}
                                          onMouseEnterHandler={onMouseEnterHandler!}
                                          onMouseLeaveHandler={onMouseLeaveHandler!}
                        />
                    }
                })
            }
        </>
    )
}