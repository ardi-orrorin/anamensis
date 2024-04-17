import OTPProvider, {OTPContextI, OTPProps} from "@/app/user/otp/{services}/OTPProvider";
import {useContext} from "react";
import axios from "axios";

const OTPVerify = () => {

    const {otp, setOtp} = useContext<OTPContextI>(OTPProvider);

    const onChangeHandler = (e: React.ChangeEvent<HTMLInputElement>) => {
        setOtp({...otp, verifyCode: e.target.value, verifyState: undefined});

    }

    const onVerify = async () => {
        await axios.post('./otp/api', {otp: otp.verifyCode})
            .then(res => {
                setOtp({
                    ...otp,
                    verifyState: res.data
                });
            });
    }

    return (
        <div className={'flex flex-col gap-6'}>
            <input className={'w-full border border-gray-300 p-3 rounded outline-0 focus:bg-blue-50 duration-300'}
                   type="text"
                   placeholder={'OTP 코드를 입력해주세요'}
                   onChange={onChangeHandler}
            />
            <button className={'w-full bg-blue-300 py-3 hover:bg-blue-600 text-white rounded duration-500'}
                    onClick={onVerify}
            >확인
            </button>
            {
                otp.verifyState &&
                <p className={otp.verifyState === 'success' ? 'text-blue-700' : 'text-red-600'}>{otp.verifyState.toUpperCase()}</p>
            }
        </div>
    )
}

export default OTPVerify;