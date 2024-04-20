import axios from "axios";

const OTPInit = () => {

    const onInit = async () => {
        await axios.put('/api/user/otp')
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