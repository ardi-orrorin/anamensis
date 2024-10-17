import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {faExclamation} from "@fortawesome/free-solid-svg-icons";
import LoadingSpinner from "@/app/{commons}/LoadingSpinner";
import {useMemo} from "react";
import {useLogin} from "@/app/login/{hooks}/LoginProvider";
import OAuth from "@/app/login/{componens}/OAuth";
import Footer from "@/app/find-user/{components}/footer";

const Login = () => {
    const {user, goLogin, setProps, error, loading} = useLogin();


    const idCheck = useMemo(() => {
        return user.username.length > 5;
    }, [user.username]);

    const isNext = useMemo(() => {
        return user.username.length > 5 && user.password.length > 4;
    }, [user]);

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
                          data-testid={'error-message'}
                    >
                        <FontAwesomeIcon height={12} icon={faExclamation}/>
                        &nbsp; {error.message}
                    </span>
                  }
                </div>
                <div>
                    <button
                        className={['w-full rounded  duration-300 text-xs text-white my-2 p-2', isNext ? 'bg-blue-300 hover:bg-blue-600' : 'bg-gray-400 hover:bg-gray-700'].join(' ')}
                        disabled={!isNext || loading}
                        onSubmit={goLogin}
                        onClick={goLogin}
                        data-testid={'login'}
                    >{
                        loading ?
                            <LoadingSpinner size={12}/> :
                            '로그인'
                    }
                    </button>
                </div>
            </div>
            <Footer />
            <div className={'flex flex-col gap-2 justify-between px-3'}>
                <OAuth />
            </div>
        </div>
    )
}

export default Login;