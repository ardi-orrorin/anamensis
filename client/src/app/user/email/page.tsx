'use client';

import axios from "axios";
import {AuthType} from "@/app/login/page";
import {useEffect, useState} from "react";

export interface UserInfoI {
    userId: string;
    email: string;
    phone: string;
    name: string;
    point: number;
    sauthType: AuthType;
    asuth: boolean;
    [key: string]: any;
}

export default function Page() {

    const [userInfo, setUserInfo] = useState<UserInfoI>({} as UserInfoI);

    useEffect(() => {
        axios.get('./email/api')
            .then(res => {
                setUserInfo(res.data);
            });
    },[]);

    const onChangeHandler = (e: React.ChangeEvent<HTMLInputElement>) => {
        console.log(e.target);
        console.log(userInfo);
    }

    return (
        <div>
            <label className="inline-flex itemsclassNameer cursor-pointer">
                <input type="checkbox" className={"sr-only peer"} onChange={onChangeHandler}/>
                <div className="relative w-11 h-6 ray-200 peer-focus:outline-none peer-focus:ring-4
                    peer-focus:ring-blue-300 dark:peer-focus:ring-blue-800 rounded-full peer dark:bg-gray-700
                    peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full
                    peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:start-[2px]
                    after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5
                    after:transition-all dark:border-gray-600 peer-checked:bg-blue-600"></div>
                <span className="ms-3 text-sm fontclassNameum text-blue-700">Email 인증 사용 여부</span>
            </label>
        </div>
    )
}

