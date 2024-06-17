'use client';

import React, {useEffect, useState} from "react";
import apiCall from "@/app/{commons}/func/api";
import {createDebounce} from "@/app/{commons}/func/debounce";
import {Table} from "@/app/user/point-history/{services}/types";
import {RateColor} from "@/app/{commons}/types/rate";
import useSWR from "swr";
import LoadingSpinner from "@/app/{commons}/LoadingSpinner";

export interface PointSummaryI {
    id: number;
    tableName: string;
    point: number;
    createdAt: string;
}

const PointSummary = () => {

    const [data, setData] = useState<PointSummaryI[]>([]);

    const initFetch = useSWR('/api/user/point-history/summary', async () => {
        await apiCall<PointSummaryI[]>({
            path: "/api/user/point-history/summary",
            params: {page:1, size: 8},
            method: "GET",
            isReturnData: true,
        })
        .then((res) => {
            setData(res);
        });
    },{
        revalidateOnFocus: false,
    });


    if(initFetch.isLoading) return <LoadingSpinner size={30} />;

    return (
        <div className={'w-full h-max flex flex-col gap-2 justify-center items-start'}>
            {
                data.map((e, i) => (
                    <div key={`summary-${i}`}
                        className={`flex gap-3 text-sm w-full`}
                    >
                        <span className={`py-0.5 w-12 bg-blue-400 text-white rounded text-xs flex justify-center items-center`}>{e.point}</span>
                        <div className={'flex justify-between w-full'}>
                            <span className={'py-0.5 '}>
                                {Table.fromString(e.tableName).useWith}
                            </span>
                            <span className={'py-0.5 px-4 flex justify-center items-center'}>{e.createdAt.substring(0, 10)}</span>
                        </div>

                    </div>
                ))
            }
        </div>
    );
}

export default PointSummary;