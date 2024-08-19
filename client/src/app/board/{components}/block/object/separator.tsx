import React from "react";
import {ExpendBlockProps} from "@/app/board/{components}/block/type/Types";
import ObjectTemplate from "@/app/board/{components}/block/ObjectTemplate";

const Separator = (props: ExpendBlockProps) => {
    const {
        seq, blockRef, isView,
        type , hash, skip,
        onMouseEnterHandler, onMouseLeaveHandler
    } = props;
    return (
        <ObjectTemplate {...{seq, blockRef, isView, type, hash, skip,  onMouseEnterHandler, onMouseLeaveHandler}} >
            <div className={'w-full h-0.5 my-1 bg-gray-400'} />
        </ObjectTemplate>
    )
}

export default Separator;