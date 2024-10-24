'use client';

import React, {useEffect, useMemo, useRef, useState} from "react";
import apiCall from "@/app/{commons}/func/api";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import MobileMenu from "@/app/{components}/mobileMenu";
import {useCusSearchParams} from "@/app/{hooks}/searchParamsHook";
import {createDebounce} from "@/app/{commons}/func/debounce";
import {useRootHotKey} from "@/app/{hooks}/hotKey";
import SearchInfo from "@/app/{components}/leftArea/searchInfo";
import {faBars} from "@fortawesome/free-solid-svg-icons";
import {Virtuoso} from "react-virtuoso";
import RightSubMenu from "@/app/{components}/modal/rightSubMenu";
import SearchHistory from "@/app/{components}/rightArea/searchHistory";
import SearchBox from "@/app/{components}/middleArea/searchBox";
import {Root} from "@/app/{services}/types";
import {Common} from "@/app/{commons}/types/commons";
import {usePrefetchQuery, useQuery, useQueryClient} from "@tanstack/react-query";
import rootApiService from "@/app/{services}/rootApiService";
import dynamic from "next/dynamic";
import LeftMenu from "@/app/{components}/leftArea/leftMenu";
import LoadingSpinner from "@/app/{commons}/LoadingSpinner";
import RightMenu from "@/app/{components}/rightArea/rightMenu";
import Notices from "@/app/{components}/middleArea/boards/notices";
import {System} from "@/app/system/message/{services}/types";
import systemApiServices from "@/app/system/{services}/apiServices";

const DynamicBoardComponent = dynamic(() => import('@/app/{components}/middleArea/boardComponent'), {
    loading: () => <Loading />
});

const Loading = () => <div className={'w-full h-[300px] flex justify-center items-center'}><LoadingSpinner size={50}/></div>

export default function Page() {

    const roles = useQueryClient().getQueryData(['userRole']) as System.Role[];
    const {data: noticeList} = useQuery(rootApiService.getNotices());
    const {data: favorites} = useQuery(rootApiService.favorites());


    const [initLoading, setInitLoading] = useState(true);
    const [loading, setLoading] = useState(false);
    const [data, setData] = useState<Root.BoardListI[]>([]);

    const [dynamicPage, setDynamicPage] = useState<Root.DynamicPage>({
        isEndOfList: false,
        isVisible  : false,
    });

    const [menuToggle, setMenuToggle] = useState(false);

    const {
        searchParams, setSearchParams,
        setOnSearchHistory, initSearchHandler,
        searchFocus, setSearchFocus,
    } = useCusSearchParams();

    const moreRef = useRef<HTMLDivElement>(null);
    const searchRef = useRef<HTMLInputElement>(null);

    const isLogin = useMemo(()=> roles?.length > 0, [roles]);

    const notFoundResult = useMemo(()=> {
        return !initLoading && !loading && data?.length === 0
    },[initLoading, loading, data]);

    const moreToggle = useMemo(() => {
        return !loading && !dynamicPage.isEndOfList && !dynamicPage.isVisible
    },[loading, dynamicPage]);

    const fetchDebounce = createDebounce(100);

    useEffect(()=> {
        return () => {
            initSearchHandler();
        }
    },[]);

    useEffect(() => {
        if(loading) return;
        setLoading(true);
        apiCall<Common.PageResponse<Root.BoardListI>, Root.BoardListParamsI>({
            path: '/api/board',
            method: 'GET',
            params: searchParams
        })
        .then(res=> {
            if(!res) return;
            setLoading(false);
            setInitLoading(false);

            const condition = res.data.content.length < searchParams.size;

            condition ? setDynamicPage({...dynamicPage, isEndOfList: true})
                : setDynamicPage({isEndOfList: false, isVisible: false}) ;

            if(searchParams.page === 1) {
                setData(res.data.content);
                return;
            }

            searchParams.add
                ? setData([...data, ...res.data.content])
                : setData(res.data.content);
        })
    },[searchParams])

    useEffect(()=> {
        if(!moreRef.current) return;

        const ob = new IntersectionObserver((entries) => {
            const target = entries[0];
            if(target.isIntersecting) {
                if(initLoading || loading) return;

                fetchDebounce(() => {
                    setSearchParams({...searchParams, page: searchParams.page + 1, add: true});
                });
            }
        });

        ob.observe(moreRef.current as Element);
        return () => ob.disconnect();
    },[moreRef?.current, loading]);

    useRootHotKey({searchRef})

    return (
        <div className={'w-auto flex flex-col gap-2 bg-gray-50'}
             onClick={()=> {
                 setOnSearchHistory(false)
                 setSearchFocus(false)
             }}
        >
            <div className={'w-full border-t border-solid border-t-gray-200'}>
                <div className={'fixed z-30 sm:hidden bottom-5 right-5'}>
                    <button className={'w-14 h-14 p-5 rounded-full bg-white shadow-md active:bg-main active:text-white duration-300'}
                            onClick={()=> setMenuToggle(!menuToggle)}
                    >
                        <FontAwesomeIcon icon={faBars} className={'h-auto'} />
                    </button>
                    <MobileMenu {...{menuToggle, setMenuToggle, isLogin}} />
                </div>
                <div className={'flex flex-row justify-start'}>
                    <div className={'hidden sm:block relative min-w-[300px] min-h-screen'}>
                        <LeftMenu {...{roles}}/>
                    </div>
                    <div className={'w-full flex flex-col justify-start items-center mt-2'}>
                        <div className={'sticky z-40 top-0 py-3 w-full flex flex-col rounded-full justify-center items-center gap-3'}>
                            <div className={[
                                'relative flex flex-col justify-center bg-white shadow-sm duration-700 rounded-full',
                                searchFocus ? 'w-full sm:w-[70%]' : 'w-70 sm:w-[50%]',
                            ].join(' ')}>
                                <SearchBox {...{searchRef}} />
                                <SearchHistory />
                            </div>
                            <SearchInfo />
                        </div>
                        <div className={'w-full min-w-[350px] max-w-[600px] px-4 flex flex-col justify-start items-center'}>
                            <Notices data={noticeList} />
                            <div className={'w-full flex flex-wrap gap-2'}>
                                {
                                    notFoundResult
                                    && <div className={'text-center text-2xl w-full py-20 text-gray-600'}
                                            data-testid={'not-found-result'}
                                    >검색 결과가 없습니다.</div>
                                }
                                <Virtuoso style={{width: '100%', height: '100%', overflow: 'hidden'}}
                                          totalCount={data.length}
                                          data={data}
                                          useWindowScroll
                                          itemContent={(index, data) =>
                                              <div className={'py-1.5'}>
                                                  <DynamicBoardComponent key={'boardsummary' + index} {...{...data, favorites, isLogin, roles}} />
                                              </div>
                                          }
                                />
                            </div>
                        </div>
                    </div>
                    <div className={'hidden lg:flex lg:flex-col min-w-[300px] px-3 max-w-[300px] border-l border-solid border-l-gray-200 bg-gray-50'}>
                        <RightMenu {...{isLogin}} />
                    </div>
                </div>
            </div>
            <div className={'relative'}>
                <div className={'absolute w-full -top-72 flex justify-center text-xs py-5'}>
                    {
                        moreToggle
                        && <div ref={moreRef} className={'w-10 h-10'} />
                    }
                </div>
            </div>
            <RightSubMenu {...{isLogin}} />
        </div>
    )
}

