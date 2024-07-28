import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {faExclamation} from "@fortawesome/free-solid-svg-icons";
import LoadingSpinner from "@/app/{commons}/LoadingSpinner";
import Link from "next/link";
import {useContext, useEffect, useMemo, useRef, useState} from "react";
import axios from "axios";
import {ErrorResponse, LoginAuth} from "@/app/login/page";
import LoginProvider, {LoginI} from "@/app/login/{services}/LoginProvider";
import ReCAPTCHA from "react-google-recaptcha";
import apiCall from "@/app/{commons}/func/api";
import {RoleType} from "@/app/user/system/{services}/types";
import {getProviders, signIn} from "next-auth/react";
import Image from "next/image";

export type LoginType = {
    accessToken: string,
    accessTokenExpiresIn: number,
    refreshToken: string,
    refreshTokenExpiresIn: number,
} & LoginUserType

export type LoginUserType = {
    username: string,
    roles: RoleType[]
}


const Login = () => {

    const siteKey = process.env.NEXT_PUBLIC_RECAPTCHA_SITE_KEY;
    const privateKey = process.env.NEXT_PUBLIC_RECAPTCHA_PRIVATE_KEY;
    const [isRecaptcha, setIsReCaptcha] = useState<boolean>(false);
    const recaptchaRef = useRef<ReCAPTCHA>(null);
    const [provider, setProvider] = useState<any>({});

    const {user, setUser} = useContext(LoginProvider);
    const [loading, setLoading] = useState<boolean>(false);

    useEffect(() => {
        if (user.username.length < 4) {
            setUser({
                ...user,
                password: ''
            });
        }
    }, [user.username]);

    const idCheck = useMemo(() => {
        return user.username.length > 5;
    }, [user.username]);

    const isNext = useMemo(() => {
        return user.username.length > 5 && user.password.length > 4;
    }, [user]);

    useEffect(() => {
        getProviders()
        .then((providers) => {
            setProvider(providers)
        });
    },[]);

    const goLogin = async () => {
        setLoading(true);

        await apiCall<LoginAuth, LoginI>({
            path: '/api/login',
            method: 'POST',
            body: user,
            call: 'Proxy'
        }).then(res => {
            setUser({
                ...user,
                verify: res.data.verity,
                authType: res.data.authType
            });
        }).catch(err => {
            setError({
                status: err.response.status,
                message: err.response.data,
                use: true
            });
        }).finally(() => {
            setLoading(false);
        });
    }

    const [error, setError] = useState<ErrorResponse>({
        status: 0,
        message: '',
        use: false
    });

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

        if(!recaptchaRef.current) return;

    }

    const onChangeReCaptchaHandler = async (value: string | null) => {
        if (!value) return;

        const url = '/api/login/google';
        const data = {
            secret: privateKey,
            response: value || ""
        };

        await axios.post(url, data).then((res) => {
            setIsReCaptcha(res.data.success);
        })
    }

    return (
        <div className={"flex flex-col gap-4 border border-solid b border-blue-300 sm:w-4/5 md:w-1/2 xl:w-1/3 w-full rounded pb-5"}>
            <div className={'flex flex-col gap-1 bg-blue-300 py-4'}>
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
                        autoFocus={true}
                    />
                </div>
                <div className={['flex duration-500', idCheck ? 'max-h-52' : 'max-h-0'].join(' ')}>
                    <input
                        className={'w-full border border-none outline-0 focus:bg-blue-100 duration-300 text-xs rounded my-2 p-2'}
                        placeholder={'비밀번호를 입력하세요.'}
                        type={'password'}
                        name={'password'}
                        value={user.password}
                        onChange={setProps}
                    />
                </div>
                <div className={['flex duration-500', error.use ? 'max-h-52' : 'max-h-0'].join(' ')}>
                  {
                    error.use &&
                    <span className={'text-xs text-red-500 my-2 px-2'}
                    >
                        <FontAwesomeIcon height={12} icon={faExclamation}/>
                        &nbsp; {error.message}
                    </span>
                  }
                </div>
                <div className={''}>
                    {
                        idCheck && isNext &&
                        <ReCAPTCHA ref={recaptchaRef}
                                   sitekey={siteKey || ""}
                                   onChange={onChangeReCaptchaHandler}
                                   className={'w-full flex justify-center py-2'}
                        />
                    }
                </div>
                <div>
                    <button
                        className={['w-full rounded  duration-300 text-xs text-white my-2 p-2', isNext && isRecaptcha ? 'bg-blue-300 hover:bg-blue-600' : 'bg-gray-400 hover:bg-gray-700'].join(' ')}
                        disabled={!isNext || loading || !isRecaptcha}
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
                <Link href={'/find-user'}
                   className={'flex justify-center text-xs text-blue-500'}
                >아이디 찾기</Link>
                <Link href={'/signup'}
                      className={'flex justify-center text-xs text-blue-500'}
                >회원 가입</Link>
                <Link href={'/reset-pwd'}
                   className={'flex justify-center text-xs text-blue-500'}
                >비밀번호 찾기</Link>
            </div>
            <div className={'flex flex-col gap-2 justify-between px-3'}>
                {
                    Object?.values(provider).length > 0
                    && Object?.values(provider)?.map((provider) => {
                        const { id, name} = provider as {id: string, name: string};
                        const logoImg = process.env.NEXT_PUBLIC_CDN_SERVER + '/logo/' + id + '-logo.webp';
                        const {bgColor, hoverBgColor, size} = oAuthProviders.find(o => o.provider === id)
                            || {bgColor: 'gray-300', hoverBgColor: 'gray-600'};

                        return (
                            <button className={[
                                `w-full h-11 flex justify-center items-center gap-1 text-xs text-white rounded duration-300`,
                                `${bgColor} hover:${hoverBgColor}`,
                                ].join(' ')}
                                    key={'oauth-login' + id}
                                    onClick={() => signIn(id)}
                            >
                                <Image src={logoImg}
                                       alt={''}
                                       width={size}
                                       height={size}
                                />
                                <span className={'font-bold'}>
                                    Sign in with {name}
                                </span>
                            </button>
                        )
                    })
                }
            </div>
        </div>
    )
}

type OAuthProviderType = {
    provider      : string;
    bgColor       : string;
    hoverBgColor  : string;
    size          : number;
}

const oAuthProviders: OAuthProviderType[] = [
    { provider: 'google',    bgColor: 'bg-red-300',    hoverBgColor: 'bg-red-600',    size: 16,   },
    { provider: 'facebook',  bgColor: 'bg-blue-300',   hoverBgColor: 'bg-blue-600',   size: 16,   },
    { provider: 'twitter',   bgColor: 'bg-blue-500',   hoverBgColor: 'bg-blue-800',   size: 16,   },
    { provider: 'instagram', bgColor: 'bg-pink-300',   hoverBgColor: 'bg-pink-600',   size: 16,   },
    { provider: 'naver',     bgColor: 'bg-green-300',  hoverBgColor: 'bg-green-600',  size: 20,   },
    { provider: 'kakao',     bgColor: 'bg-amber-300',  hoverBgColor: 'bg-amber-700',  size: 18,   },
    { provider: 'github',    bgColor: 'bg-gray-600',   hoverBgColor: 'bg-gray-900',   size: 18,   },
];



export default Login;