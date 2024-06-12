'use client';

import Link from "next/link";
import {useState} from "react";
import apiCall from "@/app/{commons}/func/api";

export type FindUser = {
    email: string;
    verifyCode: string;
    isVerify: boolean;
}

export type FindUserResponse = {
    verified: boolean;
    userId: string;
}

export default function page() {

    const [findUser, setFindUser] = useState<FindUser>({} as FindUser);
    const [sendCode, setSendCode] = useState<boolean>(false);
    const [responseId, setResponseId] = useState<FindUserResponse>({} as FindUserResponse);

    const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;

    const onChangeHandler = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (sendCode && e.target.name === 'email') setSendCode(false);

        setFindUser({
            ...findUser,
            [e.target.name]: e.target.value
        });
    }

    const sendVerifyCodeHandler = async () => {
        apiCall<boolean, FindUser>({
            path: '/api/find-user',
            method: 'POST',
            body: findUser,
            isReturnData: true
        }).then(res => {
            if(!res) return alert('가입된 이메일이 아닙니다.');
            alert('인증번호가 전송되었습니다.');
            setSendCode(true);
        }).catch(err => {
            console.log(err);
        });
    }

    const confirmVerifyCodeHandler = async () => {
        apiCall<FindUserResponse, FindUser>({
            path: '/api/find-user/id-confirm',
            method: 'POST',
            body: findUser,
            isReturnData: true
        }).then(res => {
            if(!res.verified) return alert('인증번호가 일치하지 않습니다.');
            setResponseId(res);
        }).catch(err => {
            console.log(err);
        });
    }

    return (
        <div className={'h-screen flex justify-center items-center'}>
            <div className={"flex flex-col gap-4 border border-solid b border-blue-300 sm:w-4/5 md:w-1/2 xl:w-1/3 w-full rounded pb-5"}>
                <div className={'flex flex-col gap-1 bg-blue-300 py-4'}>
                    <h3 className={'flex justify-center font-bold text-white text-base'}
                    >아이디 찾기</h3>
                </div>
                <div className={'flex flex-col px-2'}>
                    <div className={'flex'}>
                        <input
                            className={'w-full border border-none outline-0 focus:bg-blue-100 duration-300 text-xs rounded my-2 p-2'}
                            placeholder={'email을 입력하세요'}
                            name={'email'}
                            value={findUser.email}
                            onChange={onChangeHandler}
                        />
                    </div>
                    <div className={['flex duration-500', sendCode ? 'max-h-52' : 'max-h-0'].join(' ')}>
                        <input
                            className={'w-full border border-none outline-0 focus:bg-blue-100 duration-300 text-xs rounded my-2 p-2'}
                            placeholder={'인증번호 6자리를 입력하세요'}
                            maxLength={6}
                            name={'verifyCode'}
                            value={findUser.verifyCode}
                            onChange={onChangeHandler}
                        />
                    </div>
                    {
                        sendCode &&
                        <div className={['flex duration-500', sendCode ? 'max-h-52' : 'max-h-0'].join(' ')}>
                            <span className={['w-full text-xs my-2 p-2', responseId.verified ? 'text-blue-600' : 'text-red-600'].join(' ')}>
                                {
                                    responseId.verified
                                    && `해당 이메일로 가입한 아이디는 ${responseId.userId} 입니다.`
                                }
                            </span>
                        </div>
                    }
                    {
                        !sendCode
                        && <div>
                            <button className={[
                                'w-full rounded  duration-300 text-xs text-white my-2 p-2 bg-blue-300 hover:text-white hover:bg-blue-700'
                                , emailRegex.test(findUser.email) ? 'bg-blue-600' : 'bg-gray-700'
                            ].join(' ')}
                                    onClick={sendVerifyCodeHandler}
                            > 인증번호 전송
                            </button>
                        </div>
                    }
                    {
                        sendCode
                        && <div>
                          <button className={[
                              'w-full rounded  duration-300 text-xs text-white my-2 p-2 bg-blue-300 '
                              , findUser?.verifyCode?.length === 6
                              ? 'bg-blue-600 hover:text-white hover:bg-blue-700'
                              : 'bg-gray-700'
                          ].join(' ')}
                                  onClick={confirmVerifyCodeHandler}
                                  disabled={responseId.verified}
                          > 인증번호 확인
                          </button>
                        </div>
                    }
                </div>
                <div className={'flex justify-between px-3'}>
                    <Link href={'/find-user'}
                          className={'flex justify-center text-xs text-blue-500'}
                    >아이디 찾기</Link>
                    <Link href={'/signup'}
                          className={'flex justify-center text-xs text-blue-500'}
                    >회원 가입</Link>
                    <a href={'#'}
                       className={'flex justify-center text-xs text-blue-500'}
                    >비밀번호 찾기</a>
                </div>
            </div>
        </div>
    )
}