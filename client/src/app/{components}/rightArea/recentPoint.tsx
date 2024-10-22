import {useQuery} from "@tanstack/react-query";
import userApiService from "@/app/user/{services}/userApiService";
import React, {useState} from "react";
import {PointSummaryI} from "@/app/user/{services}/userProvider";
import {Table} from "@/app/user/point-history/{services}/types";
import moment from "moment";
import Link from "next/link";

const RecentPoint = () => {
    const {data: recentPoint } = useQuery(userApiService.pointSummary())

    return (
        <div className={'flex flex-col gap-2 border-b border-b-gray-200 border-solid pb-4'}>
            <h1 className={'flex gap-2 items-end text-sm'}>
                <span className={'font-bold'}>
                    최근 적립한 포인트
                </span>
                <Link className={'text-xs text-gray-400'}
                    href={'/user/point-history'} >
                    전체보기
                </Link>

            </h1>
            <div className={'flex flex-col gap-2'}>
                {
                    recentPoint.map(point => (
                        <Item key={`recent-point-${point.id}`}
                              {...point}
                        />
                    ))
                }
            </div>
        </div>
    )
}

const Item = ({point, id, createdAt, tableName}: PointSummaryI) => {
    return (
        <div className={`flex items-center gap-3 text-sm w-full`}>
            <div className={'flex items-center justify-between w-full'}>
                <div className={'space-x-1'}>
                    <span className={`text-xs2 ${point >= 0 ? ' text-blue-500' : 'text-red-400'}`}>
                        [{point}]
                    </span>
                    <span className={'py-0.5 text-xs'}>
                        {Table.fromString(tableName).useWith}
                    </span>
                </div>

                <span className={'py-0.5 flex justify-end items-center text-xs text-gray-400'}>
                    {moment(createdAt).format('YYYY-MM-DD')}
                </span>
            </div>
        </div>
    )
}

export default React.memo(RecentPoint);