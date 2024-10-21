'use client';

import SystemContainer from "@/app/system/{components}/systemContainer";
import systemApiServices from "@/app/system/{services}/apiServices";
import {useQuery} from "@tanstack/react-query";
import React from "react";
import {System} from "@/app/system/{services}/types";
import {SystemAccount} from "@/app/system/account/types";
import SystemToggle from "@/app/system/{components}/SystemToggle";

export default function Page() {

    const {data: publicSystemConfig, refetch: publicRefetch} = useQuery(systemApiServices.getPublicSystemConfig());
    const {data: privateSystemConfig, refetch: privateRefetch} = useQuery(systemApiServices.getPrivateSystemConfig());

    const changeSignUpEnabledHandler = () => {
        const body = {
            key: System.Key.SIGN_UP,
            value: {
                ...publicSystemConfig?.sign_up,
                enabled: !publicSystemConfig?.sign_up?.enabled
            }
        } as System.Request<SystemAccount.SignUp>;

        systemApiServices.save({body})
            .then(() => {
                privateRefetch();
                publicRefetch();
            });
    }

    const changeSignUpEmailVerificaitonHandler = () => {
        if(!privateSystemConfig?.smtp?.enabled) {
            return alert('SMTP를 활성화해야 합니다.');
        }

        const body = {
            key: System.Key.SIGN_UP,
            value: {
                ...publicSystemConfig?.sign_up,
                emailVerification: !publicSystemConfig?.sign_up?.emailVerification
            }
        } as System.Request<SystemAccount.SignUp>;

        systemApiServices.save({body})
            .then(() => {
                privateRefetch();
                publicRefetch();
            });
    }


    const changeLoginEmailAuthHandler = () => {
        if(!privateSystemConfig?.smtp?.enabled) {
            return alert('SMTP를 활성화해야 합니다.');
        }

        const body = {
            key: System.Key.LOGIN,
            value: {
                ...publicSystemConfig?.login,
                emailAuth: !publicSystemConfig?.login?.emailAuth
            }
        } as System.Request<SystemAccount.Login>;

        systemApiServices.save({body})
            .then(() => {
                privateRefetch();
                publicRefetch();
            });
    }

    return (
        <div className={'flex flex-col gap-3'}>
            <SystemContainer headline={'회원 가입'}>
                <div className={'flex flex-col gap-2 text-sm'}>
                    <p className={'list-item ms-4 text-sm text-gray-600 whitespace-pre-line'}>
                        회원 가입 기능을 활성화합니다.
                    </p>
                    <SystemToggle toggle={publicSystemConfig?.sign_up?.enabled}
                                  onClick={changeSignUpEnabledHandler}
                    />
                </div>
            </SystemContainer>
            <SystemContainer headline={'이메일 인증'}>
                <div className={'flex flex-col gap-2 text-sm'}>
                    <p className={'list-item ms-4 text-sm text-gray-600 whitespace-pre-line'}>
                        회원 가입, 아이디 찾기, 비밀번호 찾기 기능에서 이메일 인증을 사용합니다.
                    </p>
                    <RequiredToggle requiredText={'SMTP 활성화'}
                                    requiredValue={privateSystemConfig?.smtp?.enabled}
                    />
                    <SystemToggle toggle={publicSystemConfig?.sign_up?.emailVerification}
                                  onClick={changeSignUpEmailVerificaitonHandler}
                    />
                </div>
            </SystemContainer>
            <SystemContainer headline={'로그인 2차 이메일 인증'}>
                <div className={'flex flex-col gap-2 text-sm'}>
                    <p className={'list-item ms-4 text-sm text-gray-600 whitespace-pre-line'}>
                        로그인에서 사용되는 2차인증 중 이메일 인증 활성화여부를 체크합니다.
                    </p>
                    <RequiredToggle requiredText={'SMTP 활성화'}
                                    requiredValue={privateSystemConfig?.smtp?.enabled}
                    />
                    <SystemToggle toggle={publicSystemConfig?.login?.emailAuth}
                                  onClick={changeLoginEmailAuthHandler}
                    />
                </div>
            </SystemContainer>
        </div>
)
}

const RequiredToggle = ({
    requiredText, requiredValue
}: {
    requiredText    : string,
    requiredValue   : boolean
}) => {
    return (
        <p className={'list-item ms-4 text-sm text-yellow-600 space-x-2 whitespace-pre-line'}>
            <span className={'text-yellow-600 text-xs'}>
                요구조건: {requiredText}
            </span>
            <span className={`text-xs font-bold ${requiredValue ? 'text-blue-600' : 'text-red-600'}`}>
                (현재값 : {requiredValue ? '활성' : '비활성'})
            </span>
        </p>
    );
}