import React, {useContext, useMemo, useState} from "react";
import PasswordProvider from "@/app/user/info/{services}/passwordProvider";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {faEye} from "@fortawesome/free-solid-svg-icons";
import apiCall from "@/app/{commons}/func/api";
import {Common} from "@/app/{commons}/types/commons";
import {UserInfoSpace} from "@/app/user/info/{services}/types";

const ChangePwd = () => {

    const {changePwd, setChangePwd} = useContext(PasswordProvider);

    const [pwd, setPwd] = useState<UserInfoSpace.Pwd>({
        newPwd: '',
        isNewPwd: false,
        confirmPwd: '',
        isConfirmPwd: false,
    });

    const [status, setStatus] = useState(UserInfoSpace.Statue.READY);

    const isConfirmed = useMemo(()=>
        pwd.newPwd.length > 8 && UserInfoSpace.Statue.CONFIRMED === status
    , [pwd, status]);


    const onChangePwd = (e: React.ChangeEvent<HTMLInputElement>) => {
        const {name, value} = e.target
        setPwd({
            ...pwd,
            [name]: value
        })

        if(pwd.newPwd.length === 0 || pwd.confirmPwd.length === 0) return;

        if(name === 'newPwd' && pwd.confirmPwd.length > 0) {
            pwd.confirmPwd === value
                ? setStatus(UserInfoSpace.Statue.CONFIRMED)
                : setStatus(UserInfoSpace.Statue.FAILED);
        }

        if(name === 'confirmPwd' && pwd.newPwd.length > 0) {
            pwd.newPwd === value
                ? setStatus(UserInfoSpace.Statue.CONFIRMED)
                : setStatus(UserInfoSpace.Statue.FAILED);
        }
    };

    const onChangeView = (name: string) => {
        setPwd({
            ...pwd,
            [name]: !pwd[name]
        })
    }

    const onSubmit = async () => {
        setChangePwd({
            ...changePwd,
            newPwd: pwd.newPwd,
        })

        const body = {
            ...changePwd,
            newPwd: pwd.newPwd,
        } as UserInfoSpace.ChangePassword

        try {
            const res = await apiCall<Common.StatusResponse, UserInfoSpace.ChangePassword>({
                path: '/api/user/change-password',
                method: 'POST',
                body,
                isReturnData: true,
            });

            res.status === Common.StatusResponseStatusEnum.SUCCESS
            ? setChangePwd({
                ...changePwd,
                status: UserInfoSpace.ChangePasswordStatus.SUCCESS
            })
            : setStatus(UserInfoSpace.Statue.FAILED);
        } catch (e) {
            const err = e as Error;
            console.log(err);
        }


    };

    return (
        <div className={'flex flex-col gap-4 items-center justify-center'}
        >
            <div className={'relative'}>
                <input className={'w-64 py-2 pl-2 pr-8 rounded outline-0 bg-gray-100 text-xs'}
                       type={pwd.isNewPwd ? 'text' : 'password'}
                       name={'newPwd'}
                       placeholder={'비밀번호 입력'}
                       onChange={onChangePwd}
                       autoFocus={true}
                />
                <button className={'absolute p-2 right-0'}
                        onClick={() => onChangeView('isNewPwd')}
                >
                    <FontAwesomeIcon icon={faEye} className={'text-gray-400'} />
                </button>
            </div>
            <div className={'relative'}>
                <input className={'w-64 py-2 pl-2 pr-8 rounded outline-0 bg-gray-100 text-xs'}
                       type={pwd.isConfirmPwd ? 'text' : 'password'}
                       name={'confirmPwd'}
                       placeholder={'비밀번호 입력'}
                       onChange={onChangePwd}
                       onKeyDown={(e) => e.key === 'Enter' && isConfirmed && onSubmit()}
                />
                <button className={'absolute p-2 right-0'}
                        onClick={() => onChangeView('isConfirmPwd')}
                >
                    <FontAwesomeIcon icon={faEye} className={'text-gray-400'} />
                </button>
            </div>
            <div className={'text-red-500 text-xs'}>
                {status === UserInfoSpace.Statue.FAILED ? '비밀번호가 일치하지 않습니다.' : ''}
            </div>
            <button className={'w-32 p-2 rounded bg-blue-400 text-white text-xs disabled:bg-gray-600 hover:bg-main transition-colors duration-500'}
                    onClick={onSubmit}
                    disabled={!isConfirmed}
            >
                확인
            </button>
        </div>
    )
}

export default ChangePwd;