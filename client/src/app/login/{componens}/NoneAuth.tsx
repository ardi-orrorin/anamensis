import React, {useContext, useEffect} from "react";
import LoginProvider from "@/app/login/{services}/LoginProvider";
import {faSpinner} from "@fortawesome/free-solid-svg-icons";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {useRouter} from "next/navigation";
import axios from "axios";


const NoneAuth = ({}) => {
    const {user} = useContext(LoginProvider);
    useEffect(() => {
        axios.post('/api/login/verify', user, {
        }).then(res => {
            location.replace('/user');
        })
    },[]);

    return (
        <div className={'w-full flex flex-col items-center gap-40 text-gray-400'}>
            <FontAwesomeIcon height={20} className={'animate-spin h-20 opacity-30'} icon={faSpinner} />
            <h1>LOADING</h1>
        </div>
    )
}

export default NoneAuth;
