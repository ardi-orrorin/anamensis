'use client'

import React, {useEffect, useMemo, useState} from "react";
import Row from "@/app/signup/Row";
import EmailTemplate from "@/app/signup/EmailTemplate";
import {useRouter} from "next/navigation";
import LoadingSpinner from "@/app/{commons}/LoadingSpinner";
import axios from "axios";

export interface UserProps {
    id            : string;
    pwd           : string;
    pwdCheck      : string;
    name          : string;
    email         : string;
    emailCheck    : string;
    phone         : string;
    [key: string] : string;
}

export type CheckProps = {
    id            : CheckType;
    pwd           : CheckType;
    pwdCheck      : CheckType;
    name          : CheckType;
    email         : CheckType;
    emailCheck    : CheckType;
    phone         : CheckType;
    [key: string] : CheckType;
}

export type ExistProps = {
    type         : string;
    value        : string;
    [key: string]: string;
}

export type CheckType = 'check' | 'uncheck' | 'notCheck';

export default function Page() {

    const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    const idRegex = /^[a-z0-9]{5,20}$/;
    const pwdRegex =  /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[a-zA-Z\d]{8,}$/;
    const phoneRegex = /^\d{3}-\d{3,4}-\d{4}$/;

    const router = useRouter();

    const [emailSelect, setEmailSelect] = useState<boolean>(false);
    const [loading, setLoading] = useState<boolean>(false);
    const [timer, setTimer] = useState<number>(-1);

    const [user, setUser] = useState<UserProps>({
        id         : '',
        pwd        : '',
        pwdCheck   : '',
        name       : '',
        email      : '',
        emailCheck : '',
        phone      : '',
    });

    const [check, setCheck] = useState<CheckProps>({
        id         : 'uncheck',
        pwd        : 'uncheck',
        pwdCheck   : 'uncheck',
        name       : 'uncheck',
        email      : 'uncheck',
        emailCheck : 'uncheck',
        phone      : 'uncheck',
    });

    useEffect(() => {
        const {id, pwd, pwdCheck, name, email, emailCheck, phone} = user;

        setCheck({
            id         : id.length === 0 ? 'uncheck' : check.id,

            pwd        : pwd.length === 0 ? 'uncheck'
                       : pwdRegex.test(pwd) ? 'check'
                       : 'notCheck',

            pwdCheck   : pwdCheck.length === 0 ? 'uncheck'
                       : pwd === pwdCheck ? 'check'
                       : 'notCheck',

            name       : name.length === 0 ? 'uncheck'
                       : 'check',

            email      : email.length === 0 ? 'uncheck' : check.email,

            emailCheck : emailCheck.length === 0 ? 'uncheck'
                       : check.emailCheck,

            phone      : phone.length === 0 ? 'uncheck' : check.phone,
        });
    },[user]);


    const setProps = (e: React.ChangeEvent<HTMLInputElement>) => {
        const {name, value} = e.target;

        if(name === 'pwd' && value.length < 8) {
            setUser({
                ...user,
                pwd: value,
                pwdCheck: ''
            })
            return ;
        }

        setUser({
            ...user,
            [name]: value
        });

        if(name === 'email') {
            setEmailSelect(false);
            setTimer(-1);
        }


        if(name === 'id' || name === 'email' || name === 'phone') {
            if(name === 'id' && !idRegex.test(value)) {
                check.id = 'notCheck';
                return ;
            }
            if(name === 'phone' && !phoneRegex.test(value)) {
                check.phone = 'notCheck';
                return ;
            }

            checkHandler({type: name, value})
                .then((res) => {
                    setCheck({
                        ...check,
                        [name]: res.data.message === 'false' ? 'check' : 'notCheck'
                    });
                });
        }
    }

    const emailClickHandler = (value: string) => {
        setUser({
            ...user,
            email: value
        });

        setEmailSelect(true);

        checkHandler({type: 'email', value})
            .then((res) => {
                setCheck({
                    ...check,
                    email: res.data.message === 'false' ? 'check' : 'notCheck'
                });
            });
    }

    const inputCheck = (checkType: CheckType) => {
        return checkType === 'uncheck' ? ''
            : checkType === 'check' ? 'text-blue-500'
            : checkType === 'notCheck' ? 'text-red-500'
            : '';
    };

    const allCheck = useMemo(() => {
        const {id, pwd, pwdCheck, name, email, phone} = check;
        return id === 'check' &&
               pwd === 'check' &&
               pwdCheck === 'check' &&
               name === 'check' &&
               email === 'check' &&
               phone === 'check';
    },[check]);

    const submitHandler = async () => {
        await setLoading(true);
        await axios.post('/api/signup', user, {
                headers: {
                    'Content-Type': 'application/json'
                }
            })
            .then((res) => {
                if(res.request.status === 200) {
                    alert('회원가입이 완료되었습니다.');
                    router.push('/');
                }
            })
            .finally(() => {
                setLoading(false);
            });
    }

    const checkHandler = async (data: ExistProps) => {
        return await axios.post('/api/signup/exists', data, {
            headers: {
                'Content-Type': 'application/json'
            }
        })
    }

    const sendVerifyCode = async () => {
        await axios.post('/api/signup/code', {email: user.email}, {
            headers: {
                'Content-Type': 'application/json'
            }
        }).then((res) => {
            if(res.status === 200) {
                alert('인증번호가 전송되었습니다.');
            }
            checkTimer();
        });
    }

    const verifyCode = async () => {
        await axios.post('/api/signup/verify', {email: user.email, code: user.emailCheck}, {
            headers: {
                'Content-Type': 'application/json'
            }
        }).then((res) => {
            if(res.status === 200) {

                alert('인증이 완료되었습니다.');

                setCheck({
                    ...check,
                    emailCheck: 'check'
                });
            }
        });
    }

    const checkTimer = () => {
        let time = 10 * 60; // unit : second
        setTimer(time);
        const interval = setInterval(() => {
            if(time === 0) {
                clearInterval(interval);
            }
            time--;
            setTimer(time);
        }, 1000);
    }

    const transToTimerMinuteAndSecond = () => {
        const minute = Math.floor(timer / 60);
        const second = timer % 60;
        return `${minute}분 ${second}초`;
    };

    return (
        <main className={'flex flex-col min-h-screen justify-center items-center'}>
            <div className={"flex flex-col gap-4 border border-solid b border-blue-300 sm:w-4/5 md:w-1/2 xl:w-1/3 w-full rounded pb-5"}>
                <div className={'flex flex-col gap-1 bg-blue-300 py-4'}>
                    {/*<h1 className={'flex justify-center font-bold text-white text-xl'}*/}
                    {/*>Anamensis</h1>*/}
                    <h3 className={'flex justify-center font-bold text-white text-base'}
                    >Signup</h3>
                </div>
                <div className={'flex flex-col px-4'}>
                    <Row name={'id'}
                         value={user}
                         check={check}
                         placeholder={'아이디를 입력하세요.'}
                         setProps={setProps}
                         inputCheck={inputCheck}
                         description={'아이디는 5자리 이상 20자리 이하로 입력하세요.'}
                    />
                    <Row name={'pwd'}
                         value={user}
                         check={check}
                         placeholder={'영소대문자 + 숫자 포함하여 8자리 이상의 비밀번호 입력하세요.'}
                         setProps={setProps}
                         inputCheck={inputCheck}
                         description={'비밀번호는 8자리 이상이어야 합니다. 영 대소문자 + 숫자를 포함해야 합니다.'}
                    />
                    <Row className={[user.pwd.length >= 8 ? 'max-h-52' : 'max-h-0', 'duration-500'].join(' ')}
                         name={'pwdCheck'}
                         value={user}
                         check={check}
                         placeholder={'비밀번호를 재입력 입력하세요.'}
                         setProps={setProps}
                         inputCheck={inputCheck}
                         description={'비밀번호를 다시 입력하세요.'}

                    />
                    <Row name={'name'}
                         value={user}
                         check={check}
                         placeholder={'이름을 입력하세요.'}
                         setProps={setProps}
                         inputCheck={inputCheck}
                         description={'이름을 입력하세요.'}
                    />
                    <Row name={'email'}
                         value={user}
                         check={check}
                         placeholder={'이메일을 입력하세요.'}
                         setProps={setProps}
                         inputCheck={inputCheck}
                         disabled={timer >= 0}
                         description={'이메일을 입력하세요.'}
                    />
                    <EmailTemplate className={user.email.length > 0 && !emailSelect ? 'max-h-52' : 'max-h-0'}
                                   id={user.email}
                                   domain={''}
                                   order={0}
                                   emailClickHandler={emailClickHandler}
                    />
                    <div className={'flex'}>
                        <Row className={[emailRegex.test(user.email)? 'max-h-52' : 'max-h-0', 'w-full duration-500'].join(' ')}
                             name={'emailCheck'}
                             value={user}
                             check={check}
                             placeholder={'6자리 인증번호 입력하세요.'}
                             setProps={setProps}
                             inputCheck={inputCheck}
                             description={'이메일로 전송된 6자리 인증번호를 입력하세요.'}
                        />
                        {
                            timer >= 0 && emailRegex.test(user.email) && user.emailCheck.length === 6 &&
                            <button className={'w-1/4 my-3 ms-2 rounded text-xs text-white bg-blue-300'}
                                    onClick={verifyCode}
                            >
                              인증하기
                            </button>
                        }
                        <button className={[emailRegex.test(user.email)? 'max-h-52  my-3 ms-2' : 'max-h-0', timer >= 0 ? 'bg-gray-400' : 'bg-blue-300' , 'duration-500','w-1/4 rounded text-xs text-white'].join(' ')}
                                disabled={timer >= 0}
                                onClick={sendVerifyCode}
                        >
                            {timer >= 0 ? transToTimerMinuteAndSecond() : '인증번호 받기'}
                        </button>
                    </div>
                    <Row name={'phone'}
                         value={user}
                         check={check}
                         placeholder={'휴대폰 번호를 입력하세요. ex) 010-1234-5678'}
                         setProps={setProps}
                         inputCheck={inputCheck}
                         description={'휴대폰 번호를 입력하세요. ex) 010-1234-5678'}
                    />
                    <div>
                        <button className={['w-full rounded duration-300 text-xs text-white p-2', allCheck && 'hover:bg-blue-600', allCheck ? 'bg-blue-300' : 'bg-gray-400'].join(' ')}
                                disabled={!allCheck}
                                onClick={submitHandler}
                        >{
                            loading
                            ? <LoadingSpinner size={15} />
                            : '회원가입'
                        }
                        </button>
                    </div>
                </div>
            </div>
        </main>
    )
}

