import {useContext, useEffect, useState} from "react";
import LoginProvider, {LoginI, LoginProviderI} from "@/app/login/{services}/LoginProvider";
import LoadingSpinner from "@/app/{commons}/LoadingSpinner";
import apiCall from "@/app/{commons}/func/api";
import {LoginType} from "@/app/login/{componens}/Login";
import {GeoLocationType, getGeoLocation} from "@/app/login/{services}/GeoLocation";

const EmailAuth = () => {

    const [loading, setLoading] = useState<boolean>(false);

    const { user, setUser } = useContext<LoginProviderI>(LoginProvider);

    const [timer, setTimer] = useState<number>(600);

    useEffect(() => {
        let it = timer;

        const interval = setInterval(() => {
            it--
            setTimer(it);

            if(it === 0) {
                alert('인증 시간이 만료되었습니다.');
                window.location.reload();
            }
        }, 1000);

        return () => {
            clearInterval(interval);
        }

    },[]);

    const onChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setUser({
            ...user,
            [e.target.name]: e.target.value
        })
    }

    const verify = async () => {
        setLoading(true);
        await apiCall<LoginType, LoginI>({
            path: '/api/login/verify',
            method: 'POST',
            body: user,
            call: 'Proxy'
        }).then(res => {
            localStorage.setItem('roles', JSON.stringify(res.data.roles));
            window.location.replace('/');
        }).catch(err => {
            console.log(err)
        }).finally(() => {
            setLoading(false);
        });
    }

    const transMinSec = (time: number) => {
        const min = Math.floor(time / 60);
        const sec = time % 60;
        return `${min}:${sec < 10 ? `0${sec}` : sec}`;
    }


    return (
        <div className={"flex flex-col gap-4 border border-solid b border-blue-300 sm:w-4/5 md:w-1/2 xl:w-1/3 w-full rounded pb-5"}>
            <div className={'flex flex-col gap-1 bg-blue-300 py-4'}>
                <h3 className={'flex justify-center font-bold text-white text-base'}
                >EMAIL 인증</h3>
            </div>
            <div className={'flex flex-col px-2'}>
                <div className={'flex'}>
                    <input
                        className={'w-full border border-none outline-0 focus:bg-blue-100 duration-300 text-xs rounded my-2 p-2'}
                        placeholder={'인증번호를 입력하세요'}
                        name={'code'}
                        value={user.code}
                        onChange={onChange}
                    />
                </div>
                <div>
                    <button
                        className={['w-full rounded duration-300 text-xs text-white my-2 p-2', loading ? 'bg-gray-400 hover:bg-gray-700': 'bg-blue-300 hover:bg-blue-600'].join(' ')}
                        disabled={loading}
                        onClick={verify}
                    >{
                        loading ?
                            <LoadingSpinner size={12}/> :
                            `인증 ${transMinSec(timer)}`
                    }
                    </button>
                </div>
            </div>
        </div>
    )
}

export default EmailAuth;