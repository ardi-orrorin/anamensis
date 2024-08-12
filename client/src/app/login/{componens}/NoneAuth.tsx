import React, {useContext, useEffect} from "react";
import LoginProvider from "@/app/login/{services}/LoginProvider";
import {faSpinner} from "@fortawesome/free-solid-svg-icons";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import apiCall from "@/app/{commons}/func/api";
import {User} from "@/app/login/{services}/types";
import {QueryCache, QueryClient, usePrefetchQuery, useQuery, useQueryClient} from "@tanstack/react-query";
import rootApiService from "@/app/{services}/rootApiService";
import loginApiService from "@/app/login/{services}/loginApiService";
import {useRouter} from "next/navigation";

const NoneAuth = () => {
    const {user} = useContext(LoginProvider);

    const { isSuccess, isError } = useQuery(loginApiService.verify(user))

    isSuccess && window.location.replace('/');

    isError && window.location.replace('/login');

    return (
        <div className={'w-full flex flex-col items-center gap-40 text-gray-400'}>
            <FontAwesomeIcon height={20} className={'animate-spin h-20 opacity-30'} icon={faSpinner} />
            <h1>LOADING</h1>
        </div>
    )
}

export default NoneAuth;
