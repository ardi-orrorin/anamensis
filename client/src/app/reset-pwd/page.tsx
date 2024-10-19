'use client';

import {useEffect, useState} from "react";
import apiCall from "@/app/{commons}/func/api";
import Footer from "@/app/find-user/{components}/footer";
import {User} from "@/app/login/{services}/types";
import systemApiServices from "@/app/system/{services}/apiServices";
import {useQuery} from "@tanstack/react-query";
import DisabledPage from "@/app/{components}/system/disabledPage";
import {useRouter} from "next/navigation";

export default function Page() {
    const router = useRouter();
    const {data: publicSystemConfig} = useQuery(systemApiServices.getPublicSystemConfig());

    const [resetPwd, setResetPwd] = useState<User.ResetPwd>({
        progress: User.ResetPwdProgress.CONFIRMED,
    } as User.ResetPwd);
    const [response, setResponse] = useState({} as User.ResetPwdVerified);
    const [sendCode, setSendCode] = useState(false);
    const [pwd, setPwd] = useState({} as User.Password);

    const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;

    useEffect(() => {
        if(!publicSystemConfig?.sign_up?.emailVerification) {
            const timer = setTimeout(() => {
                router.push('/');
            }, 2000);
            return () => clearTimeout(timer);
        }
    }, []);

    const onResetPwdChangeHandler = (e: React.ChangeEvent<HTMLInputElement>) => {
        setResetPwd({
            ...resetPwd,
            [e.target.name]: e.target.value
        });
    }

    const onPwdChangeHandler = (e: React.ChangeEvent<HTMLInputElement>) => {
        setPwd({
            ...pwd,
            [e.target.name]: e.target.value
        });
    }

    const submitHandler = async (resetPwdProgress: User.ResetPwdProgress) => {
        if(pwd && pwd.pwd !== pwd.pwdCheck) {
            return alert('비밀번호가 일치하지 않습니다');
        }

        const body = {...resetPwd, pwd: pwd.pwd, progress: resetPwdProgress};

        await sendVerifyCodeHandler(body);
    }

    const sendVerifyCodeHandler = async (body: User.ResetPwd) => {
        try {
             const res = await apiCall<User.ResetPwdResponse, User.ResetPwd>({
                 path: '/api/reset-pwd',
                 method: 'POST',
                 body,
                 isReturnData: true
             })

            setResponse({
                ...response,
                [res.progress.toLowerCase()] : res.verified
            });

            setResetPwd({
                    ...resetPwd,
                 isVerified: res.verified
            });

            result(res);
        } catch (e) {
            console.log(e);
        }
    }

    const result = ({progress, verified}:User.ResetPwdResponse) => {
        if(progress === User.ResetPwdProgress.CONFIRMED && !verified){
            return alert('계정을 찾을 수 없습니다');
        }

        if(progress === User.ResetPwdProgress.VERIFIED && !verified){
            return alert('인증번호가 일치하지 않습니다');
        }

        if(progress === User.ResetPwdProgress.RESET && verified){
            alert('비밀번호가 변경되었습니다');
            return location.href = '/';
        }
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
                    >비밀번호 찾기</h3>
                </div>
                <div className={'flex flex-col px-2'}>
                    <div className={'flex'}>
                        <input
                            className={'w-full border border-none outline-0 focus:bg-blue-100 duration-300 text-xs rounded my-2 p-2'}
                            placeholder={'ID를 입력하세요'}
                            name={'userId'}
                            value={resetPwd.userId}
                            disabled={response.confirmed}
                            onChange={onResetPwdChangeHandler}
                        />
                    </div>
                    <div className={'flex'}>
                        <input
                            className={'w-full border border-none outline-0 focus:bg-blue-100 duration-300 text-xs rounded my-2 p-2'}
                            placeholder={'EMAIL을 입력하세요'}
                            name={'email'}
                            value={resetPwd.email}
                            disabled={response.confirmed}
                            onChange={onResetPwdChangeHandler}
                        />
                    </div>
                    <div className={['flex duration-500', response.confirmed ? 'max-h-52' : 'max-h-0'].join(' ')}>
                        <input
                            className={'w-full border border-none outline-0 focus:bg-blue-100 duration-300 text-xs rounded my-2 p-2'}
                            placeholder={'인증번호 6자리를 입력하세요'}
                            maxLength={6}
                            name={'verifyCode'}
                            value={resetPwd.verifyCode}
                            disabled={response.verified}
                            onChange={onResetPwdChangeHandler}
                        />
                    </div>
                    <div className={['flex duration-500', response.verified ? 'max-h-52' : 'max-h-0'].join(' ')}>
                        <input
                            className={'w-full border border-none outline-0 focus:bg-blue-100 duration-300 text-xs rounded my-2 p-2'}
                            placeholder={'새로운 비밀번호 입력하세요'}
                            name={'pwd'}
                            value={pwd.pwd}
                            disabled={response.reset}
                            onChange={onPwdChangeHandler}
                        />
                    </div>
                    <div className={['flex duration-500', response.verified ? 'max-h-52' : 'max-h-0'].join(' ')}>
                        <input
                            className={'w-full border border-none outline-0 focus:bg-blue-100 duration-300 text-xs rounded my-2 p-2'}
                            placeholder={'새로운 비밀번호 입력하세요 (재입력)'}
                            name={'pwdCheck'}
                            value={pwd.pwdCheck}
                            disabled={response.reset}
                            onChange={onPwdChangeHandler}
                        />
                    </div>
                    {
                        !response.confirmed
                        && !response.verified
                        && !response.reset
                        && <div>
                            <button className={[
                                'w-full rounded  duration-300 text-xs text-white my-2 p-2 bg-blue-300 hover:text-white hover:bg-blue-700'
                                , emailRegex.test(resetPwd.email) ? 'bg-blue-600' : 'bg-gray-700'
                            ].join(' ')}
                                    onClick={()=>submitHandler(User.ResetPwdProgress.CONFIRMED)}
                            > 인증번호 전송
                            </button>
                        </div>
                    }
                    {
                        response.confirmed
                        && !response.verified
                        && !response.reset
                        && <div>
                          <button className={[
                              'w-full rounded  duration-300 text-xs text-white my-2 p-2 bg-blue-300 '
                              , resetPwd?.verifyCode?.length === 6
                              ? 'bg-blue-600 hover:text-white hover:bg-blue-700'
                              : 'bg-gray-700'
                          ].join(' ')}
                                  onClick={()=>submitHandler(User.ResetPwdProgress.VERIFIED)}
                          > 인증번호 확인
                          </button>
                        </div>
                    }
                    {
                        response.confirmed
                        && response.verified
                        && !response.reset
                        && <div>
                        <button className={[
                            'w-full rounded  duration-300 text-xs text-white my-2 p-2 bg-blue-300 '
                            , resetPwd?.verifyCode?.length === 6
                                ? 'bg-blue-600 hover:text-white hover:bg-blue-700'
                                : 'bg-gray-700'
                        ].join(' ')}
                                onClick={()=>submitHandler(User.ResetPwdProgress.RESET)}
                        > 비밀번호 변경
                        </button>
                      </div>
                    }
                </div>
                <Footer />
            </div>
        </div>
    )
}