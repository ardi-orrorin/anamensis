import OTPProvider, {OTPContextI} from "@/app/user/otp/{services}/OTPProvider";
import {useContext, useState} from "react";
import LoadingSpinner from "@/app/{commons}/LoadingSpinner";
import {useRouter} from "next/navigation";
import apiCall from "@/app/{commons}/func/api";

const OTPVerify = () => {

    const router = useRouter();
    const {otp, setOtp} = useContext<OTPContextI>(OTPProvider);

    const [loading, setLoading] = useState(false);

    const onChangeHandler = (e: React.ChangeEvent<HTMLInputElement>) => {
        setOtp({...otp, verifyCode: e.target.value});
    }

    const onVerify = async () => {
        setLoading(true);

        await apiCall({
            path: '/api/user/otp',
            method: 'POST',
            body: {code: otp.verifyCode}
        })
        .then(res => {
            setOtp({
                ...otp,
                verifyState: res.data
            });
        })
        .finally(() => {
            setLoading(false);
        });
    }

    return (
        <div className={'flex flex-col gap-6'}>
            <input className={'w-full border border-gray-300 p-3 rounded outline-0 focus:bg-blue-50 duration-300'}
                   type="text"
                   placeholder={'OTP 코드를 입력해주세요'}
                   onChange={onChangeHandler}
            />
            <button className={[
                'w-full py-3 text-white rounded duration-500',
                loading ? 'bg-gray-400 hover:bg-gray-600' : 'bg-blue-300 hover:bg-blue-600'
            ].join(' ')}
                    disabled={loading || !otp.verifyCode}
                    onClick={onVerify}
            >{
                loading ? <LoadingSpinner size={12}/> : '확인'
            }
            </button>
            {
                otp.verifyState &&
                <p className={otp?.verifyState ? 'text-blue-700' : 'text-red-600'}>{otp.verifyState ? '성공' : '실패'}</p>
            }
        </div>
    )
}

export default OTPVerify;