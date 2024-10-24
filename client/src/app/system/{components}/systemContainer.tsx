import React from "react";
import {faGear} from "@fortawesome/free-solid-svg-icons";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";

const SystemContainer = ({
    headline, children
}:{
    headline: string;
    children: React.ReactNode;
}) => {
    return (
        <div className={'w-full flex flex-col border border-solid border-gray-300 px-3 py-3 rounded gap-4 duration-500 shadow'}>
            <h1 className={'min-w-20 flex items-end gap-2 font-bold'}>
                <FontAwesomeIcon icon={faGear} size={'xl'} />
                {headline}
            </h1>
            {children}
        </div>
    )
}


export default SystemContainer;