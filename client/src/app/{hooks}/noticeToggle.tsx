import {useCallback, useEffect, useState} from "react";

const useNoticeToggle = () => {
    const [viewNotice, setViewNotice] = useState(false);

    useEffect(()=>{
        const viewNotice = localStorage.getItem('viewNotice');
        if(viewNotice) setViewNotice(JSON.parse(viewNotice));
    },[]);

    const onChangeNotice = useCallback(() => {
        setViewNotice(!viewNotice);
        localStorage.setItem('viewNotice', JSON.stringify(!viewNotice));
    },[viewNotice]);

    return {
        viewNotice,
        onChangeNotice
    }
}

export default useNoticeToggle;