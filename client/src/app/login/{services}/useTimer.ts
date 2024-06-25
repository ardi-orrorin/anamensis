import {useEffect, useState} from "react";

const useTimer = (init: number) => {
    const [timer, setTimer] = useState<number>(init);
    useEffect(() => {
        let it = timer;

        const interval = setInterval(() => {
            it--
            setTimer(it);

            if(it === 0) {
                alert('인증 시간이 만료되었습니다.');
                window.location.reload();
            }
        }, 1000);

        return () => {
            clearInterval(interval);
        }
    },[]);

    return {timer}
}

export default useTimer;