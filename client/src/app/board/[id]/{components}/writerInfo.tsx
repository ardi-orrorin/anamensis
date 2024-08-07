import moment from "moment";
import Image from "next/image";
import React, {useMemo} from "react";
import {BoardService} from "@/app/board/{services}/BoardProvider";
import Link from "next/link";
import {Category} from "@/app/board/{services}/types";
import {defaultProfile} from "@/app/{commons}/func/image";
import {NO_PROFILE} from "@/app/{services}/constants";
import {BoardSummaryI} from "@/app/user/{services}/userProvider";

const WriterInfo = ({
    board,
    summary
}:{
    board: BoardService,
    summary: BoardSummaryI[]
}) => {

    return (
        <div className={'flex flex-col sm:flex-row p-2 gap-2 sm:gap-0 border border-solid border-blue-300 rounded'}>
            <div className={'flex w-full sm:w-1/2 items-center p-2 gap-2 text-sm  duration-500'}>
                <Image className={'border-solid border-2 border-blue-200 rounded-full'}
                       height={70}
                       width={70}
                       alt={'profile'}
                       src={defaultProfile(board.data.profileImage)}
                       onError={(e) => {
                           e.currentTarget.src = NO_PROFILE;
                       }}
                />
                <div className={'flex flex-col gap-2'}>
                    <div className={'flex gap-1'}>
                        <label>
                            작성자 : &nbsp;
                        </label>
                        <span className={'font-bold'}>
                            {board.data.writer}
                        </span>
                    </div>
                    <div className={'flex gap-1'}>
                        <label>
                            회원가입일 : &nbsp;
                        </label>
                        <span className={'font-bold'}>
                            { board.data.writerCreatedAt.substring(0, 10) }
                        </span>
                    </div>
                </div>
            </div>
            <div className={'flex w-full flex-col sm:w-2/3 max-h-28 sm:max-h-20 px-2 sm:border-solid sm:border-l sm:border-blue-200 text-sm overflow-y-scroll'}>
                {
                    summary.map((item, index) => {
                        const category = Category.findById(item.categoryPk.toString())?.name;

                        return (
                            <Link key={'board_summary' + index}
                                  className={'flex justify-between px-1 py-2 sm:py-1 h-10 sm:h-8 hover:bg-blue-300 hover:text-white duration-300'}
                                  href={'/board/' + item.id}
                            >
                                <div className={'flex gap-2 items-center'}>
                                    <span className={'text-xs py-1 px-2 bg-blue-400 text-white'}>
                                        {category?.substring(0, category?.indexOf(' '))}
                                    </span>
                                    <span className={'text-xs line-clamp-1 w-40 sm:w-40'}>
                                        {item.title}
                                    </span>
                                </div>
                                <span className={'flex items-center text-xs'}>
                                    {moment(item.createdAt).format('YYYY-MM-DD')}
                                </span>
                            </Link>
                        )
                    })
                }
            </div>
        </div>
    )
}

export default React.memo(WriterInfo, (prev, next) => {
    return prev.board === next.board
        && prev.summary === next.summary;
});