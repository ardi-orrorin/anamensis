import React, {MutableRefObject} from "react";
import {MouseEnterHTMLElements, MouseLeaveHTMLElements} from "@/app/board/{components}/block/type/Types";

const ObjectTemplate = ({
    seq,
    hash,
    type,
    children,
    blockRef,
    onMouseLeaveHandler,
    onMouseEnterHandler,
}: {
    seq: number;
    hash: string;
    type: string;
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
                 if(!blockRef?.current) return;
                 blockRef!.current[seq] = el
             }}
        >
            { children }
        </div>

    )
}

export default ObjectTemplate;