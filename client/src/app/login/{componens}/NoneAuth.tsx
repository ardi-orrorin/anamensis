import React, {useContext, useEffect} from "react";
import LoginProvider, {LoginI} from "@/app/login/{services}/LoginProvider";
import {faSpinner} from "@fortawesome/free-solid-svg-icons";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {useRouter} from "next/navigation";
import axios from "axios";
import apiCall from "@/app/{commons}/func/api";


const NoneAuth = ({}) => {
    const {user} = useContext(LoginProvider);
    useEffect(() => {
        apiCall<null, LoginI>({
            path: '/api/login/verify',
            method: 'POST',
            body: user,
            call: 'Proxy'
        }).then(res => {
            window.location.replace('/user');
        });
    },[]);

    return (
        <div className={'w-full flex flex-col items-center gap-40 text-gray-400'}>
            <FontAwesomeIcon height={20} className={'animate-spin h-20 opacity-30'} icon={faSpinner} />
            <h1>LOADING</h1>
        </div>
    )
}

export default NoneAuth;
