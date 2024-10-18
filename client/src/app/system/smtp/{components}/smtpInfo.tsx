'use client';

import {useEffect, useState} from "react";
import LoadingSpinner from "@/app/{commons}/LoadingSpinner";
import {GetServerSideProps, InferGetServerSidePropsType} from "next";
import {useRouter} from "next/navigation";
import apiCall from "@/app/{commons}/func/api";
import {createDebounce} from "@/app/{commons}/func/debounce";
import {SMTP} from "@/app/system/smtp/{services}/types";
import smtpApiServices from "@/app/system/smtp/{services}/apiServices";

// todo test 과정 save에 한 번에 진행 백엔드 수정해야함

export default function SmtpInfo() {
    const [hasTest, setHasTest] = useState(false)
    const [smtp, setSmtp] = useState({} as SMTP.Smtp);
    const [loading, setLoading] = useState(false);
    const [testResult, setTestResult] = useState({} as SMTP.TestResponse);

    useEffect(() => {
        // todo: system 루트에서 받아온 값중 smtp 값만 가져오기
    },[]);

    const setSmtpHandler = (e: React.ChangeEvent<HTMLInputElement>) => {
        if(hasTest) setHasTest(false);
        setSmtp({...smtp, [e.target.name]: e.target.value})
    }

    const save = () => {
        setLoading(true);
        smtpApiServices.save({body: smtp})
            .then(() => {
                // todo: 시스템 세팅 값 재 호출
            })
            .finally(() => {
                setLoading(false);
            });
    }

    const modify = () => {

    }

    const init = () => {
        setSmtp({} as SMTP.Smtp);
    }

    const inputStyle = 'outline-0 focus:bg-blue-50 p-2 text-sm rounded duration-500';

    return (
        <main className={'w-full flex flex-col border border-gray-300 px-2 py-3 rounded gap-2 duration-500'}>
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
                    <button className={['min-w-16 text-sm text-white p-2 rounded duration-500',
                        !loading ? 'bg-blue-300 hover:bg-blue-400' : 'bg-gray-400 hover:bg-gray-600'
                    ].join(' ')}
                            onClick={save}
                            disabled={loading}
                    >저장
                    </button>
                    <button className={['min-w-16 text-sm text-white p-2 rounded duration-500',
                        !loading ? 'bg-red-300 hover:bg-red-400' : 'bg-gray-400 hover:bg-gray-600'
                    ].join(' ')}
                            onClick={init}
                            disabled={loading}
                    >초기화
                    </button>
                    {
                        hasTest &&
                      <div className={['text-sm', testResult.result ? 'text-green-500' : 'text-red-500'].join(' ')}>
                          {testResult.message}
                      </div>
                    }
                </div>
            </div>
        </main>
    )
}