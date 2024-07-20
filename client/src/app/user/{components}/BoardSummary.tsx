'use client';

import {useContext} from "react";
import Link from "next/link";
import {RateColor} from "@/app/{commons}/types/rate";
import UserProvider from "@/app/user/{services}/userProvider";


const BoardSummary = () => {

    const {boardSummary} = useContext(UserProvider);

    return (
        <div className={'w-full h-max flex justify-center items-start overflow-y-hidden'}>
            <div className={'w-full flex flex-col text-sm'}>
                {
                    boardSummary.map((e, i) => {
                        return (
                            <Link key={`summary-${i}`}
                                  href={`/board/${e.id}`}
                                  className={`flex gap-3 text-sm w-full hover:bg-gray-100 cursor-pointer rounded py-1 h-8 hover:shadow duration-500`}
                            >
                                <span className={`py-0.5 w-12 rounded text-xs text-white flex justify-center items-center`}
                                      style={{backgroundColor: RateColor.findColor(e.rate)?.getColor}}
                                >{e.rate}</span>

                                <div className={'flex justify-between w-full'}>
                                <div className={'py-0.5 w-40 line-clamp-1'}>
                                    { e.title }
                                </div>
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