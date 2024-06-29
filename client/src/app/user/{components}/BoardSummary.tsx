'use client';

import {useEffect, useState} from "react";
import Link from "next/link";
import apiCall from "@/app/{commons}/func/api";
import {createDebounce} from "@/app/{commons}/func/debounce";
import {Table} from "@/app/user/point-history/{services}/types";
import {RateColor} from "@/app/{commons}/types/rate";
import useSWR, {preload} from "swr";
import LoadingSpinner from "@/app/{commons}/LoadingSpinner";


export interface BoardSummaryI {
    id          : number;
    categoryPk  : number;
    title       : string;
    rate        : number;
    viewCount   : number;
    createdAt   : string;
}

const BoardSummary = () => {

    const [data, setData] = useState<BoardSummaryI[]>([]);

    preload('/api/board/summary', async () => {
        return await apiCall<BoardSummaryI[]>({
            path: "/api/board/summary",
            params: {page:1, size: 8},
            method: "GET",
        })
    })
    .then((res) => {
        setData(res.data);
    });

    // if(initFetch.isLoading) return <LoadingSpinner size={30} />;

    return (
        <div className={'w-full h-max flex justify-center items-start'}>
            <div className={'w-full flex flex-col text-sm'}>
                {
                    data.map((e, i) => {
                        return (
                            <Link key={`summary-${i}`}
                                  href={`/board/${e.id}`}
                                  className={`flex gap-3 text-sm w-full hover:bg-gray-100 cursor-pointer rounded py-1`}
                            >
                                <span className={`py-0.5 w-12 rounded text-xs text-white flex justify-center items-center`}
                                      style={{backgroundColor: RateColor.findColor(e.rate)?.getColor}}
                                >{e.rate}</span>

                                <div className={'flex justify-between w-full'}>
                                <span className={'py-0.5 '}>
                                    { e.title }
                                </span>
                                    <div className={'flex '}>
                                        <span className={'py-0.5 px-4 flex justify-center items-center'}>{e.viewCount}</span>
                                        <span className={'py-0.5 px-4 flex justify-center items-center'}>{e.createdAt.substring(0, 10)}</span>
                                    </div>
                                </div>
                            </Link>
                        )
                    })
                }
            </div>
        </div>
    );
}

export default BoardSummary;