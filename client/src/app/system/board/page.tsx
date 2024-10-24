'use client';

import boardApiServices from "@/app/system/board/{services}/apiServices";
import SystemContainer from "@/app/system/{components}/systemContainer";
import {useEffect, useState} from "react";
import LoadingSpinner from "@/app/{commons}/LoadingSpinner";
import {System} from "@/app/system/{services}/types";
import StatusResponse = System.StatusResponse;
import {AxiosError} from "axios";


export default function Page() {

    const boardIndexJob = 'board-index-job';
    const dummyFileDeleteJob =  'dummy-file-delete-job'

    const [loading, setLoading] = useState({} as {[key: string]: boolean});

    const [response, setResponse] = useState({} as {[key: string]: StatusResponse});

    useEffect(() => {
        const call = async () => {
            try {
                const [boardIndexRes, dummyFileDeleteRes] = await Promise.allSettled([
                    boardApiServices.getBoardIndexStatus({jobName: boardIndexJob}),
                    boardApiServices.getBoardIndexStatus({jobName: dummyFileDeleteJob})
                ]);

                const initLoading = {} as {[key: string]: boolean};

                if(boardIndexRes.status === 'fulfilled' && boardIndexRes.value === System.JobStatus.PROCESSING) {
                    initLoading[boardIndexJob] = true;
                }

                if(dummyFileDeleteRes.status === 'fulfilled' && dummyFileDeleteRes.value === System.JobStatus.PROCESSING) {
                    initLoading[dummyFileDeleteJob] = true;
                }

                setLoading(initLoading);
            } catch (e) {
                const err = e as AxiosError;
                console.error(err);
            }
        }

        call();
    },[]);

    const resetHandler = async () => {

        const jobName = boardIndexJob;
        setLoading({...loading, [jobName]: true});
        setResponse({...response, [jobName]: {} as StatusResponse});

        try {
            await boardApiServices.executeJob({jobName});

            setResponse({...response, [jobName]: {status: "success", message: "게시글 검색 인덱스를 재생성하였습니다."}});


        } catch (e) {
            const err = e as AxiosError;

            setResponse({...response, [jobName]: {status: "error", message: err.response?.data as string}});
        } finally {
            setLoading({...loading, [jobName]: false});
        }
    }

    const onDeleteDummyFile = async () => {
        const jobName = dummyFileDeleteJob;
        setLoading({...loading, [jobName]: true});
        setResponse({...response, [jobName]: {} as StatusResponse});

        try {
            await boardApiServices.executeJob({jobName});

            setResponse({...response, [jobName]: {status: "success", message: "더미 데이터를 삭제하였습니다."}});

        } catch (e) {
            const err = e as AxiosError;

            setResponse({...response, [jobName]: {status: "error", message: err.response?.data as string}});
        } finally
            {
                setLoading({...loading, [jobName]: false});
            }
    }

    return (
        <div className={'flex flex-col gap-3'}>
            <SystemContainer headline={'게시글 검색 인덱스 재성성'}>
                <div className={'list-disc text-sm'}>
                    <li>게시글 검색 인덱스를 재생성합니다.</li>
                </div>
                <div className={'flex gap-2 items-center'}>
                    <button className={'w-20 py-1 bg-blue-600 text-white text-sm disabled:bg-gray-600'}
                            onClick={resetHandler}
                            disabled={loading[boardIndexJob]}
                    >
                        {
                            loading['board-index-job']
                                ? <LoadingSpinner size={10} />
                                : '재생성'
                        }
                    </button>
                    {
                        loading[boardIndexJob] && !response[boardIndexJob]?.status
                            ? <span className={'text-blue-600 text-sm'}>게시글 인덱싱 진행중</span>
                            : response[boardIndexJob]?.status === 'success'
                                ? <span className={'text-blue-600 text-sm'}>{response[boardIndexJob]?.message}</span>
                                : <span className={'text-red-600 text-sm'}>{response[boardIndexJob]?.message}</span>
                    }
                </div>
            </SystemContainer>
            <SystemContainer headline={'더미 데이터 삭제'}>
                <div className={'list-disc text-sm'}>
                    <li>사용되지 않은 데이터를 삭제합니다.</li>
                </div>
                <div className={'flex gap-2 items-center'}>
                    <button className={'w-20 py-1 bg-blue-600 text-white text-sm disabled:bg-gray-600'}
                            onClick={onDeleteDummyFile}
                            disabled={loading[dummyFileDeleteJob]}
                    >
                        {
                            loading[dummyFileDeleteJob]
                                ? <LoadingSpinner size={10} />
                                : '삭제'
                        }
                    </button>
                    {
                        loading[dummyFileDeleteJob] && !response[dummyFileDeleteJob]?.status
                            ? <span className={'text-blue-600 text-sm'}>삭제 진행중</span>
                            : response[dummyFileDeleteJob]?.status === 'success'
                                ? <span className={'text-blue-600 text-sm'}>{response[dummyFileDeleteJob]?.message}</span>
                                : <span className={'text-red-600 text-sm'}>{response[dummyFileDeleteJob]?.message}</span>
                    }
                </div>
            </SystemContainer>
        </div>

    )
}