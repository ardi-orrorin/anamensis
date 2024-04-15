'use client';

import {useEffect, useMemo, useState} from "react";
import Link from "next/link";
import LoadingSpinner from "@/app/{commons}/LoadingSpinner";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {faExclamation} from "@fortawesome/free-solid-svg-icons";
import axios from "axios";
import {useRouter} from "next/navigation";

export interface Login {
    username : string;
    password : string;
}

export interface ErrorResponse {
    status: number;
    message: string;
    use: boolean
}

export interface UserInfo {
    accessToken: string;
    refreshToken: string;
    roles: RoleType[];
}

enum RoleType {
    ADMIN  =  'ADMIN',
    USER   =  'USER',
    GUEST  =  'GUEST',
    MASTER =  'MASTER'
}

export interface GeoLocation {
    countryCode: string;
    countryName: string;
    state: string;
    city: string;
    ipv4: string;
    latitude: number;
    longitude: number;
}

export default function Page() {

    const router = useRouter();

    const [user, setUser] = useState<Login>({
        username: '',
        password: ''
    });

    const [loading, setLoading] = useState<boolean>(false);

    const [error, setError] = useState<ErrorResponse>({
        status: 0,
        message: '',
        use: false
    });

    useEffect(() => {
        if (user.username.length < 4) {
            setUser({
                ...user,
                password: ''
            });
        }
    }, [user.username]);

    const setProps = (e: React.ChangeEvent<HTMLInputElement>) => {
        const {name, value} = e.target;

        setUser({
            ...user,
            [name]: value
        });

        if (error.use) {
            setError({
                status: 0,
                message: '',
                use: false
            });
        }
    }

    const idCheck = useMemo(() => {
        return user.username.length > 5;
    }, [user.username]);

    const isNext = useMemo(() => {
        return user.username.length > 5 && user.password.length > 4;
    }, [user]);


    const goLogin = async () => {
        setLoading(true);
        await axios.post('./login/api', user)
            .then((res) => {
                res.status === 200 && window.location.replace('/');
        })
        .catch((err)  => {
            setError({
                status: err.response.data.status,
                message: err.response.data.message,
                use: err.response.data.use
            });
        })
        .finally(() => {
            setLoading(false);
        });
    }
    return (
        <main className={'flex flex-col min-h-screen justify-center items-center'}>
            <div
                className={"flex flex-col gap-4 border border-solid b border-blue-300 sm:w-4/5 md:w-1/2 xl:w-1/3 w-full rounded pb-5"}>
                <div className={'flex flex-col gap-1 bg-blue-300 py-4'}>
                    {/*<h1 className={'flex justify-center font-bold text-white text-xl'}*/}
                    {/*>Anamensis</h1>*/}
                    <h3 className={'flex justify-center font-bold text-white text-base'}
                    >LOGIN</h3>
                </div>
                <div className={'flex flex-col px-2'}>
                    <div className={'flex'}>
                        <input
                            className={'w-full border border-none outline-0 focus:bg-blue-100 duration-300 text-xs rounded my-2 p-2'}
                            placeholder={'아이디를 입력하세요.'}
                            name={'username'}
                            value={user.username}
                            onChange={setProps}
                        />
                    </div>
                    <div className={['flex duration-500', idCheck ? 'max-h-52' : 'max-h-0'].join(' ')}>
                        <input
                            className={'w-full border border-none outline-0 focus:bg-blue-100 duration-300 text-xs rounded my-2 p-2'}
                            placeholder={'비밀번호를 입력하세요.'}
                            name={'password'}
                            value={user.password}
                            onChange={setProps}
                        />
                    </div>
                    <div className={['flex duration-500', error.use ? 'max-h-52' : 'max-h-0'].join(' ')}>
                      <span className={'text-xs text-red-500 my-2 px-2'}
                      >
                        <FontAwesomeIcon height={12} icon={faExclamation}/>
                          &nbsp; {error.message}
                      </span>
                    </div>
                    <div>
                        <button
                            className={['w-full rounded  duration-300 text-xs text-white my-2 p-2', isNext ? 'bg-blue-300 hover:bg-blue-600' : 'bg-gray-400 hover:bg-gray-700'].join(' ')}
                            disabled={!isNext || loading}
                            onSubmit={goLogin}
                            onClick={goLogin}
                        >{
                            loading ?
                                <LoadingSpinner size={12}/> :
                                '로그인'
                        }
                        </button>
                    </div>
                </div>
                <div className={'flex justify-between px-3'}>
                    <a href={'#'}
                       className={'flex justify-center text-xs text-blue-500'}
                    >아이디 찾기</a>
                    <Link href={'/signup'}
                          className={'flex justify-center text-xs text-blue-500'}
                    >회원 가입</Link>
                    <a href={'#'}
                       className={'flex justify-center text-xs text-blue-500'}
                    >비밀번호 찾기</a>
                </div>
            </div>
        </main>
    );
}