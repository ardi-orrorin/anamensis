'use client';

import {useEffect, useState} from "react";
import apiCall from "@/app/{commons}/func/api";
import {createDebounce} from "@/app/{commons}/func/debounce";
import {Table} from "@/app/user/point-history/{services}/types";
import {RateColor} from "@/app/{commons}/types/rate";

export interface PointSummaryI {
    id: number;
    tableName: string;
    point: number;
    createdAt: string;
}

const PointSummary = () => {

    const [data, setData] = useState<PointSummaryI[]>([]);

    useEffect(() => {

        const fetch = async () => {
            const result = await apiCall<PointSummaryI[]>({
                path: "/api/user/point-history/summary",
                params: {page:1, size: 8},
                method: "GET",
                isReturnData: true,
            });

            setData(result);
        }
        fetch();

    }, []);

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