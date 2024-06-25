'use client';
import {useCallback, useState} from "react";

export default function Page() {

    const [list, setList] = useState<string[]>([]);

    const handleClick = useCallback(() => {
        const temp: string[] = [];

        const event = new EventSource('http://localhost:8080/public/test/test');
        event.onmessage = (e) => {
            temp.push(e.data);
            setList([...temp]);
            window.scrollTo(0, document.body.scrollHeight + 100);
        }

        event.onerror = (e) => {
            event.close();
        }
    },[]);

    return (
        <div>
            <button onClick={handleClick}>Click me!</button>
            <div className={'flex flex-col leading-none'}>
            {
                list.map((item, index) => {
                    return (
                        <div key={index} className={'text-sm h-auto leading-none'}>
                            {item}
                        </div>
                    )
                })
            }
            </div>
            <div className={'h-[1rem]'} />
        </div>
    )
}