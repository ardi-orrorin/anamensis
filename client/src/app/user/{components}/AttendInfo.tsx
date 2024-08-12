'use client';
import React, {useCallback, useContext, useState} from "react";
import LoadingSpinner from "@/app/{commons}/LoadingSpinner";
import {useRouter} from "next/navigation";
import apiCall from "@/app/{commons}/func/api";
import {createDebounce} from "@/app/{commons}/func/debounce";
import useSWR, {mutate, preload} from "swr";
import UserProvider, {AttendInfoI} from "@/app/user/{services}/userProvider";
import {useQuery} from "@tanstack/react-query";
import userApiService from "@/app/user/{services}/userApiService";

const AttendInfo = () => {

    const [loading, setLoading] = useState<boolean>(false);
    const debounce = createDebounce(500);

    const {data: attendInfo, refetch} = useQuery(userApiService.attend());

    const attend = useCallback(() => {
        setLoading(true);

        const fetch = async () => {
            userApiService.attendCheck()
            .then(async (res) => {
                const message = res.data === 'success'
                    ? '출석체크 성공!'
                    : '이미 출석하셨습니다. 내일 다시 시도해주세요.';

                alert(message);
                await refetch();
            })
            .finally(() => {
                setLoading(false);
            });
        }
        debounce(fetch);
    },[]);

    return (
        <div className={'w-full h-full flex flex-col gap-5 justify-center items-start'}>
            <div>
                <label>아이디 : </label>
                <span>{attendInfo?.userId}</span>
            </div>
            <div>
                <label>이메일 : </label>
                <span>{attendInfo?.email}</span>
            </div>
            <div>
                <label>점수 : </label>
                <span>{attendInfo?.point}</span>
            </div>
            <div>
                <label>마지막 출석일 : </label>
                <span>{attendInfo?.lastDate}</span>
            </div>
            <div>
                <label>연속 출석 횟수 : </label>
                <span>{attendInfo?.days}회</span>
            </div>
            <div className={'w-full'}>
                <button className={'w-full bg-main text-white p-2 rounded hover:bg-blue-700 duration-500 shadow'}
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

export default React.memo(AttendInfo);

