'use client';

import PasswordProvider from "@/app/user/info/{services}/passwordProvider";
import {useState} from "react";
import Confirm from "@/app/user/info/change-password/{components}/confirm";
import ChangePwd from "@/app/user/info/change-password/{components}/changePwd";
import Success from "@/app/user/info/change-password/{components}/success";
import {UserInfoSpace} from "@/app/user/info/{services}/types";

export default function Page() {

    const [changePwd, setChangePwd] = useState<UserInfoSpace.ChangePassword>({
        curPwd: '',
        newPwd: '',
        status: UserInfoSpace.ChangePasswordStatus.READY
    })

    return (
        <PasswordProvider.Provider value={{
            changePwd, setChangePwd,
        }}>
            <div className={'w-full h-screen flex flex-col gap-10 justify-center items-center'}>
                <h1 className={'font-bold text-xl'}>
                    비밀번호 변경
                </h1>
                {
                    UserInfoSpace.ChangePasswordStatus.READY === changePwd.status
                    ? <Confirm />
                    : UserInfoSpace.ChangePasswordStatus.CONFIRMED === changePwd.status
                    ? <ChangePwd />
                    : UserInfoSpace.ChangePasswordStatus.SUCCESS === changePwd.status
                    ? <Success />
                    : <></>
                }
            </div>
        </PasswordProvider.Provider>
    )
}