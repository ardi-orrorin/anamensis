'use client';
import axios, {AxiosResponse} from "axios";
import {useEffect, useState} from "react";
import {AuthType} from "@/app/login/{services}/types";
import LoadingSpinner from "@/app/{commons}/LoadingSpinner";
import {useRouter} from "next/navigation";

export default function AttendInfo() {

    const router = useRouter();

    const [user, setUser] = useState<AttendInfoI>({} as AttendInfoI);
    const [loading, setLoading] = useState<boolean>(false);

    useEffect(()=> {
        axios.get("/api/user/attend")
            .then((res: AxiosResponse<AttendInfoI>) => {
                setUser(res.data);
            })
    },[loading]);

    const attend = async () => {
        setLoading(true);
        await axios.get("/api/user/attend/check")
            .then((res: AxiosResponse<string>) => {
                alert(res.data);
                router.refresh();
            })
            .finally(() => {
                setLoading(false);
            })
    }
    return (
        <div className={'w-full flex flex-col gap-5'}>
            <div>
                <label>아이디 : </label>
                <span>{user.userId}</span>
            </div>
            <div>
                <label>이메일 : </label>
                <span>{user.email}</span>
            </div>
            <div>
                <label>점수 : </label>
                <span>{user.point}</span>
            </div>
            <div>
                <label>마지막 출석일 : </label>
                <span>{user.lastDate}</span>
            </div>
            <div>
                <label>연속 출석 횟수 : </label>
                <span>{user.days}회</span>
            </div>
            <div>
                <button className={'w-full bg-blue-300 text-white p-2 rounded hover:bg-blue-700 duration-500'}
                        onClick={attend}
                >
                    {
                        loading
                        ? <LoadingSpinner size={15} />
                        : <span>출석체크</span>
                    }
                </button>
            </div>
        </div>
    )
}

export interface AttendInfoI {
    userId   : string;
    email    : string;
    point    : number;
    lastDate : string;
    days     : number;
}