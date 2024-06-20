import Image from "next/image";
import Link from "next/link";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {faComment, faEye} from "@fortawesome/free-solid-svg-icons";
import {faHeart} from "@fortawesome/free-solid-svg-icons/faHeart";
import {BlockI, Category} from "@/app/board/{services}/types";
import {RateColor} from "@/app/{commons}/types/rate";
import {defaultProfile} from "@/app/{commons}/func/image";

export interface BoardListI {
    id           : string;
    categoryPk   : string;
    title        : string;
    viewCount    : number;
    rate         : number;
    writer       : string;
    profileImage?: string;
    createdAt    : string;
    commentCount : number;
    body?        : BlockI[];
    isPublic     : boolean;
}
const BoardComponent = (props: BoardListI) => {
    const {
       id, rate, writer
        , createdAt, title, viewCount
        , profileImage, commentCount
        , body, categoryPk, isPublic
    } = props;

    let text = '';
    try {
        body!.forEach((block) => {
            const regex = '0{4}'
            if(!block.code.match(regex)) return;
            text += block.value + '\n';
        })

    } catch (e) {
        console.log(e)
    }

    return (
        <Link className={'flex flex-col w-[350px] min-w-[350px] h-[150px] bg-white shadow active:bg-blue-50 hover:shadow-xl active:shadow-xl duration-300'}
              href={`/board/${id}`}
              prefetch={true}
        >
            <div className={'flex justify-between p-3 h-auto items-center'}>
                <div className={'h-auto flex flex-col gap-1'}>
                    <span className={'flex gap-2 text-xs text-blue-700'}>
                        <span>
                            {Category.findById(categoryPk)?.name}
                        </span>
                        <span className={'text-red-600'}>
                            {isPublic ? '' : '비공개'} {id}
                        </span>
                    </span>
                    <span className={'text-sm'}>
                        {title}
                    </span>
                </div>
                <div className={'flex flex-col gap-1 items-center'}>
                    <div className={'flex items-center gap-1'}>
                        <Image className={'rounded-full'}
                                  src={defaultProfile(profileImage)}
                                  width={25}
                                  height={25}
                                  alt={''}
                        />
                        <span className={'text-sm'}>
                            {writer}
                        </span>
                    </div>

                </div>

            </div>
            <div className={'p-3 flex flex-col min-h-14 border-y border-solid border-gray-200'}>
                <p className={'line-clamp-[2] text-xs'}>
                    {text}
                </p>
            </div>
            <div className={'py-2 px-3 flex justify-between items-center text-xs text-gray-500 '}>
                <span>
                    {createdAt}
                </span>
                <div className={'flex gap-3 items-center'}>
                    <span className={'flex gap-1 items-center'}>
                        <FontAwesomeIcon icon={faEye} />
                        {viewCount}
                    </span>
                    <span className={`flex gap-1 items-center`}
                          style={{color: RateColor.findColor(rate)?.getColor}}
                    >
                        <FontAwesomeIcon icon={faHeart} />
                        {rate}
                    </span>
                    <span className={`flex gap-1 items-center`}
                          style={{color: RateColor.findColor(commentCount)?.getColor}}
                    >
                        <FontAwesomeIcon icon={faComment} />
                        {commentCount}
                    </span>
                </div>
            </div>
        </Link>
    )
}
export default BoardComponent;