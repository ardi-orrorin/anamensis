'use client';

import React, {ReactNode} from "react";
import {ExpendBlockProps} from "@/app/board/{components}/block/type/Types";
import FileUpload from "@/app/board/{components}/block/file/fileUpload";
import FileImage, {FileImageProps} from "@/app/board/{components}/block/file/fileImage";

export type FileBlockProps = ExpendBlockProps & {
    Component: (props: FileImageProps) => ReactNode;
}

export default function FileBlock (props: FileBlockProps) {
    const {
        seq, value,
        code, hash,
        type,
        onChangeValueHandler,
        onMouseEnterHandler,
        onMouseLeaveHandler,
        Component
    } = props;

    return (
        <div id={`block-${hash}`}
             className={'w-full'}
             aria-roledescription={type}
        >
            {
                !value &&
                <FileUpload seq={seq}
                            code={code}
                            value={value}
                            hash={hash}
                            onUploadFileUrl={onChangeValueHandler!}
                            onMouseEnterHandler={onMouseEnterHandler!}
                            isImage={Component === FileImage}
                />
            }
            {
                value &&
                <Component value={value}
                           onMouseEnterHandler={onMouseEnterHandler!}
                           onMouseLeaveHandler={onMouseLeaveHandler!}
                />
            }
        </div>
    )
}