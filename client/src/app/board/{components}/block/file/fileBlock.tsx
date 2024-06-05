'use client';

import React, {ReactNode} from "react";
import {BlockProps} from "@/app/board/{components}/block/type/Types";
import FileUpload from "@/app/board/{components}/block/file/fileUpload";
import FileImage, {FileImageProps} from "@/app/board/{components}/block/file/fileImage";

export type FileBlockProps = BlockProps & {
    Component: (props: FileImageProps) => ReactNode;
}

export default function FileBlock (data: FileBlockProps) {
    const {seq, value, code, hash,
        onChangeValueHandler,
        onMouseEnterHandler,
        onMouseLeaveHandler,
        Component
    } = data;

    return (
        <div id={`block-${hash}`} className={'w-full'} aria-roledescription={'object'}>
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