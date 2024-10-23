import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {faCalendarDays, faCaretRight, faCircleExclamation, faUser} from "@fortawesome/free-solid-svg-icons";
import Link from "next/link";
import React from "react";
import moment from "moment";
import {Root} from "@/app/{services}/types";
import useNoticeToggle from "@/app/{hooks}/noticeToggle";

const Notices = ({data}: {data: Root.NoticeType[]}) => {
    const {viewNotice, onChangeNotice} = useNoticeToggle();

    return (
        <div className={'w-full flex flex-col gap-3'}>
            <div className={'w-full p-2 flex justify-between items-center text-sm border-b border-solid border-gray-400'}>
                <div className={'flex gap-1 items-center'}>
                    <FontAwesomeIcon icon={faCaretRight}
                                     className={['font-bold duration-500', viewNotice ? 'rotate-90' : 'rotate-0'].join(' ')}
                                     size={'lg'}
                    />
                    <button className={'outline-0'}
                            onClick={onChangeNotice}
                            data-testid={'notice-toggle'}
                    >
                        공지사항
                    </button>
                </div>

                <button className={'outline-0'}
                        onClick={onChangeNotice}
                        data-testid={'notice-toggle-view'}
                >
                    { viewNotice ? '접기' : '보기' }
                </button>
            </div>
            <div className={['overflow-y-hidden duration-500',viewNotice ? 'max-h-80' : 'max-h-0'].join(' ')}>
                <div className={'w-full flex-col flex gap-3 pb-3'}
                     data-testid={'notices'}
                >
                    {
                        data.length > 0
                        && data.map((notice, index) => {
                            return <Row key={'notice' + notice.id} data={notice} />
                        })
                    }
                </div>
            </div>
        </div>

    )
}

const Row = ({data}: {data: Root.NoticeType}) => {
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

export default React.memo(Notices, (prevProps, nextProps) => {
    return prevProps.data === nextProps.data;
});

