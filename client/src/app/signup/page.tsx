'use client'

import React, {useCallback, useEffect, useMemo, useState} from "react";
import Row from "@/app/signup/{component}/Row";
import EmailTemplate from "@/app/signup/{component}/EmailTemplate";
import axios from "axios";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {faSpinner} from "@fortawesome/free-solid-svg-icons";

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

export type CheckType = 'check' | 'uncheck' | 'notCheck';

export default function Page() {

    const [loading, setLoading] = useState<boolean>(false);

    const [user, setUser] = useState<UserProps>({
        id       : '',
        pwd      : '',
        pwdCheck : '',
        name     : '',
        email    : '',
        phone    : ''
    });

    const [check, setCheck] = useState<CheckProps>({
        id       : 'uncheck',
        pwd      : 'uncheck',
        pwdCheck : 'uncheck',
        name     : 'uncheck',
        email    : 'uncheck',
        phone    : 'uncheck',
    });

    const [emailSelect, setEmailSelect] = useState<boolean>(false);

    useEffect(() => {
        if(user.pwdCheck.length > 0 && user.pwd.length < 8) {
            setUser({
                ...user,
                pwdCheck: ''
            });
            setCheck({
                ...check,
                pwdCheck: 'uncheck'
            });
        }
        if(user.pwdCheck.length === 0) return ;

        if(user.pwdCheck === user.pwd) {
            setCheck({
                ...check,
                pwdCheck: 'check'
            });
        } else {
            setCheck({
                ...check,
                pwdCheck: 'notCheck'
            });
        }
    },[user.pwdCheck, user.pwd]);

    const setProps = (e: React.ChangeEvent<HTMLInputElement>) => {
        const {name, value} = e.target;

        setUser({
            ...user,
            [name]: value
        });

        if(name === 'pwdCheck') return ;

        if(value.length > 0) {
            setCheck({
                ...check,
                [name]: 'check'
            });
        } else {
            setCheck({
                ...check,
                [name]: 'uncheck'
            });
        }

        if(name === 'email' && emailSelect) {
            setEmailSelect(false);
        }
    }

    const inputCheck = (checkType: CheckType) => {
        console.log(checkType)
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
            .finally(() => {
                setLoading(false);
            });
    }

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
const postFetch = async (data: UserProps) => {

    return await axios.post(process.env.NEXT_PUBLIC_SERVER + '/user/signup', data, {
        headers: {
            'Content-Type': 'application/json'
        }
    })
        .then(res => {
            console.log(res);
        })
        .catch(err => {
            console.error(err);
        });
}

