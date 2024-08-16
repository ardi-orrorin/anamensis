import rootFunc from "@/app/{services}/funcs";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {faXmark} from "@fortawesome/free-solid-svg-icons/faXmark";
import React, {Dispatch, SetStateAction, useCallback} from "react";
import {Root} from "@/app/{services}/types";
import {useQuery} from "@tanstack/react-query";
import rootApiService from "@/app/{services}/rootApiService";
import Link from "next/link";
import moment from "moment/moment";
import apiCall from "@/app/{commons}/func/api";
import {AxiosError} from "axios";
import {useRouter} from "next/navigation";

const RightMenu = ({
    isLogin,
    searchHistory,
    setSearchValue,
    onSearchHandler,
    setSearchHistory,
}:{
    isLogin            : boolean;
    searchHistory      : Root.SearchHistoryProps;
    setSearchValue     : Dispatch<SetStateAction<string>>;
    setSearchHistory   : Dispatch<SetStateAction<Root.SearchHistoryProps>>;
    onSearchHandler    : (init: boolean, keyword?: string) => void;
}) => {
    return (
        <div className={'sticky z-30 top-4 mt-4 flex flex-col gap-6'}>
            {isLogin && <Alert /> }
            <SearchHistory {...{searchHistory, setSearchValue, onSearchHandler, setSearchHistory}} />
        </div>
    );
}


const Alert = () => {

    const router = useRouter();

    const [more, setMore] = React.useState<boolean>(false);

    const {data} = useQuery(rootApiService.scheduleAlertToday());

    const onClickAlert = useCallback(async (sch: Root.ScheduleAlert) => {
        try {
            apiCall({
                method: 'GET',
                path: `/api/schedule/alert/${sch.id}`,
            })

            router.push(`/board/${sch.boardId}#block-${sch.hashId}`);
        } catch (e) {
            const err = e as AxiosError;
            console.error(e);
        }

    },[data]);

    return (
        <div className={[
                'w-full flex flex-col gap-2 border-b border-b-gray-200 border-solid pb-4 duration-300 overflow-y-auto',
                more ? 'max-h-fit' : 'max-h-60'
             ].join(' ')}
             data-testid={'right-menu-alert-today-container'}
        >
            <h4 className={'text-sm font-bold'}>오늘 일정</h4>
            <div className={'flex flex-col items-center gap-2'}>
                {
                    data.filter((_, index) => {
                        return more || index < 3;
                    }).map((alert, index) => {
                        return (
                            <button key={'today-alert' + index}
                                    className={'w-full text-sm px-1 hover:bg-gray-200 duration-500'}
                                    onClick={()=> onClickAlert(alert)}
                            >
                                <div className={'w-full flex flex-col gap-0.5'}>
                                    <div className={'flex gap-1'}>
                                        <span className={[
                                                'flex w-14',
                                                alert.isRead ? 'text-red-600' : 'text-blue-700'
                                              ].join(' ')}>
                                            [ {alert.isRead ? '읽음' : '안읽음'} ]
                                        </span>
                                        <h4 className={''}>
                                            {alert.boardTitle}
                                        </h4>
                                    </div>
                                    <div className={'flex gap-1'}>
                                        <strong className={'flex font-mono w-14'}>
                                            {moment(alert.alertTime).format("HH:mm")}
                                        </strong>
                                        <span>
                                            {alert.title}
                                        </span>

                                    </div>
                                </div>
                            </button>
                        )
                    })
                }
            </div>
            {
                data.length > 3 &&
                <button className={'text-xs text-blue-500'}
                        onClick={()=>setMore(!more)}
                >
                    {more ? '접기' : '더보기'}
                </button>
            }
        </div>
    )
}

const SearchHistory = ({
   searchHistory,
   setSearchValue,
   onSearchHandler,
   setSearchHistory,
}: {
    searchHistory      : Root.SearchHistoryProps;
    setSearchValue     : Dispatch<SetStateAction<string>>;
    setSearchHistory   : Dispatch<SetStateAction<Root.SearchHistoryProps>>;
    onSearchHandler    : (init: boolean, keyword?: string) => void;
}) => {
    return (
        <div className={'flex flex-col gap-2'}
             data-testid={'right-menu-search-history-container'}
        >
            <h4 className={'text-sm font-bold'}>최근 검색 내역</h4>
            <div className={'flex flex-wrap items-center gap-2'}>
                {
                    searchHistory.history.map((history, index) => {

                        return (
                            <button key={index}
                                    className={'px-2 py-1 text-xs text-blue-500 flex items-center gap-2 border rounded-full border-solid border-blue-400'}
                                    onClick={()=> {
                                        setSearchValue(history);
                                        onSearchHandler(false, history);
                                    }}
                            >
                                <button className={'h-full flex items-center'}
                                        onClick={(e)=>{
                                            e.stopPropagation();
                                            rootFunc.removeSearchHistory({searchHistory, setSearchHistory, keyword: history});
                                        }}
                                >
                                    <FontAwesomeIcon icon={faXmark} className={'text-xs'} />
                                </button>
                                <span className={'h-full flex items-center'}>
                                        {history}
                                    </span>
                            </button>
                        )
                    })
                }
            </div>
        </div>
    )
}

export default React.memo(RightMenu, (prev, next) => {
    return prev.searchHistory === next.searchHistory
        && prev.isLogin       === next.isLogin;
});