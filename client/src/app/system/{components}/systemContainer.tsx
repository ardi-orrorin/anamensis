import React from "react";

const SystemContainer = ({
    headline, children
}:{
    headline: string;
    children: React.ReactNode;
}) => {
    return (
        <div className={'w-full flex flex-col border border-solid border-gray-300 px-3 py-3 rounded gap-4 duration-500'}>
            <h1 className={'min-w-20'}>{headline}</h1>
            {children}
        </div>
    )
}


export default SystemContainer;