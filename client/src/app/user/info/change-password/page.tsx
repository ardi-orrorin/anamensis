'use client';

import PasswordProvider, {
    ChangePasswordI,
    ChangePasswordStatus
} from "@/app/user/info/change-password/{services}/passwordProvider";
import {useState} from "react";
import Confirm from "@/app/user/info/change-password/{components}/confirm";
import ChangePwd from "@/app/user/info/change-password/{components}/changePwd";
import Success from "@/app/user/info/change-password/{components}/success";

export default function Page() {

    const [changePwd, setChangePwd] = useState<ChangePasswordI>({
        curPwd: '',
        newPwd: '',
        status: ChangePasswordStatus.READY
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
                    ChangePasswordStatus.READY === changePwd.status
                    ? <Confirm />
                    : ChangePasswordStatus.CONFIRMED === changePwd.status
                    ? <ChangePwd />
                    : ChangePasswordStatus.SUCCESS === changePwd.status
                    ? <Success />
                    : <></>
                }
            </div>
        </PasswordProvider.Provider>
    )
}