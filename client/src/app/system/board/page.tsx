'use client';

import boardApiServices from "@/app/system/board/{services}/apiServices";
import SystemContainer from "@/app/system/{components}/systemContainer";
import {useEffect, useState} from "react";
import LoadingSpinner from "@/app/{commons}/LoadingSpinner";
import {System} from "@/app/system/{services}/types";
import StatusResponse = System.StatusResponse;
import {AxiosError} from "axios";

export default function Page() {

    const [loading, setLoading] = useState(false);

    const [response, setResponse] = useState({} as StatusResponse);

    useEffect(() => {
        const call = async () => {
            try {
                const res = await boardApiServices.getBoardIndexStatus();
                if(res === System.JobStatus.PROCESSING) setLoading(true);
            } catch (e) {
                const err = e as AxiosError;
                console.error(err);
            }
        }

        call();
    },[]);

    const resetHandler = async () => {

        setLoading(true);
        setResponse({} as StatusResponse);

        try {
            await boardApiServices.resetBoardIndex();

            setResponse({status: "success", message: "게시글 검색 인덱스를 재생성하였습니다."});

        } catch (e) {
            const err = e as AxiosError;

            setResponse({status: "error", message: err.response?.data as string});


        } finally {
            setLoading(false);
        }

    }

    return (
        <div className={'flex flex-col gap-3'}>

            <SystemContainer headline={'게시글 검색 인덱스 재성성'}>
                <div className={'list-disc'}>
                    <li>게시글 검색 인덱스를 재생성합니다.</li>
                </div>
                <div className={'flex gap-2 items-center'}>
                    <button className={'w-20 py-1 bg-blue-600 text-white text-sm disabled:bg-gray-600'}
                            onClick={resetHandler}
                            disabled={loading}
                    >
                        {
                            loading
                                ? <LoadingSpinner size={10} />
                                : '재생성'
                        }
                    </button>
                    {
                        loading && !response?.status
                            ? <span className={'text-blue-600 text-sm'}>게시글 인덱싱 진행중</span>
                            : response.status === 'success'
                                ? <span className={'text-blue-600 text-sm'}>{response.message}</span>
                                : <span className={'text-red-600 text-sm'}>{response.message}</span>
                    }
                </div>
            </SystemContainer>
        </div>

    )
}