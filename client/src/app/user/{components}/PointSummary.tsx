'use client';

import React, {useContext, useEffect, useState} from "react";
import apiCall from "@/app/{commons}/func/api";
import {createDebounce} from "@/app/{commons}/func/debounce";
import {Table} from "@/app/user/point-history/{services}/types";
import {RateColor} from "@/app/{commons}/types/rate";
import useSWR, {preload} from "swr";
import LoadingSpinner from "@/app/{commons}/LoadingSpinner";
import UserProvider from "@/app/user/{services}/userProvider";
import moment from "moment";



const PointSummary = () => {

    const {pointSummary} = useContext(UserProvider);

    return (
        <div className={'w-full h-max flex flex-col gap-2 justify-center items-start'}>
            {
                pointSummary.map((e, i) => (
                    <div key={`summary-${i}`}
                        className={`flex gap-3 text-sm w-full`}
                    >
                        <span className={['py-0.5 w-12 text-white rounded text-xs flex justify-center items-center', e.point >=0 ? 'bg-blue-400' : 'bg-red-400'].join(' ')}>
                            {e.point}
                        </span>
                        <div className={'flex justify-between w-full'}>
                            <span className={'py-0.5 '}>
                                {Table.fromString(e.tableName).useWith}
                            </span>
                            <span className={'py-0.5 flex justify-end items-center'}>
                                {moment(e.createdAt).format('YYYY-MM-DD')}
                            </span>
                        </div>
                    </div>
                ))
            }
        </div>
    );
}

export default PointSummary;