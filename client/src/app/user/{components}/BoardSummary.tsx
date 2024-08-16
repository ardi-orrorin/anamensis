'use client';

import React, {useContext, useEffect, useState} from "react";
import Link from "next/link";
import {RateColor} from "@/app/{commons}/types/rate";
import UserProvider, {BoardSummaryI} from "@/app/user/{services}/userProvider";
import moment from "moment";
import useSWR, {preload} from "swr";
import apiCall from "@/app/{commons}/func/api";
import {useQuery} from "@tanstack/react-query";
import userApiService from "@/app/user/{services}/userApiService";

const BoardSummary = () => {

    const {data: boardSummary} = useQuery(userApiService.boardSummery());

    return (
        <div className={'w-full h-max flex justify-center items-start overflow-y-hidden'}>
            <div className={'w-full flex flex-col text-sm'}>
                {
                    boardSummary
                    && boardSummary?.length > 0
                    && boardSummary?.map((e, i) => {
                        return (
                            <Link key={`summary-${i}`}
                                  href={`/board/${e.id}`}
                                  className={`flex gap-3 text-sm w-full justify-between hover:bg-gray-100 cursor-pointer rounded py-1 h-8 hover:shadow duration-500`}
                            >
                                <span className={`py-0.5 w-12 rounded text-xs text-white flex justify-center items-center`}
                                      style={{backgroundColor: RateColor.findColor(e.rate)?.getColor}}
                                >{e.rate}</span>

                                <div className={'flex justify-between w-full'}>
                                <div className={'py-0.5 w-24 sm:w-40 line-clamp-1'}>
                                    { e.title }
                                </div>
                                    <div className={'flex justify-end'}>
                                        <span className={'py-0.5 flex justify-end items-center'}>
                                            {e.viewCount}
                                        </span>
                                        <span className={'py-0.5 w-24 min-w-24 flex justify-end items-center'}>
                                            { moment(e.createdAt).format('YYYY-MM-DD') }
                                        </span>
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

export default React.memo(BoardSummary);