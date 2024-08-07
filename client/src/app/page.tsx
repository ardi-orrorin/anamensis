'use client';

import React, {useCallback, useEffect, useMemo, useRef, useState} from "react";
import apiCall from "@/app/{commons}/func/api";
import BoardComponent from "@/app/{components}/boardComponent";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import LeftMenu from "@/app/{components}/leftMenu";
import MobileMenu from "@/app/{components}/mobileMenu";
import SearchParamsProvider from "@/app/{services}/SearchParamsProvider";
import {createDebounce} from "@/app/{commons}/func/debounce";
import {useRootHotKey} from "@/app/{hooks}/hotKey";
import Notices from "@/app/{components}/boards/notices";
import SearchInfo from "@/app/{components}/searchInfo";
import {faBars, faCaretRight} from "@fortawesome/free-solid-svg-icons";
import {Virtuoso} from "react-virtuoso";
import RightSubMenu from "@/app/{components}/rightSubMenu";
import SearchHistory from "@/app/{components}/searchHistory";
import SearchBox from "@/app/{components}/searchBox";
import {Root} from "@/app/{services}/types";
import {Common} from "@/app/{commons}/types/commons";
import {System} from "@/app/user/system/{services}/types";

export default function Page() {

    const pageSize = 20;
    const [initLoading, setInitLoading] = useState(true);
    const [loading, setLoading] = useState(false);
    const [data, setData] = useState<Root.BoardListI[]>([]);
    const [roles, setRoles] = useState<System.Role[]>([]);
    const [searchValue, setSearchValue] = useState('');
    const [searchFocus, setSearchFocus] = useState(false);
    const [dynamicPage, setDynamicPage] = useState<Root.DynamicPage>({
        isEndOfList: false,
        isVisible  : false,
    });
    const [menuToggle, setMenuToggle] = useState(false);

    const [favorites, setFavorites] = useState<string[]>([]);

    const [searchParams, setSearchParams] = useState<Root.BoardListParamsI>({
        page: 1,
        size: pageSize,
    } as Root.BoardListParamsI);

    const [noticeList, setNoticeList] = useState<Root.NoticeType[]>([]);
    const [searchHistory, setSearchHistory] = useState<Root.SearchHistoryProps>({
        toggle: true,
        history:[] as string[]
    });
    const [onSearchHistory, setOnSearchHistory] = useState(false);

    const [viewNotice, setViewNotice] = useState(false);

    const moreRef = useRef<HTMLDivElement>(null);
    const searchRef = useRef<HTMLInputElement>(null);

    const isLogin = useMemo(()=> roles.length > 0, [roles]);

    const notFoundResult = useMemo(()=> {
        return !initLoading && !loading && data?.length === 0
    },[initLoading, loading, data]);

    const moreToggle = useMemo(() => {
        return !loading && !dynamicPage.isEndOfList && !dynamicPage.isVisible
    },[loading, dynamicPage]);

    const fetchDebounce = createDebounce(100);

    useEffect(()=>{
        const history = localStorage.getItem('searchHistory');
        if(history) setSearchHistory(JSON.parse(history));

        const viewNotice = localStorage.getItem('viewNotice');
        if(viewNotice) setViewNotice(JSON.parse(viewNotice));
    },[]);

    useEffect(() => {
        apiCall<string[]>({
            path: '/api/board-favorites',
            method: 'GET',
            isReturnData: true
        })
        .then(res => {
            if(res.length === 0) return;
            setFavorites(res);
        })
    },[])

    useEffect(() => {
        apiCall<Root.NoticeType[]>({
            path: '/api/board/notice',
            method: 'GET',
            isReturnData: true
        })
            .then(res => {
                if(!res) return;
                setNoticeList(res);
            })
    },[])

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

            const roles = res.headers['next.user.roles'] || ''

            if(roles) setRoles(JSON.parse(roles));

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


    const onSearchHandler = useCallback((init: boolean, keyword?: string) => {
        window.scrollTo({top: 0});
        const initPage = {page: 1, size: pageSize};

        if(init) {
            setSearchValue('')
            setSearchParams(initPage as Root.BoardListParamsI);
            return;
        }

        const regex = /[^a-zA-Z0-9ㄱ-ㅎ가-힣\s]/g;

        const value = keyword || searchValue.replace(regex, ' ') || '';

        const params = value === ''
        ? {...initPage} as Root.BoardListParamsI
        : {...searchParams, ...initPage, value, type: 'content'};

        setSearchParams(params);

        if(searchHistory.history.some(key => key === value) || value === '') return;
        localStorage.setItem('searchHistory', JSON.stringify({...searchHistory, history: [...searchHistory.history, value]}));
        setSearchHistory({...searchHistory, history: [...searchHistory.history, value]});

    },[searchParams, searchValue, searchHistory]);

    const onEnterHandler = useCallback((e: React.KeyboardEvent<HTMLInputElement>) => {
        if(e.key === 'Enter') {
            onSearchHandler(false);
        }
        if(e.key === 'Escape') {
            if(!searchRef?.current) return;

            setSearchValue('')
            searchRef.current.blur();
        }
    },[searchRef, searchValue]);

    const onChangeNotice = useCallback(() => {
        setViewNotice(!viewNotice);
        localStorage.setItem('viewNotice', JSON.stringify(!viewNotice));
    },[viewNotice]);

    useRootHotKey({searchRef})

    return (
        <SearchParamsProvider.Provider value={{
            searchParams, setSearchParams,
        }}>
            <div className={'p-5 flex flex-col gap-10'}
                 onClick={()=> {
                     setOnSearchHistory(false)
                     setSearchFocus(false)
                 }}
            >
                <div className={'sticky z-40 top-0 py-3 sm:px-10 md:px-20 lg:px-44 w-full flex flex-col rounded-full justify-center items-center gap-3'}>
                    <div className={[
                        'relative flex flex-col justify-center bg-white shadow-md duration-700 rounded-full',
                        searchFocus ? 'w-full sm:w-[70%]' : 'w-70 sm:w-[40%]',
                    ].join(' ')}>
                        <SearchBox {...{searchValue, setSearchValue, searchRef,
                            searchHistory, onSearchHandler, onEnterHandler,
                            searchFocus, setSearchFocus, onSearchHistory,
                            setOnSearchHistory
                        }} />
                        <SearchHistory {...{searchHistory, setSearchValue,
                            setSearchHistory, onSearchHistory,
                            setOnSearchHistory, onSearchHandler

                        }}/>

                    </div>
                    <SearchInfo />
                </div>

                <div className={'fixed z-30 sm:hidden bottom-5 right-5'}>
                    <button className={'w-14 h-14 p-5 rounded-full bg-white shadow-md active:bg-main active:text-white duration-300'}
                            onClick={()=> setMenuToggle(!menuToggle)}
                    >
                        <FontAwesomeIcon icon={faBars} className={'h-auto'} />
                    </button>
                    <MobileMenu {...{menuToggle, setMenuToggle, isLogin, searchParams, setSearchParams}} />
                </div>
                <div className={'flex flex-row justify-start sm:justify-center'}>
                    <div className={'hidden sm:block relative min-w-[300px]'}>
                        <LeftMenu {...{searchParams, setSearchParams, roles}}/>
                    </div>
                    <div className={'w-[600px] flex flex-col justify-start items-center'}>
                        <div className={'w-full flex flex-col gap-3'}>
                            <div className={'w-full p-2 flex justify-between items-center text-sm border-b border-solid border-gray-400'}>
                                <div className={'flex gap-1 items-center'}>
                                    <FontAwesomeIcon icon={faCaretRight}
                                                     className={['font-bold duration-500', viewNotice ? 'rotate-90' : 'rotate-0'].join(' ')}
                                                     size={'lg'}
                                    />
                                    <button className={'outline-0'}
                                            onClick={onChangeNotice}
                                    >
                                        공지사항
                                    </button>
                                </div>

                                <button className={'outline-0'}
                                        onClick={onChangeNotice}
                                >
                                    { viewNotice ? '접기' : '보기' }
                                </button>
                            </div>
                            <div className={['overflow-y-hidden duration-500',viewNotice ? 'max-h-80' : 'max-h-0'].join(' ')}>
                                <Notices data={noticeList} />
                            </div>
                        </div>

                        <div className={'w-full flex flex-wrap gap-2'}>
                            {
                                notFoundResult
                                && <div className={'text-center text-2xl w-full py-20 text-gray-600'}>검색 결과가 없습니다.</div>
                            }
                            <Virtuoso style={{width: '100%', height: '100%', overflow: 'hidden'}}
                                      totalCount={data.length}
                                      data={data}
                                      useWindowScroll
                                      itemContent={(index, data) =>
                                          <div className={'py-1.5'}>
                                              <BoardComponent key={'boardsummary' + index} {...{...data, favorites, isLogin, roles}} />
                                          </div>
                                      }
                            />
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
        </SearchParamsProvider.Provider>
    )
}

