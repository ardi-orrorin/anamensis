'use client';

import {useEffect, useState} from "react";
import apiCall from "@/app/{commons}/func/api";
import {createDebounce} from "@/app/{commons}/func/debounce";
import {Table} from "@/app/user/point-history/{services}/types";

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
                method: "GET",
                isReturnData: true,
            });

            setData(result);
        }
        fetch();

    }, []);

    return (
        <div className={'w-full h-max flex justify-center items-start'}>
            <table className={'w-full text-sm'}>
                <colgroup>
                    <col style={{width: '50%'}} />
                    <col style={{width: '15%'}} />
                    <col style={{width: '20%'}} />
                </colgroup>
                <thead className={'bg-blue-300 text-white h-8 align-middle'}>
                    <tr className={'text-sm border-x border-white border-solid'}>
                        <th className={'border-x border-white border-solid'}>테이블명</th>
                        <th className={'border-x border-white border-solid'}>포인트</th>
                        <th className={'border-x border-white border-solid'}>적립일시</th>
                    </tr>
                </thead>
                <tbody>
                {
                    data.map((e, i) => (
                        <tr key={`summary-${i}`}
                            className={`h-6 ${i % 2 === 1 ? 'bg-blue-50' : 'bg-white'}`}
                        >
                            <td className={'p-2'}>
                                {Table.fromString(e.tableName).useWith}
                            </td>
                            <td className={'p-2'}>{e.point}</td>
                            <td className={'p-2'}>{e.createdAt.substring(0, 10)}</td>
                        </tr>
                    ))
                }
                </tbody>
            </table>
        </div>
    );
}

export default PointSummary;