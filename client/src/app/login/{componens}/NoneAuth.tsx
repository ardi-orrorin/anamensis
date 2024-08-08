import React, {useContext, useEffect} from "react";
import LoginProvider from "@/app/login/{services}/LoginProvider";
import {faSpinner} from "@fortawesome/free-solid-svg-icons";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import apiCall from "@/app/{commons}/func/api";
import {User} from "@/app/login/{services}/types";

const NoneAuth = () => {
    const {user} = useContext(LoginProvider);
    useEffect(() => {
        const fetch = async () => {
            try {
                await apiCall<User.LoginResponse, User.Login>({
                    path: '/api/login/verify',
                    method: 'POST',
                    body: user,
                    call: 'Proxy'
                }).then(res => {
                    window.location.replace('/');
                })
            } catch (e) {
                console.log(e);
            }
        }

        fetch();

    },[]);

    return (
        <div className={'w-full flex flex-col items-center gap-40 text-gray-400'}>
            <FontAwesomeIcon height={20} className={'animate-spin h-20 opacity-30'} icon={faSpinner} />
            <h1>LOADING</h1>
        </div>
    )
}

export default NoneAuth;
