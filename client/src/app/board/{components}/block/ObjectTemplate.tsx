import React, {MutableRefObject} from "react";
import {MouseEnterHTMLElements, MouseLeaveHTMLElements} from "@/app/board/{components}/block/type/Types";

const ObjectTemplate = ({
    seq,
    hash,
    type,
    isView,
    skip,
    children,
    blockRef,
    onMouseLeaveHandler,
    onMouseEnterHandler,
}: {
    seq: number;
    hash: string;
    type: string;
    skip?: boolean;
    isView?: boolean;
    children: React.ReactNode;
    blockRef?: MutableRefObject<HTMLElement[] | null[]>;
    onMouseLeaveHandler?: (e: React.MouseEvent<MouseLeaveHTMLElements>) => void;
    onMouseEnterHandler?: (e: React.MouseEvent<MouseEnterHTMLElements>) => void;
}) => {
    return (
        <div className={'w-full flex flex-col gap-2'}
             id={`block-${hash}`}
             aria-roledescription={type}
             onMouseEnter={onMouseEnterHandler}
             onMouseLeave={onMouseLeaveHandler}
             ref={el => {
                 if(skip) {
                     blockRef!.current[seq] = el;
                     return;
                 }
                 if(!isView || !blockRef?.current) return;
                 blockRef!.current[seq] = el
             }}
        >
            { children }
        </div>

    )
}

export default ObjectTemplate;