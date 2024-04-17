import Link from "next/link";

export enum OTPStepEnum {
    INIT   = 'init',
    OTP    = 'otp',
    VERIFY = 'verify',

}

const OTPStep = ({step}: {step: OTPStepEnum}) => {

    const currentStyle = 'font-bold text-blue-700';

    return (
        <div className={'flex gap-5 justify-center'}>
            <Link className={step === OTPStepEnum.INIT ? currentStyle : ''} href={`?step=${OTPStepEnum.INIT}`}>
              등록 단계
            </Link>
            <span> {'>'} </span>
            <Link className={step === OTPStepEnum.OTP ? currentStyle : ''} href={`?step=${OTPStepEnum.OTP}`}>
                OTP 등록
            </Link>
            <span> {'>'} </span>
            <Link className={step === OTPStepEnum.VERIFY ? currentStyle : ''} href={`?step=${OTPStepEnum.VERIFY}`}>
                OTP 인증
            </Link>
        </div>
    );
}


export default OTPStep;