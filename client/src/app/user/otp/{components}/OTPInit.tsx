import axios from "axios";
import apiCall from "@/app/{commons}/func/api";

const OTPInit = () => {

    const onInit = async () => {
        await apiCall({
            path: '/api/user/otp',
            method: 'PUT'
        })
        .then(res => {
            alert('OTP 삭제 완료');
            window.location.reload();
        });
    }

    return (
        <div className={'w-full flex justify-center'}>
            <button className={'w-full bg-red-500 text-white p-2 rounded'}
                    onClick={onInit}>OTP 삭제</button>
        </div>
    )
}

export default OTPInit;