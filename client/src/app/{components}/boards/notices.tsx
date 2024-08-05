import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {faCalendarDays, faCircleExclamation, faEye, faUser} from "@fortawesome/free-solid-svg-icons";
import Link from "next/link";
import React, {useMemo} from "react";
import moment from "moment";

export type NoticeType = {
    id        : number;
    title     : string;
    writer    : string;
    viewCount : number;
    createdAt : string;
}

const Notices = ({data}: {data: NoticeType[]}) => {

    if(data.length === 0) return <></>
    return (
        <div className={'w-full flex-col flex gap-3 pb-3'}>
            {
                data.map((notice, index) => {
                    return <Row key={'notice' + notice.id} data={notice} />
                })
            }
        </div>
    )
}

export default React.memo(Notices, (prevProps, nextProps) => {
    return prevProps.data === nextProps.data;
});


const Row = ({data}: {data: NoticeType}) => {
    return (
        <Link className={'w-full py-2 px-4 flex justify-between shadow hover:shadow-md duration-300 border-solid border border-gray-200 hover:border-gray-500 rounded'}
              href={'/board/' + data.id}
        >
            <div className={'flex gap-1 text-sm text-gray-600'}>
                <span>
                    <FontAwesomeIcon icon={faCircleExclamation} />
                </span>
                <span className={'flex px-1 h-10 sm:h-5 line-clamp-2 break-all'}>
                    {data.title}
                </span>
            </div>
            <div className={'w-auto flex flex-col sm:flex-row text-sm text-gray-600'}>
                <span className={'min-w-32 sm:w-24 px-1 flex gap-1 justify-end'}>
                    <span>
                        <FontAwesomeIcon icon={faUser} size={'xs'} />
                    </span>
                    <span className={'w-full line-clamp-1'}>
                        {data.writer}
                    </span>
                </span>
                <span className={'min-w-24 px-1 flex justify-end gap-1'}>
                    <span>
                        <FontAwesomeIcon icon={faCalendarDays} size={'xs'} />
                    </span>
                    <span>
                        {moment(data.createdAt).format('YYYY-MM-DD') }
                    </span>
                </span>
            </div>
        </Link>
    )
}