import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {faArrowLeft, faArrowRight} from "@fortawesome/free-solid-svg-icons";
import {OTPStepEnum} from "@/app/user/otp/{components}/Step";
import {useRouter} from "next/navigation";

const OTPFooter = ({cur} : {cur: OTPStepEnum}) => {

    const router = useRouter();

    const stepSort = [OTPStepEnum.INIT, OTPStepEnum.OTP, OTPStepEnum.VERIFY];

    const prevStep = () => {
        const currentStep = stepSort.indexOf(cur);
        if (currentStep === 0) {
            return;
        }

        const prev = stepSort[currentStep - 1];
        router.push(`?step=${prev}`);
    }

    const nextStep = () => {
        const currentStep = stepSort.indexOf(cur);
        if (currentStep === stepSort.length - 1) {
            return;
        }

        const next = stepSort[currentStep + 1];
        router.push(`?step=${next}`);
    }

    const btnStyle = 'h-9 bg-blue-400 hover:bg-blue-600 text-white font-bold py-2 px-5';


    return (
        <div className={'w-full flex justify-between'}>
            <button className={btnStyle}
                    onClick={prevStep}
            >
                <FontAwesomeIcon icon={faArrowLeft} width={16} />
                &nbsp;
                <span>이전</span>
            </button>
            <button className={btnStyle}
                    onClick={nextStep}
            >
                <span>다음</span>
                &nbsp;
                <FontAwesomeIcon icon={faArrowRight} width={16} />
            </button>
        </div>
    )

}

export default OTPFooter;