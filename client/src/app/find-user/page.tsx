'use client';

import {useEffect, useState} from "react";
import apiCall from "@/app/{commons}/func/api";
import Footer from "@/app/find-user/{components}/footer";
import {User} from "@/app/login/{services}/types";
import {useQuery} from "@tanstack/react-query";
import systemApiServices from "@/app/system/{services}/apiServices";
import {useRouter} from "next/navigation";
import DisabledPage from "@/app/{components}/system/disabledPage";

export default function Page() {

    const [findUser, setFindUser] = useState({} as User.FindUser);
    const [sendCode, setSendCode] = useState(false);
    const [responseId, setResponseId] = useState({} as User.FindUserResponse);
    const router = useRouter();

    const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;

    const {data: publicSystemConfig} = useQuery(systemApiServices.getPublicSystemConfig());

    useEffect(() => {
        if(!publicSystemConfig?.sign_up?.emailVerification) {
            const timer = setTimeout(() => {
                router.push('/');
            }, 2000);
            return () => clearTimeout(timer);
        }

    }, []);

    const onChangeHandler = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (sendCode && e.target.name === 'email') setSendCode(false);

        setFindUser({
            ...findUser,
            [e.target.name]: e.target.value
        });
    }

    const sendVerifyCodeHandler = async () => {
        apiCall<boolean, User.FindUser>({
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
        apiCall<User.FindUserResponse, User.FindUser>({
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

    if(!publicSystemConfig?.sign_up?.emailVerification) {
        const body = {
            title: '아이디 찾기 기능을 사용할 수 없습니다.',
            description: '시스템에서 아이디 찾기 기능을 비활성화 했습니다. 관리자에게 문의하세요.',
        }

        return <DisabledPage {...body} />
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
                <Footer />
            </div>
        </div>
    )
}