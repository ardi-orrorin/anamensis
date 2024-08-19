import React from "react";

const DefaultLabel = () => {
    return (
        <div className={'absolute top-2 right-2 z-10 py-1 px-2 bg-blue-400 text-white'}>
            <span className={'flex text-xs'}>
                대표
            </span>
        </div>
    )
}

export default React.memo(DefaultLabel);