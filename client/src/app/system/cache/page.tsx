'use client';

import SystemContainer from "@/app/system/{components}/systemContainer";
import SystemToggle from "@/app/system/{components}/SystemToggle";
import LoadingSpinner from "@/app/{commons}/LoadingSpinner";
import React, {useEffect, useState} from "react";
import systemApiServices from "@/app/system/{services}/apiServices";
import {useQuery} from "@tanstack/react-query";
import {SystemCache} from "@/app/system/cache/{services}/types";
import {System} from "@/app/system/{services}/types";
import {AxiosError} from "axios";

export default function Page() {

    const {data: privateSystemConfig, refetch} = useQuery(systemApiServices.getPrivateSystemConfig());
    const [redis, setRedis] = useState({} as SystemCache.Redis);
    const [loading, setLoading] = useState(false);
    const [response, setResponse] = useState({} as System.StatusResponse);

    useEffect(() => {
        setRedis(privateSystemConfig?.redis);
    }, [privateSystemConfig]);

    const onChangeHandler = (e: React.ChangeEvent<HTMLInputElement>) => {
        setRedis({...redis, [e.target.name]: e.target.value})
        setResponse({} as System.StatusResponse);
    }

    const onClickToggleHandler = async () => {
        const body = {
            key: System.Key.REDIS,
            value: {...redis, enabled: !redis.enabled}
        } as System.Request<SystemCache.Redis>;

        setLoading(true);

        try {
            const res = await systemApiServices.save({body});

            refetch();

            setResponse({status: 'success', message: '저장되었습니다.'});

        } catch (e) {
            const err = e as AxiosError;
            setResponse({status: 'error', message: err.response?.data as string});
        } finally {
            setLoading(false);
        }

    }

    const onSaveHandler = async () => {
        const body = {
            key: System.Key.REDIS,
            value: redis
        } as System.Request<SystemCache.Redis>;

        setLoading(true);

        systemApiServices.save({body})
            .then(() => {
                refetch();
                setResponse({status: 'success', message: '저장되었습니다.'});
            })
            .catch((e) => {
                const err = e as AxiosError;
                setResponse({status: 'error', message: err.response?.data as string});
            })
            .finally(() => {
                setLoading(false);
            });
    }

    const onResetHandler = async () => {
        systemApiServices.initSystemConfig({key: System.Key.REDIS})
            .then(() => {
                refetch();
                setResponse({status: 'success', message: '초기화 되었습니다.'});
            })
            .catch((e) => {
                const err = e as AxiosError;
                setResponse({status: 'error', message: err.response?.data as string});
            })
            .finally(() => {
                setLoading(false);
            });
    }

    if(!redis) return <></>

    return (
        <div className={'flex flex-col gap-2'}>
            <SystemContainer headline={'REDIS(레디스) 설정'}>
                <div className={'flex flex-col space-y-3'}>
                    <div className={'list-disc space-y-1 text-sm text-gray-600'}>
                        <li>로딩 속도 향상을 위해 일부 구간의 데이터를 캐시화</li>
                        <li>캐시 적용 후 데이터가 표시 되지않으면 새로고침을 권장</li>
                    </div>
                    <div className={'flex items-center gap-4'}>
                        <SystemToggle toggle={redis.enabled}
                                      onClick={onClickToggleHandler}
                        />
                        <input className={'px-2 py-1 text-sm w-60 border border-solid border-gray-100 rounded outline-0 drop-shadow focus:bg-gray-100 disabled:bg-gray-100'}
                               name={'host'}
                               placeholder={'host를 입력하세요'}
                               value={redis.host}
                               onChange={onChangeHandler}
                               disabled={loading}

                        />
                        <input className={'px-2 py-1 text-sm w-32 border border-solid border-gray-100 rounded outline-0 drop-shadow focus:bg-gray-100 disabled:bg-gray-100 no-spinner'}
                               type={'number'}
                               name={'port'}
                               placeholder={'port를 입력하세요'}
                               value={redis.port}
                               onChange={onChangeHandler}
                               disabled={loading}
                        />
                        <button className={['min-w-16 text-xs text-white p-2 duration-500 drop-shadow',
                                    !loading ? 'bg-blue-600 hover:bg-blue-800' : 'bg-gray-400 hover:bg-gray-600'
                                ].join(' ')}
                                disabled={loading}
                                onClick={onSaveHandler}
                        >
                            {loading ? <LoadingSpinner size={10}/> : '저장'}
                        </button>
                        <button className={['min-w-16 text-xs text-white p-2 duration-500 drop-shadow',
                                    !loading ? 'bg-red-600 hover:bg-red-800' : 'bg-gray-400 hover:bg-gray-600'
                                ].join(' ')}
                                disabled={loading}
                                onClick={onResetHandler}
                        >
                            {loading ? <LoadingSpinner size={10}/> : '초기화'}
                        </button>
                        {
                            response?.status
                            && <div className={`py-2 text-xs ${response.status === 'success' ? 'text-blue-700' : 'text-red-500'}`}>
                                {response.message}
                          </div>
                        }
                    </div>


                </div>
            </SystemContainer>
        </div>
    )
}