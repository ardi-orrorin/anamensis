'use client'

import React, {useEffect, useMemo, useState} from "react";
import Row from "@/app/signup/{components}/Row";
import EmailTemplate from "@/app/signup/{components}/EmailTemplate";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {faSpinner} from "@fortawesome/free-solid-svg-icons";
import {postExistFetch, postFetch} from "@/app/signup/{services}/fetch";
import {useRouter} from "next/navigation";

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


    const [user, setUser] = useState<UserProps>({
        id         : '',
        pwd        : '',
        pwdCheck   : '',
        name       : '',
        email      : '',
        emailCheck : '',
        phone      : ''
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

        // CheckType axios 처리

        setCheck({
            id         : id.length === 0 ? 'uncheck'
                       : idRegex.test(id) ? 'check'
                       : 'notCheck',

            pwd        : pwd.length === 0 ? 'uncheck'
                       : pwdRegex.test(pwd) ? 'check'
                       : 'notCheck',

            pwdCheck   : pwdCheck.length === 0 ? 'uncheck'
                       : pwd === pwdCheck ? 'check'
                       : 'notCheck',

            name       : name.length === 0 ? 'uncheck'
                       : 'check',

            email      : email.length === 0 ? 'uncheck'
                       : emailRegex.test(email) ? 'check'
                       : 'notCheck',

            emailCheck : emailCheck.length === 0 ? 'uncheck'
                       : 'check',

            phone      : phone.length === 0 ? 'uncheck'
                       : phoneRegex.test(phone) ? 'check'
                       : 'notCheck',
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
        }
    }

    const inputCheck = (checkType: CheckType) => {
        return checkType === 'uncheck' ? ''
            : checkType === 'check' ? 'text-blue-500'
            : checkType === 'notCheck' ? 'text-red-500'
            : '';
    };

    const allCheck = useMemo(() => {
        const {id, pwd, pwdCheck, name, email, phone} = check;
        return id && pwd && pwdCheck && name && email && phone;
    },[check]);

    const submitHandler = async () => {
        await setLoading(true);
        await postFetch(user)
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
        return await postExistFetch(data)
            .then((res) => {
                return res.data.message === 'true'
            });
    }

    return (
        <main className={'flex flex-col min-h-screen justify-center items-center'}>
            <div className={"flex flex-col gap-4 border border-solid b border-blue-300 sm:w-4/5 md:w-1/2 xl:w-1/3 w-full rounded pb-5"}>
                <div className={'flex flex-col gap-1 bg-blue-300 py-4'}>
                    <h1 className={'flex justify-center font-bold text-white text-xl'}
                    >Anamensis</h1>
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
                    />
                    <Row name={'pwd'}
                         value={user}
                         check={check}
                         placeholder={'영소대문자 + 숫자 포함하여 8자리 이상의 비밀번호 입력하세요.'}
                         setProps={setProps}
                         inputCheck={inputCheck}
                    />
                    <Row className={[user.pwd.length >= 8 ? 'max-h-52' : 'max-h-0', 'duration-500'].join(' ')}
                         name={'pwdCheck'}
                         value={user}
                         check={check}
                         placeholder={'비밀번호를 재입력 입력하세요.'}
                         setProps={setProps}
                         inputCheck={inputCheck}

                    />
                    <Row name={'name'}
                         value={user}
                         check={check}
                         placeholder={'이름을 입력하세요.'}
                         setProps={setProps}
                         inputCheck={inputCheck}
                    />
                    <Row name={'email'}
                         value={user}
                         check={check}
                         placeholder={'이메일을 입력하세요.'}
                         setProps={setProps}
                         inputCheck={inputCheck}
                    />
                    <EmailTemplate className={user.email.length > 0 && !emailSelect ? 'max-h-52' : 'max-h-0'}
                                   id={user.email}
                                   domain={''}
                                   order={0}
                                   user={user}
                                   setUser={setUser}
                                   setEmailSelect={setEmailSelect}
                    />
                    <Row className={[emailRegex.test(user.email)? 'max-h-52' : 'max-h-0', 'duration-500'].join(' ')}
                         name={'emailCheck'}
                         value={user}
                         check={check}
                         placeholder={'6자리 인증번호 입력하세요.'}
                         setProps={setProps}
                         inputCheck={inputCheck}
                    />
                    <Row name={'phone'}
                         value={user}
                         check={check}
                         placeholder={'휴대폰 번호를 입력하세요. ex) 010-1234-5678'}
                         setProps={setProps}
                         inputCheck={inputCheck}
                    />
                    <div>
                        <button className={['w-full rounded duration-300 text-xs text-white p-2', allCheck && 'hover:bg-blue-600', allCheck ? 'bg-blue-300' : 'bg-gray-400'].join(' ')}
                                disabled={!allCheck}
                                onClick={submitHandler}
                        >{
                            loading
                            ? <FontAwesomeIcon width={12} className={'animate-spin'} icon={faSpinner} />
                            : '회원가입'
                        }
                    </button>
                    </div>
                </div>
            </div>
        </main>
    )
}

