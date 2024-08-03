import React, {useContext, useMemo, useState} from "react";
import PasswordProvider, {
    ChangePasswordI,
    ChangePasswordStatus
} from "@/app/user/info/change-password/{services}/passwordProvider";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {faEye} from "@fortawesome/free-solid-svg-icons";
import apiCall from "@/app/{commons}/func/api";
import {StatusResponse, StatusResponseStatusEnum} from "@/app/{commons}/types/commons";


type PwdType = {
    newPwd: string
    isNewPwd: boolean;
    confirmPwd: string;
    isConfirmPwd: boolean;
    [key: string]: string | boolean;
}

enum Statue {
    READY,
    CONFIRMED,
    FAILED
}

const ChangePwd = () => {

    const {changePwd, setChangePwd} = useContext(PasswordProvider);

    const [pwd, setPwd] = useState<PwdType>({
        newPwd: '',
        isNewPwd: false,
        confirmPwd: '',
        isConfirmPwd: false,
    });

    const [status, setStatus] = useState(Statue.READY);

    const isConfirmed = useMemo(()=>
        pwd.newPwd.length > 8 && Statue.CONFIRMED === status
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
                ? setStatus(Statue.CONFIRMED)
                : setStatus(Statue.FAILED);
        }

        if(name === 'confirmPwd' && pwd.newPwd.length > 0) {
            pwd.newPwd === value
                ? setStatus(Statue.CONFIRMED)
                : setStatus(Statue.FAILED);
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

        const body: ChangePasswordI = {
            ...changePwd,
            newPwd: pwd.newPwd,
        }

        try {
            const res = await apiCall<StatusResponse, ChangePasswordI>({
                path: '/api/user/change-password',
                method: 'POST',
                body,
                isReturnData: true,
            });

            res.status === StatusResponseStatusEnum.SUCCESS
            ? setChangePwd({
                ...changePwd,
                status: ChangePasswordStatus.SUCCESS
            })
            : setStatus(Statue.FAILED);
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
                {status === Statue.FAILED ? '비밀번호가 일치하지 않습니다.' : ''}
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