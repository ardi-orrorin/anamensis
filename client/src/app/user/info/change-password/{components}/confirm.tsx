import {useContext, useState} from "react";
import PasswordProvider from "@/app/user/info/{services}/passwordProvider";
import apiCall from "@/app/{commons}/func/api";
import {faEye} from "@fortawesome/free-solid-svg-icons";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {Common} from "@/app/{commons}/types/commons";
import {AxiosError} from "axios";
import {UserInfoSpace} from "@/app/user/info/{services}/types";
const Confirm = () => {

    const {changePwd, setChangePwd} = useContext(PasswordProvider);

    const [status, setStatus] = useState(UserInfoSpace.Statue.READY);
    const [pwdView, setPwdView] = useState(false);

    const onChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setChangePwd({
            ...changePwd,
            curPwd: e.target.value
        })
    }

    const onSubmit = async () => {

        try {
            const res = await apiCall<Common.StatusResponse, UserInfoSpace.ChangePassword>({
                path: '/api/user/change-password',
                method: 'POST',
                body: changePwd
            });

            res.data.status === Common.StatusResponseStatusEnum.SUCCESS
            ? setChangePwd({
                ...changePwd,
                status: UserInfoSpace.ChangePasswordStatus.CONFIRMED
            })
            : setStatus(UserInfoSpace.Statue.FAILED);
        } catch (e) {
            const err = e as AxiosError;
            console.log(err);
        }
    }

    const onChangePwd = (e: React.ChangeEvent<HTMLInputElement>) => {
        setChangePwd({
            ...changePwd,
            curPwd: e.target.value
        })
        setStatus(UserInfoSpace.Statue.READY);
    }

    return (
        <div className={'flex flex-col gap-4 items-center justify-center'}
        >
            <div className={'relative'}>
                <input className={'w-64 py-2 pl-2 pr-8 rounded outline-0 bg-gray-100 text-xs'}
                       type={pwdView ? 'text' : 'password'}
                       name={'curPwd'}
                       placeholder={'비밀번호 입력'}
                       onChange={onChangePwd}
                       onKeyDown={(e) => e.key === 'Enter' && onSubmit()}
                       autoFocus={true}
                />
                <button className={'absolute p-2 right-0'}
                        onClick={() => setPwdView(!pwdView)}
                >
                    <FontAwesomeIcon icon={faEye} className={'text-gray-400'} />
                </button>
            </div>
            <div className={'text-red-500 text-xs'}>
                {status === UserInfoSpace.Statue.FAILED ? '비밀번호가 일치하지 않습니다.' : ''}
            </div>
            <button className={'w-32 p-2 rounded bg-blue-400 text-white text-xs disabled:bg-gray-600 hover:bg-main transition-colors duration-500'}
                    onClick={onSubmit}
                    disabled={changePwd.curPwd.length < 8}
            >
                확인
            </button>
        </div>
    )
}

export default Confirm;