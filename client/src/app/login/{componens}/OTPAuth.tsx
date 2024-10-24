import {useLogin} from "@/app/login/{hooks}/LoginProvider";
import LoadingSpinner from "@/app/{commons}/LoadingSpinner";
import useTimer from "@/app/login/{hooks}/useTimer";
import {loginFunc} from "@/app/login/{services}/funcs";

const OTPAuth = () => {

    const {user, loading, verify, onChange} = useLogin();

    const timer = useTimer(300);

    return (
        <div className={"flex flex-col gap-4 border border-solid b border-blue-300 sm:w-4/5 md:w-1/2 xl:w-1/3 w-full rounded pb-5"}>
            <div className={'flex flex-col gap-1 bg-blue-300 py-4'}>
                <h3 className={'flex justify-center font-bold text-white text-base'}
                >OTP 인증</h3>
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
                            `인증 ${loginFunc.transMinSec(timer.timer)}`
                    }
                    </button>
                </div>
            </div>
        </div>
    )
}

export default OTPAuth;