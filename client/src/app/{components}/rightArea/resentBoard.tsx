import React, {Ref, RefObject, useEffect, useMemo, useRef, useState} from "react";
import {useQuery} from "@tanstack/react-query";
import userApiService from "@/app/user/{services}/userApiService";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {faEye} from "@fortawesome/free-solid-svg-icons";
import {faHeart} from "@fortawesome/free-solid-svg-icons/faHeart";
import {RateColor} from "@/app/{commons}/types/rate";
import {BoardSummaryI} from "@/app/user/{services}/userProvider";
import moment from "moment/moment";
import {Category} from "@/app/board/{services}/types";
import {useRouter} from "next/navigation";

const RecentBoard = () => {
    const {data: recentBoard} = useQuery(userApiService.boardSummery());

    const [more, setMore] = useState(false);



    return (
        <div className={'flex flex-col gap-2 border-b border-b-gray-200 border-solid pb-4'}>
            <div className={'flex gap-2 items-end'}>
                <h1 className={'text-sm font-bold'}>최근 작성한 게시글</h1>
                <button className={'text-xs text-gray-400'}
                        onClick={() => setMore(!more)}
                >
                    {more ? '접기' : '더보기'}
                </button>
            </div>
            <div className={`flex flex-col gap-2 overflow-y-hidden duration-700 ${more ? 'max-h-[450px]' : 'max-h-[90px]'}`}>
                {
                    recentBoard?.map((board, index) => (
                        <Item key={`recent-board-${board.id}`} {...board} />
                    ))
                }
            </div>
        </div>
    )
}

const Item = ({
    rate, categoryPk, createdAt, title, viewCount, id
}: BoardSummaryI ) => {

    const router = useRouter();

    const category = useMemo(() => Category.findById(categoryPk.toString()) , [categoryPk])

    const rateColor = useMemo(() =>
            RateColor.findColor(rate)?.getColor
        ,[rate])

    const createAt = useMemo(() =>
            moment().isSame(createdAt, 'day')
                ? moment(createdAt).format('HH:mm')
                : moment(createdAt).format('YYYY-MM-DD HH:mm')
        , [createdAt])

    return (
        <div className={'p-2 flex flex-col gap-2 border border-solid border-gray-200 hover:bg-gray-200 duration-300'}
             onClick={() => router.push(`/board/${id}`)}
        >
            <h5 className={'text-xs text-blue-500'}>{category?.name}</h5>
            <h2 className={'text-xs font-bold'}>{title}</h2>
            <div className={'flex justify-between'}>
                <div className={'flex gap-3 items-center text-xs'}>
                    <span className={'flex gap-1 items-center'}>
                        <FontAwesomeIcon icon={faEye}/>
                        {viewCount}
                    </span>
                    <span className={`flex gap-1 items-center`}
                    >
                        <FontAwesomeIcon icon={faHeart}
                                         style={{color: rateColor}}
                        />
                        {rate}
                    </span>
                </div>
                <span className={'text-xs text-gray-400'}>
                    {createAt}
                </span>
            </div>
        </div>

    )
}


export default React.memo(RecentBoard);