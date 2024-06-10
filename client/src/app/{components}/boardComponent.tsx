import Image from "next/image";
import Link from "next/link";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {faComment, faEye} from "@fortawesome/free-solid-svg-icons";
import {faHeart} from "@fortawesome/free-solid-svg-icons/faHeart";
import {BlockI} from "@/app/board/{services}/types";

export interface BoardListI {
    id           : string;
    title        : string;
    viewCount    : number;
    rate         : number;
    writer       : string;
    profileImage?: string;
    createdAt    : string;
    commentCount : number;
    body?        : string;
}

const BoardComponent = (props: BoardListI) => {
    const {
       id, rate, writer
        , createdAt, title, viewCount
        , profileImage, commentCount
        , body
    } = props;

    let text = ''

    try {
        const jsonString = body!.replaceAll('=', ':')
            .replaceAll('{', '{"')
            .replaceAll('}', '"}')
            .replaceAll(':', '":"')
            .replaceAll(', ', '", "')
            .replaceAll('"{""}"', '{}')
            .replaceAll('"}"', '"}')
            .replaceAll('"{"', '{"')

        const bodyObj: BlockI[] = JSON.parse(jsonString);
        bodyObj.forEach((block) => {
            const regex = '0{4}'
            if(!block.code.match(regex)) return;
            text += block.value + '\n';
        })

    } catch (e) {
        console.log(e)
    }



    return (
        <Link className={'flex flex-col w-96 min-w-96 bg-white shadow'}
              href={`/board/${id}`}
        >
            <div className={'flex justify-between p-3 h-auto items-center'}>
                <div className={'h-auto flex items-center'}>
                    {title}
                </div>
                <div className={'flex flex-col gap-1 items-center'}>
                    <div className={'flex items-center gap-1'}>
                        <Image className={'rounded-full'}
                               src={process.env.NEXT_PUBLIC_CDN_SERVER + profileImage!}
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
            <div className={'p-3 flex flex-col min-h-20 border-y border-solid border-gray-200'}>
                <p className={'line-clamp-[4] text-xs'}>
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
                    <span className={'flex gap-1 items-center'}>
                        <FontAwesomeIcon icon={faHeart} />
                        {rate}
                    </span>
                    <span className={'flex gap-1 items-center'}>
                        <FontAwesomeIcon icon={faComment} />
                        {commentCount}
                    </span>
                </div>
            </div>
        </Link>
    )
}

export default BoardComponent;