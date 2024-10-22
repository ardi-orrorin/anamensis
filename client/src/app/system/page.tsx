'use client';

import {usePrefetchQuery, useQuery} from "@tanstack/react-query";
import systemApiServices from "@/app/system/{services}/apiServices";
import SystemContainer from "@/app/system/{components}/systemContainer";
import {System} from "@/app/system/{services}/types";
import {ChangeEvent, EventHandler, useEffect, useState} from "react";
import Key = System.Key;
import LoadingSpinner from "@/app/{commons}/LoadingSpinner";
import SystemToggle from "@/app/system/{components}/SystemToggle";

export default function Page() {

    usePrefetchQuery(systemApiServices.getPrivateSystemConfig());

    const {data: publicSystemConfig, refetch: publicRefetch} = useQuery(systemApiServices.getPublicSystemConfig());

    const [loading, setLoading] = useState({type: '', status: false});
    const [setting, setSetting] = useState({} as System.Site);

    useEffect(() => {
        setSetting(publicSystemConfig?.site);
    }, [publicSystemConfig]);
    
    const onChangeHandler = (e: ChangeEvent<HTMLInputElement>) => {
        setSetting({...setting, [e.target.name]: e.target.value});
    }

    const onClickHandler = () => {
        const body = {
            key: Key.SITE,
            value: {...publicSystemConfig?.site, ssl: !setting.ssl}
        } as System.Request<System.Site>;

        setLoading({type: 'ssl', status: true});

        systemApiServices.save({body})
            .then(() => {
                publicRefetch();
            })
            .finally(() => {
                setLoading({type: 'ssl', status: false});
            })
    }

    const onSaveHandler = (key: string) => {

        const body = {
            key: Key.SITE,
            value: {...publicSystemConfig?.site, [key] : setting[key]}
        } as System.Request<System.Site>;

        setLoading({type: key, status: true});

        systemApiServices.save({body})
            .then(() => {
                publicRefetch();
            })
            .finally(() => {
                setLoading({type: key, status: false});
            })
    }

    const onInitHandler = (key: string) => {
        const initValue = {
            'domain': 'localhost',
            'ssl': false,
            'cdnUrl': '',
        } as {[key: string]: string | boolean};

        const body = {
            key: Key.SITE,
            value: {...publicSystemConfig?.site, [key] : initValue[key]}
        } as System.Request<System.Site>;

        setLoading({type: key, status: true});

        systemApiServices.save({body})
            .then(() => {
                publicRefetch();
            })
            .finally(() => {
                setLoading({type: key, status: false});
            });
    }


    return (
        <div className={'flex flex-col gap-3'}>
            <SystemContainer headline={'도메인 설정'}>
                <p className={'list-item ms-4 text-sm text-gray-600 whitespace-pre-line'}>
                    사이트 도메인 주소를 포트번호 포함해서 입력하세요. (80,433의 경우 생략 가능) <br/>
                    기본값: localhost:3000 <br/>
                    예) example.com
                </p>
                <div className={'flex space-x-3.5'}>
                    <input className={'w-96 p-2 text-sm outline-0 duration-300 drop-shadow focus:bg-gray-200'}
                           name={'domain'}
                           placeholder={'http(s):// 제외하고 도메인만 입력하세요. example.com'}
                           value={setting?.domain}
                           onChange={onChangeHandler}

                    />
                    <button className={'bg-blue-600 text-sm text-white py-2 w-14 drop-shadow disabled:bg-gray-500'}
                            onClick={() => onSaveHandler('domain')}
                            disabled={loading.type === 'domain' && loading.status}
                    >
                        {
                            loading.type === 'domain' && loading.status
                                ? <LoadingSpinner size={10} />
                                : '저장'
                        }
                    </button>
                    <button className={'bg-red-600 text-sm text-white py-2 w-14 drop-shadow disabled:bg-gray-500'}
                            onClick={() => onInitHandler('domain')}
                            disabled={loading.type === 'domain' && loading.status}
                    >
                        {
                            loading.type === 'domain' && loading.status
                                ? <LoadingSpinner size={10} />
                                : '초기화'
                        }
                    </button>
                </div>
            </SystemContainer>
            <SystemContainer headline={'CDN SERVER 설정'}>
                <p className={'list-item ms-4 text-sm text-gray-600 whitespace-pre-line'}>
                    기본값: /files (http://localhost:3000/files 의미) <br/>
                    http(s):// 포함하여 입력하세요. https://example.com
                </p>
                <div className={'flex space-x-3.5'}>
                    <input className={'w-96 p-2 text-sm outline-0 drop-shadow focus:bg-gray-200 duration-300'}
                           name={'cdnUrl'}
                           placeholder={'http(s):// 포함하여 입력하세요. https://example.com'}
                           value={setting?.cdnUrl}
                           onChange={onChangeHandler}

                    />
                    <button className={'bg-blue-600 text-sm text-white py-2 w-14 drop-shadow disabled:bg-gray-500'}
                            onClick={() => onSaveHandler('cdnUrl')}
                            disabled={loading.type === 'domain' && loading.status}
                    >
                        {
                            loading.type === 'cdnUrl' && loading.status
                                ? <LoadingSpinner size={10} />
                                : '저장'
                        }
                    </button>
                    <button className={'bg-red-600 text-sm text-white py-2 w-14 drop-shadow disabled:bg-gray-500'}
                            onClick={() => onInitHandler('cdnUrl')}
                            disabled={loading.type === 'cdnUrl' && loading.status}
                    >
                        {
                            loading.type === 'cdnUrl' && loading.status
                                ? <LoadingSpinner size={10} />
                                : '초기화'
                        }
                    </button>
                </div>
            </SystemContainer>

            <SystemContainer headline={'SSL 적용'}>
                <p className={'list-item ms-4 text-sm text-gray-600 whitespace-pre-line'}>
                    프록시 서버로 SSL 인증을 사용하는 경우 체크하세요.
                </p>
                <SystemToggle toggle={setting?.ssl} onClick={onClickHandler} />
            </SystemContainer>
        </div>
    )
}