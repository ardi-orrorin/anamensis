'use client'

import React, {useCallback, useMemo, useState} from "react";
import Row from "@/app/signup/{component}/Row";
import EmailTemplate from "@/app/signup/{component}/EmailTemplate";

export interface UserProps {
    id            : string;
    pwd           : string;
    pwdCheck      : string;
    name          : string;
    email         : string;
    phone         : string;
    [key: string] : string;
}

export type CheckProps = {
    id            : CheckType;
    pwd           : CheckType;
    pwdCheck      : CheckType;
    name          : CheckType;
    email         : CheckType;
    phone         : CheckType;
    [key: string] : CheckType;
}

export type CheckType = null | boolean;

export default function Page() {
    const [user, setUser] = useState<UserProps>({
        id       : '',
        pwd      : '',
        pwdCheck : '',
        name     : '',
        email    : '',
        phone    : ''
    });

    const [check, setCheck] = useState<CheckProps>({
        id       : null,
        pwd      : null,
        pwdCheck : null,
        name     : null,
        email    : null,
        phone    : null,
    });

    const [emailSelect, setEmailSelect] = useState<boolean>(false);

    const setProps = (e: React.ChangeEvent<HTMLInputElement>) => {
        const {name, value} = e.target;
        setUser({
            ...user,
            [name]: value
        });
        if(name === 'email' && emailSelect) {
            setEmailSelect(false);
        }
    }

    const inputCheck = useCallback((eleId: null | boolean) => {
        return eleId === null ? ''
             : eleId ? 'text-blue-500'
             : eleId ? 'text-red-500'
             : '';
    },[check]);

    const allCheck = useMemo(() => {
        const {id, pwd, pwdCheck, name, email, phone} = check;
        return id && pwd && pwdCheck && name && email && phone;
    },[check]);

    const checkRetryPassword = useMemo(() => {
        if(user.pwd.length > 0 && user.pwdCheck.length > 0) {
            return user.pwd === user.pwdCheck;
        }
        return false;
    },[user.pwd, user.pwdCheck]);

    return (
        <main className={'flex flex-col min-h-screen justify-center items-center'}>
            <div className={"flex flex-col gap-4 border border-solid b border-blue-300 rounded w-1/2 pb-5"}>
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
                         placeholder={'비밀번호 입력하세요.'}
                         setProps={setProps}
                         inputCheck={inputCheck}
                    />
                    <Row name={'pwdCheck'}
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
                    <Row name={'phone'}
                         value={user}
                         check={check}
                         placeholder={'휴대폰 번호를 입력하세요.'}
                         setProps={setProps}
                         inputCheck={inputCheck}
                    />
                    <div>
                        <button className={['w-full rounded duration-300 text-xs text-white p-2', allCheck && 'hover:bg-blue-600', allCheck ? 'bg-blue-300' : 'bg-gray-400'].join(' ')}
                                disabled={!allCheck}
                        >회원 가입</button>
                    </div>
                </div>
            </div>
        </main>
    )
}
