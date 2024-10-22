import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {faXmark} from "@fortawesome/free-solid-svg-icons/faXmark";
import React, {useCallback, useEffect, useRef} from "react";
import {Root} from "@/app/{services}/types";
import {useQuery} from "@tanstack/react-query";
import rootApiService from "@/app/{services}/rootApiService";
import moment from "moment/moment";
import apiCall from "@/app/{commons}/func/api";
import {AxiosError} from "axios";
import {useRouter} from "next/navigation";
import {useSearchHistory} from "@/app/{hooks}/searchHisotryHook";
import {useCusSearchParams} from "@/app/{hooks}/searchParamsHook";
import RecentBoard from "@/app/{components}/rightArea/resentBoard";
import RecentPoint from "@/app/{components}/rightArea/recentPoint";

interface RightMenuProps {
    isLogin            : boolean;
}

const RightMenu = ({
    isLogin,
}: RightMenuProps) => {
    return (
        <div className={'sticky z-30 top-4 mt-4 flex flex-col gap-6'}>
            {
                isLogin
                && <>
                    <Alert />
                    <RecentBoard />
                    <RecentPoint />
                </>
            }
            <SearchHistory />
        </div>
    );
}

const Alert = () => {

    const router = useRouter();

    const [more, setMore] = React.useState<boolean>(false);

    const firstRef = useRef<HTMLButtonElement>(null);

    const {data} = useQuery(rootApiService.scheduleAlertToday());

    useEffect(() => {
        if (!more && firstRef.current) {
            firstRef.current.scrollIntoView({block: 'nearest', behavior: 'smooth'});
        }
    }, [more]);

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
        <div className={`w-full flex flex-col gap-2 border-b border-b-gray-200 border-solid pb-4`}
             data-testid={'right-menu-alert-today-container'}
        >
            <div className={'flex gap-2 items-end'}>
                <h4 className={'text-sm font-bold'}>오늘 일정</h4>
                {
                    data.length > 3 &&
                  <button className={'text-xs text-gray-400'}
                          onClick={()=>setMore(!more)}
                  >
                      {more ? '접기' : '더보기'}
                  </button>
                }
            </div>

            <div className={`flex flex-col gap-2 duration-500  ${more ? 'max-h-[360px] overflow-y-auto' : 'max-h-[100px] overflow-y-hidden'}`}>
                {
                    data.map((alert, index) => {
                        return (
                            <button key={'today-alert' + index}
                                    ref={index === 0 ? firstRef : null}
                                    className={'w-full text-sm p-1 border border-solid border-gray-300 shadow hover:bg-gray-200 duration-500'}
                                    onClick={()=> onClickAlert(alert)}
                            >
                                <div className={'w-full flex flex-col gap-0.5 text-xs'}>
                                    <div className={'flex gap-1'}>
                                        <span className={[
                                                'flex w-14',
                                                alert.isRead ? 'text-red-600' : 'text-blue-700'
                                              ].join(' ')}>
                                            [{alert.isRead ? '읽음' : '안읽음'}]
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

        </div>
    )
}

const SearchHistory = () => {

    const {searchHistory, removeSearchHistories} = useSearchHistory();

    const {setSearchValue, onSearchHandler} = useCusSearchParams();

    return (
        <div className={'flex flex-col gap-2 border-b border-b-gray-200 border-solid pb-4'}
             data-testid={'right-menu-search-history-container'}
        >
            <h4 className={'text-sm font-bold'}>최근 검색 내역</h4>
            <div className={'flex flex-wrap items-center gap-2'}>
                {
                    searchHistory?.history.map((keyword, index) => {
                        return (
                            <button key={index}
                                    className={'max-w-[270px] px-2 py-1 text-xs text-blue-500 flex items-center gap-1 border rounded-full border-solid border-blue-400'}
                                    onClick={()=> {
                                        setSearchValue(keyword);
                                        onSearchHandler({init: false, keyword});
                                    }}
                            >
                                <button className={'h-full flex items-center'}
                                        onClick={(e)=>{
                                            e.stopPropagation();
                                            removeSearchHistories(keyword);
                                        }}
                                >
                                    <FontAwesomeIcon icon={faXmark} className={'text-xs'} />
                                </button>
                                <span className={'line-clamp-1 text-start'}>{keyword}</span>
                            </button>
                        )
                    })
                }
            </div>
        </div>
    )
}

export default React.memo(RightMenu, (prev, next) => {
    return prev.isLogin === next.isLogin;
});