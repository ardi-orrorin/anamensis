'use client';
import {useState} from "react";
import LoadingSpinner from "@/app/{commons}/LoadingSpinner";
import {useRouter} from "next/navigation";
import apiCall from "@/app/{commons}/func/api";
import {createDebounce} from "@/app/{commons}/func/debounce";
import useSWR, {mutate, preload} from "swr";


export default function AttendInfo() {

    const [user, setUser] = useState<AttendInfoI>({} as AttendInfoI);
    const [loading, setLoading] = useState<boolean>(false);
    const debounce = createDebounce(500);

    preload('/user/attend', async () => {
        return await apiCall<AttendInfoI>({
            path: "/api/user/attend",
            method: "GET",
            isReturnData: true,
        });
    }).then((res) => {
        setUser(res);
    });

    const fetchData = apiCall<AttendInfoI>({
        path: "/api/user/attend",
        method: "GET",
        isReturnData: true,
    })


    const attend = () => {
        setLoading(true);

        const fetch = async () => {
            await apiCall<string>({
                path: "/api/user/attend/check",
                method: "GET",
            })
            .then(async (res) => {
                const message = res.data === 'success'
                    ? '출석체크 성공!'
                    : '이미 출석하셨습니다. 내일 다시 시도해주세요.';

                alert(message);
                await mutate('/user/attend', fetchData);
            })
            .finally(() => {
                setLoading(false);
            });
        }
        debounce(fetch);
    }

    return (
        <div className={'w-full h-full flex flex-col gap-5 justify-center items-start'}>
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
            <div className={'w-full'}>
                <button className={'w-full bg-blue-300 text-white p-2 rounded hover:bg-blue-700 duration-500'}
                        onClick={attend}
                        disabled={loading}
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