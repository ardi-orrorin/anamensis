'use client';

import React, {useEffect, useState} from "react";
import LoadingSpinner from "@/app/{commons}/LoadingSpinner";
import {SMTP} from "@/app/system/smtp/{services}/types";
import smtpApiServices from "@/app/system/smtp/{services}/apiServices";
import {useQuery} from "@tanstack/react-query";
import systemApiServices from "@/app/system/{services}/apiServices";
import {System} from "@/app/system/{services}/types";

export default function SmtpInfo() {
    const [smtp, setSmtp] = useState({} as SMTP.Smtp);
    const [loading, setLoading] = useState(false);
    const [errResponse, setErrResponse] = useState('');

    const {data: systemConfig, refetch} = useQuery(systemApiServices.getSystemConfig());

    useEffect(() => {
        setSmtp(systemConfig.smtp);
    },[systemConfig]);

    const setSmtpHandler = (e: React.ChangeEvent<HTMLInputElement>) => {
        setSmtp({...smtp, [e.target.name]: e.target.value})
    }

    const save = () => {
        const body = {
            key: System.Key.SMTP,
            value: smtp
        } as System.Request<SMTP.Smtp>;

        setLoading(true);

        smtpApiServices.save({body})
            .then(() => {
                refetch();
                setErrResponse('');
            })
            .catch((e) => {
                setErrResponse('저장에 실패했습니다.');
            })
            .finally(() => {
                setLoading(false);
            });
    }

    const init = () => {
        setLoading(true);

        systemApiServices.initSystemConfig({key: System.Key.SMTP})
            .then(() => {
                refetch();
                setErrResponse('');
            })
            .catch((e) => {
                setErrResponse('초기화에 실패했습니다.');
            })
            .finally(() => {
                setLoading(false);
            });
    }

    const inputStyle = 'outline-0 focus:bg-gray-700 focus:bg-opacity-15 p-2 text-sm rounded duration-500';

    return (
        <main className={'w-full flex flex-col border border-gray-300 px-2 py-3  rounded gap-2 duration-500'}>
            <h1 className={'min-w-20 px-1'}>SMTP 등록</h1>
            <div className={'w-full'}>
                <div className={'flex gap-3 items-center'}>
                    <input className={'w-52 ' + inputStyle}
                           placeholder={'host'}
                           name={'host'}
                           value={smtp?.host ?? ''}
                           onChange={setSmtpHandler}

                    />
                    <input className={'w-20 ' + inputStyle}
                           placeholder={'port'}
                           name={'port'}
                           value={smtp?.port ?? ''}
                           maxLength={5}
                           onChange={setSmtpHandler}
                    />
                    <input className={'w-40 ' + inputStyle}
                           placeholder={'username'}
                           name={'username'}
                           value={smtp?.username ?? ''}
                           onChange={setSmtpHandler}
                    />
                    <input className={'w-40 ' + inputStyle}
                           placeholder={'password'}
                           name={'password'}
                           value={smtp?.password ?? ''}
                           onChange={setSmtpHandler}
                    />
                    <button className={['min-w-16 text-xs text-white p-2 duration-500',
                        !loading ? 'bg-blue-600 hover:bg-blue-800' : 'bg-gray-400 hover:bg-gray-600'
                    ].join(' ')}
                            onClick={save}
                            disabled={loading}
                    >
                        {loading ? <LoadingSpinner size={10} /> : '저장'}
                    </button>
                    <button className={['min-w-16 text-xs text-white p-2 duration-500',
                        !loading ? 'bg-red-600 hover:bg-red-800' : 'bg-gray-400 hover:bg-gray-600'
                    ].join(' ')}
                            onClick={init}
                            disabled={loading}
                    >초기화
                    </button>
                </div>
                {
                    errResponse
                    && <div className={'p-2 text-xs text-red-500'}>
                        {errResponse}
                    </div>
                }
            </div>
        </main>
    )
}