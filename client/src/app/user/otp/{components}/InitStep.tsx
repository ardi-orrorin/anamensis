import axios from "axios";
import OTPProvider from "@/app/user/otp/{services}/OTPProvider";
import {useContext} from "react";
import {useRouter} from "next/navigation";

const InitStep = () => {

    const router = useRouter();

    const {otp, setOtp} = useContext(OTPProvider);

    const onInit = async () => {
        await axios.put('./otp/api')
            .then(res => {
                alert('OTP 삭제 완료');
                window.location.reload();
            });
    }

    return (
        <div className={'flex flex-col gap-3 w-full h-32 p-4 border border-blue-200 border-solid rounded'}>
            <h1>OTP 내역</h1>
            <div>
                마지막 생성일자
            </div>
            {
                otp.existOtp &&
                <div>
                    <button onClick={onInit}>등록된 OTP 삭제</button>
                </div>
            }
        </div>
    )
}

export default InitStep;