import moment from "moment";
import Image from "next/image";
import {useContext} from "react";
import BoardProvider from "@/app/board/{services}/BoardProvider";
import Link from "next/link";
import {Category} from "@/app/board/{services}/types";
import {defaultNoImg} from "@/app/{commons}/func/image";

const WriterInfo = () => {

    const { board, summary }  = useContext(BoardProvider);

    return (
        <div className={'flex p-2 border border-solid border-blue-300 rounded'}>
            <div className={'flex w-1/2 items-center p-2 gap-3 text-sm'}>
                <Image className={'border-solid border-2 border-blue-200 rounded-full'}
                       height={70}
                       width={70}
                       alt={'profile'}
                       src={defaultNoImg(board.data.profileImage)}
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
            <div className={'flex flex-col w-2/3 max-h-20 px-2 border-solid border-l border-blue-200 text-sm overflow-y-scroll'}>
                {
                    summary.map((item, index) => {
                        const category = Category.findById(item.categoryPk.toString())?.name;

                        return (
                            <Link key={'board_summary' + index}
                                  className={'flex justify-between py-0.5 h-8'}
                                  href={'/board/' + item.id}
                            >
                                <div className={'flex gap-2 items-center'}>
                                    <span className={'text-xss py-0.5 px-2 bg-blue-400 text-white'}>
                                        {category?.substring(0, category?.indexOf(' '))}
                                    </span>
                                    <span className={'text-xs line-clamp-1 w-20 sm:w-40'}>
                                        {item.title}
                                    </span>
                                </div>
                                <span className={'text-xs'}>
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

export default WriterInfo