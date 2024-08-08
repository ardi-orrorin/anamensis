'use client';

import React, {useCallback, useEffect, useState} from "react";

const ProgressBar = () => {
    const [scrollWidth, setScrollWidth] = useState(0);
    const updateProgressBar = useCallback(() => {
        const scrollTop = document.documentElement.scrollTop || document.body.scrollTop;
        const scrollHeight = document.documentElement.scrollHeight || document.body.scrollHeight;
        const clientHeight = document.documentElement.clientHeight;
        const scrolled = (scrollTop / (scrollHeight - clientHeight)) * 100;
        setScrollWidth(scrolled);
    },[]);

    useEffect(() => {
        window.addEventListener('scroll', updateProgressBar);
        return () => {
            window.removeEventListener('scroll', updateProgressBar);
        };
    }, []);
    return (
        <div className={`sticky left-0 top-0 duration-300`}
             style={{width: '100%', height: '0.2rem', zIndex: 1000, backgroundColor: 'rgba(0,0,0,0.7)'}}
        >
            <div className={'bg-blue-400'}
                 style={{width: `${scrollWidth}%`, height: '100%'}} />
        </div>
    )
}

export default React.memo(ProgressBar, () => true);