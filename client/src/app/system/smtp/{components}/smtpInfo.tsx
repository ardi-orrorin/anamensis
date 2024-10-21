'use client';

import React, {useEffect, useState} from "react";
import LoadingSpinner from "@/app/{commons}/LoadingSpinner";
import {SystemSMTP} from "@/app/system/smtp/{services}/types";
import {useQuery} from "@tanstack/react-query";
import systemApiServices from "@/app/system/{services}/apiServices";
import {System} from "@/app/system/{services}/types";

export default function SmtpInfo() {
    const [smtp, setSmtp] = useState({} as SystemSMTP.Smtp);
    const [loading, setLoading] = useState(false);
    const [response, setResponse] = useState({} as SystemSMTP.Response);
    const [moreDescription, setMoreDescription] = useState(false);

    const {data: systemConfig, refetch: privateRefetch} = useQuery(systemApiServices.getPrivateSystemConfig());
    const {refetch: publicRefetch} = useQuery(systemApiServices.getPublicSystemConfig());

    useEffect(() => {
        setSmtp(systemConfig.smtp);
    },[systemConfig]);

    const setSmtpHandler = (e: React.ChangeEvent<HTMLInputElement>) => {
        setSmtp({...smtp, [e.target.name]: e.target.value})
    }

    const save = ({enabled}:{enabled?: boolean}) => {
        const body = {
            key: System.Key.SMTP,
            value: enabled === undefined ? smtp : {...smtp, enabled}
        } as System.Request<SystemSMTP.Smtp>;

        setLoading(true);

        systemApiServices.save({body})
            .then(() => {
                privateRefetch();
                publicRefetch();
                setResponse({status: 'success', message: '저장되었습니다.'});
            })
            .catch((e) => {
                setResponse({status: 'error', message: '저장에 실패했습니다.'});
            })
            .finally(() => {
                setLoading(false);
            });
    }

    const init = () => {
        setLoading(true);

        systemApiServices.initSystemConfig({key: System.Key.SMTP})
            .then(() => {
                privateRefetch();
                publicRefetch();
                setResponse({status: 'success', message: '초기화되었습니다.'});
            })
            .catch((e) => {
                setResponse({status: 'error', message: '초기화에 실패했습니다.'});
            })
            .finally(() => {
                setLoading(false);
            });
    }

    const handleToggle = () => {
        if(!systemConfig?.smtp?.enabled && !systemConfig?.smtp?.host) return;
        save({enabled: !systemConfig?.smtp?.enabled});
    };

    const inputStyle = 'outline-0 focus:bg-gray-700 focus:bg-opacity-15 px-2 py-1.5 text-sm duration-500 disabled:bg-gray-400 disabled:text-white';

    return (
        <div className={'w-full'}>
            <div className={'flex gap-3 items-center'}>
                <div className={`relative w-12 h-6 ${systemConfig?.smtp?.enabled ? 'bg-gray-700' : 'bg-gray-300'} rounded cursor-pointer transition duration-300 ease-in-out`}
                     onClick={handleToggle}
                >
                    <div
                        className={`absolute w-6 h-6 bg-white shadow-md rounded transform transition-transform duration-300 ease-in-out ${systemConfig?.smtp?.enabled ? 'translate-x-6' : ''}`}
                    ></div>
                </div>
                <input className={'w-52 ' + inputStyle}
                       placeholder={'host'}
                       name={'host'}
                       value={smtp?.host ?? ''}
                       onChange={setSmtpHandler}
                       disabled={loading}
                />
                <input className={'w-20 ' + inputStyle}
                       placeholder={'port'}
                       name={'port'}
                       value={smtp?.port ?? ''}
                       maxLength={5}
                       onChange={setSmtpHandler}
                       disabled={loading}
                />
                <input className={'w-40 ' + inputStyle}
                       placeholder={'username'}
                       name={'username'}
                       value={smtp?.username ?? ''}
                       onChange={setSmtpHandler}
                       disabled={loading}
                />
                <input className={'w-40 ' + inputStyle}
                       placeholder={'password'}
                       name={'password'}
                       value={smtp?.password ?? ''}
                       onChange={setSmtpHandler}
                       disabled={loading}
                       type={'password'}
                />
                <button className={['min-w-16 text-xs text-white p-2 duration-500',
                    !loading ? 'bg-blue-600 hover:bg-blue-800' : 'bg-gray-400 hover:bg-gray-600'
                ].join(' ')}
                        onClick={() => save({})}
                        disabled={loading}
                >
                    {loading ? <LoadingSpinner size={10}/> : '저장'}
                </button>
                <button className={['min-w-16 text-xs text-white p-2 duration-500',
                    !loading ? 'bg-red-600 hover:bg-red-800' : 'bg-gray-400 hover:bg-gray-600'
                ].join(' ')}
                        onClick={init}
                        disabled={loading}
                >초기화
                </button>
                {
                    response?.status
                    && <div className={`py-2 text-xs ${response.status === 'success' ? 'text-blue-700' : 'text-red-500'}`}>
                        {response.message}
                  </div>
                }
            </div>

            <div className={'flex flex-col gap-1 py-2'}>
                <div className={'flex gap-2 items-end'}>
                    <h1 className={'text-sm text-gray-600'}>
                        활용 기능 목록
                    </h1>
                    <button className={'text-xs'}
                            onClick={() => setMoreDescription(!moreDescription)}
                    >
                        {moreDescription ? '접기' : '펼치기'}
                    </button>
                </div>
                <div className={`list-disc space-y-1 text-xs text-yellow-600 ${moreDescription ? 'h-36 py-1' : 'h-0'} duration-300 overflow-y-hidden`}>
                    <li>회원가입(이메일 인증)</li>
                    <li>비밀번호 찾기(이메일 인증)</li>
                    <li>아이디 찾기(이메일 인증)</li>
                    <li>로그인(이메일 인증)</li>
                    <li>계정 2차 인증 변경</li>
                    <li>질문 게시글 답변 알림</li>
                    <li>관리자 이메일 발송</li>
                </div>
            </div>
        </div>
    )
}