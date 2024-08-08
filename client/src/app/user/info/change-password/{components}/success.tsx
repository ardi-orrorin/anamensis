import {useEffect} from "react";
import {useRouter} from "next/navigation";

const Success = () => {

    const router = useRouter();

    useEffect(()=>{
        const timer = setTimeout(()=>{
            router.push('/user/info');
        }, 1500)

        return () => {
            clearTimeout(timer);
        }

    },[])

    return (
        <div className={'flex flex-col gap-4 items-center justify-center'}>
            <p>
                비밀번호 변경이 완료되었습니다.
            </p>
        </div>
    )
}

export default Success;