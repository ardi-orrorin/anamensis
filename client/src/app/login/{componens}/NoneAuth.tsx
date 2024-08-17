import React, {useEffect} from "react";
import {useLogin} from "@/app/login/{hooks}/LoginProvider";
import {faSpinner} from "@fortawesome/free-solid-svg-icons";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";

const NoneAuth = () => {

    const { verify } = useLogin();

    useEffect(() => {
        verify();
    }, []);

    return (
        <div className={'w-full flex flex-col items-center gap-40 text-gray-400'}>
            <FontAwesomeIcon height={20} className={'animate-spin h-20 opacity-30'} icon={faSpinner} />
            <h1>LOADING</h1>
        </div>
    )
}

export default NoneAuth;
