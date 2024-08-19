import {faSpinner} from "@fortawesome/free-solid-svg-icons";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import React from "react";

const LoadingSpinner = ({size}:{size : number}) => {
    return (
        <FontAwesomeIcon className={`animate-spin h-[${size}px] w-[${size}px]`}
                         width={size}
                         height={size}
                         icon={faSpinner}
        />
    );
}

export default React.memo(LoadingSpinner);