'use client';

import axios from "axios";
import {useEffect, useState} from "react";
import Link from "next/link";
import apiCall from "@/app/{commons}/func/api";
import {createDebounce} from "@/app/{commons}/func/debounce";


export interface BoardSummaryI {
    id: number;
    title: string;
    rate: number;
    viewCount: number;
    createdAt: string;
}

const BoardSummary = () => {

    const [data, setData] = useState<BoardSummaryI[]>([]);

    useEffect(() => {

        const fetch = async () => {
            await apiCall<BoardSummaryI[]>({
                path: "/api/board/summary",
                method: "GET",
            })
            .then((res) => {
                setData(res.data);
            });
        }
        const debounce = createDebounce(500);
        debounce(fetch);

    }, []);

    return (
        <div className={'w-full flex justify-center items-center'}>
            <table className={'w-full text-sm'}>
                <colgroup>
                    <col style={{width: '50%'}} />
                    <col style={{width: '15%'}} />
                    <col style={{width: '15%'}} />
                    <col style={{width: '20%'}} />
                </colgroup>
                <thead className={'bg-blue-300 text-white h-8 align-middle'}>
                    <tr className={'text-sm border-x border-white border-solid'}>
                        <th className={'border-x border-white border-solid'}>제목</th>
                        <th className={'border-x border-white border-solid'}>좋아요</th>
                        <th className={'border-x border-white border-solid'}>조회수</th>
                        <th className={'border-x border-white border-solid'}>작성일</th>
                    </tr>
                </thead>
                <tbody>
                {
                    data.map((e, i) => (
                        <tr key={`summary-${i}`}
                            className={`h-10 ${i % 2 === 1 ? 'bg-blue-50' : 'bg-white'}`}
                        >
                            <td className={'p-2'}>
                                <Link href={`/board/${e.id}`}>
                                    {e.title}
                                </Link>
                            </td>
                            <td className={'p-2'}>{e.rate}</td>
                            <td className={'p-2'}>{e.viewCount}</td>
                            <td className={'p-2'}>{e.createdAt.substring(0, 10)}</td>
                        </tr>
                    ))
                }
                </tbody>
            </table>
        </div>
    );
}

export default BoardSummary;