'use client';
import axios, {AxiosResponse} from "axios";
import {useEffect, useState} from "react";
import {AuthType} from "@/app/login/{services}/types";
import LoadingSpinner from "@/app/{commons}/LoadingSpinner";
import {useRouter} from "next/navigation";

export default function Page() {

    const router = useRouter();

    const [user, setUser] = useState<UserInfoI>({} as UserInfoI);
    const [loading, setLoading] = useState<boolean>(false);

    useEffect(()=> {
        axios.get("/api/user/info")
            .then((res: AxiosResponse<UserInfoI>) => {
                setUser(res.data);
            })
    },[loading]);

    const attend = async () => {
        setLoading(true);
        await axios.get("/api/user/attend/check")
            .then((res: AxiosResponse<string>) => {
                alert(res.data);
                router.refresh();
            })
            .finally(() => {
                setLoading(false);
            })
    }
    return (
        <div className={'flex flex-col gap-3'}>
            <div>
                <label>아이디 : </label>
                <span>{user.userId}</span>
            </div>
            <div>
                <label>이메일 : </label>
                <span>{user.email}</span>
            </div>
            <div>
                <label>연락처 : </label>
                <span>{user.phone}</span>
            </div>
            <div>
                <label>이름 : </label>
                <span>{user.name}</span>
            </div>
            <div>
                <label>점수 : </label>
                <span>{user.point}</span>
            </div>
            <div>
                <label>인증 방식 : </label>
                <span>{user.sauthType}</span>
            </div>
            <div>
                <label>2차 인증 사용여부 : </label>
                <span>{user.sauth ? 'O' : 'X'}</span>
            </div>
            <div>
                <button className={'w-full bg-blue-500 text-white p-2 rounded'}
                        onClick={attend}
                >
                    {
                        loading
                        ? <LoadingSpinner size={15} />
                        : <span>출석체크</span>
                    }
                </button>
            </div>
        </div>
    )
}

export interface UserInfoI {
    userId: string
    email: string
    phone: string
    name: string
    point: number
    sauthType: AuthType
    sauth: boolean
}