import {faSpinner} from "@fortawesome/free-solid-svg-icons";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import React from "react";

const LoadingSpinner = ({size}:{size : number}) => {
    return (
        <FontAwesomeIcon width={size} height={size} className={`animate-spin h-[${size}px] w-[${size}px]`} icon={faSpinner} />
    );
}

export default LoadingSpinner;