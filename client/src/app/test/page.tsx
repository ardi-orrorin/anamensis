'use client'
import {useEffect, useState} from "react";
import axios from "axios";

type FileProps = {
    length: number
    index: number
    progress: number
    chunkSize: number
    prevEnd: number
    file: File
}
// input stream 용 테스트 컴포넌트
export default function Page(){

    const [eventList, setEventList] = useState<string[]>([]);

    useEffect(() => {
        const url = process.env.NEXT_PUBLIC_SERVER + '/public/api/test';
        const event = new EventSource(url);

        event.onopen = () => {
            console.log("open");
        }

        event.onmessage = async (e) => {
            const data= await e.data
            setEventList(prev => [...prev, data]);
        }

        event.onerror = () => {
            console.log("error");
        }

        return () => event.close();

    },[])

    const pushEvent = async () => {
        const url = process.env.NEXT_PUBLIC_SERVER + '/public/api/test/push';
        await axios.get(url)
            .then((res) => {
                console.log(res.data);
            });
    }

    return (
        <div>
            <div>
                <button className={'py-2 px-3 bg-blue-500 text-white m-2'} onClick={pushEvent}>push event</button>
            </div>
            <div>
                {
                    eventList.length > 0 &&
                    eventList.map((event, i) =>
                        <div key={`test-${i}`}>{event}</div>
                    )
                }
            </div>
        </div>
    )
}