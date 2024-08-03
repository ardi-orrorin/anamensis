'use client';

import React, {useCallback, useEffect, useMemo, useRef, useState} from "react";
import {PageResponse} from "@/app/{commons}/types/commons";
import apiCall from "@/app/{commons}/func/api";
import BoardComponent, {BoardListI} from "@/app/{components}/boardComponent";
import {faMagnifyingGlass} from "@fortawesome/free-solid-svg-icons/faMagnifyingGlass";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import LeftMenu from "@/app/{components}/leftMenu";
import MobileMenu from "@/app/{components}/mobileMenu";
import {RoleType} from "@/app/user/system/{services}/types";
import SearchParamsProvider, {BoardListParamsI} from "@/app/{services}/SearchParamsProvider";
import {faXmark} from "@fortawesome/free-solid-svg-icons/faXmark";
import {createDebounce} from "@/app/{commons}/func/debounce";
import {useRootHotKey} from "@/app/{hooks}/hotKey";
import Notices, {NoticeType} from "@/app/{components}/boards/notices";
import SearchInfo from "@/app/{components}/searchInfo";
import {faBars} from "@fortawesome/free-solid-svg-icons";
import {Virtuoso} from "react-virtuoso";
import RightSubMenu from "@/app/{components}/rightSubMenu";
import SearchHistory from "@/app/{components}/searchHistory";

export type DynamicPage = {
    isEndOfList: boolean;
    isVisible  : boolean;
}

export default function Page() {

    const pageSize = 20;
    const [initLoading, setInitLoading] = useState(true);
    const [loading, setLoading] = useState(false);
    const [data, setData] = useState<BoardListI[]>([]);
    const [roles, setRoles] = useState<RoleType[]>([]);
    const [searchValue, setSearchValue] = useState('');
    const [searchFocus, setSearchFocus] = useState(false);
    const [dynamicPage, setDynamicPage] = useState<DynamicPage>({
        isEndOfList: false,
        isVisible  : false,
    });
    const [menuToggle, setMenuToggle] = useState(false);

    const [favorites, setFavorites] = useState<string[]>([]);

    const [searchParams, setSearchParams] = useState<BoardListParamsI>({
        page: 1,
        size: pageSize,
    } as BoardListParamsI);

    const [noticeList, setNoticeList] = useState<NoticeType[]>([]);
    const [searchHistory, setSearchHistory] = useState<string[]>([]);
    const [onSearchHistory, setOnSearchHistory] = useState(false);

    const isLogin = useMemo(()=> roles.length > 0, [roles]);

    const moreRef = React.useRef<HTMLDivElement>(null);
    const searchRef = useRef<HTMLInputElement>(null);

    const fetchDebounce = createDebounce(100);

    useEffect(()=>{
        const history = localStorage.getItem('searchHistory');
        if(history) setSearchHistory(JSON.parse(history));
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
        apiCall<NoticeType[]>({
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
        apiCall<PageResponse<BoardListI>, BoardListParamsI>({
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
            setSearchParams(initPage as BoardListParamsI);
            return;
        }

        const regex = /[^a-zA-Z0-9ㄱ-ㅎ가-힣\s]/g;

        const value = keyword || searchValue.replace(regex, ' ') || '';

        const params = value === ''
        ? {...initPage} as BoardListParamsI
        : {...searchParams, ...initPage, value, type: 'content'};

        console.log(params)

        setSearchParams(params);

        if(searchHistory.some(key => key === value) || value === '') return;
        localStorage.setItem('searchHistory', JSON.stringify([...searchHistory, value]));
        setSearchHistory([...searchHistory, value]);

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

    const removeSearchHistory = (keyword: string) => {
        const newHistory = searchHistory.filter(key => key !== keyword);
        setSearchHistory(newHistory);
        localStorage.setItem('searchHistory', JSON.stringify(newHistory));
    }

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
                        <input className={'z-40 rounded-full outline-0 border-solid border-gray-200 border-2 text-xs w-full h-10 py-3 pl-4 pr-20 focus:border-gray-500 focus:border duration-500 bg-white'}
                               ref={searchRef}
                               placeholder={'검색어'}
                               value={searchValue || ''}
                               onClick={e=> e.stopPropagation()}
                               onChange={(e) => setSearchValue(e.target.value)}
                               onKeyUp={onEnterHandler}
                               onFocus={() => {
                                   setSearchFocus(true)
                                   if(searchHistory.length === 0) return;
                                   setOnSearchHistory(true)
                               }}
                               onMouseEnter={(e) => {
                                   e.stopPropagation();
                                   e.preventDefault();
                                   if(!searchFocus) return;
                                   if(searchHistory.length === 0) return;
                                   setOnSearchHistory(true)
                               }}
                               onBlur={() => {
                                   if(onSearchHistory) return;
                                   setSearchFocus(false)
                               }}
                        />
                        {
                            searchValue.length > 0
                            && <button className={'absolute z-50 right-12 top-1 duration-500'}
                                       onClick={()=> onSearchHandler(true)}
                          >
                            <FontAwesomeIcon className={'h-4 py-1.5 px-2 text-gray-400 hover:text-red-300 duration-300'}
                                             icon={faXmark}
                            />
                          </button>
                        }
                        <button className={'absolute z-50 right-2 top-1 duration-500'}
                                onClick={()=> onSearchHandler(false)}
                        >
                            <FontAwesomeIcon className={'h-4 py-1.5 px-2 text-gray-400 hover:text-blue-300 duration-300'}
                                             icon={faMagnifyingGlass}
                            />
                        </button>
                        <SearchHistory {...{searchHistory, setSearchValue, removeSearchHistory, onSearchHistory, setOnSearchHistory, onSearchHandler}} />

                    </div>
                    <SearchInfo />
                </div>

                <div className={'fixed z-30 sm:hidden bottom-5 right-5'}>
                    <button className={'w-14 h-14 p-5 rounded-full bg-white shadow-md active:bg-main active:text-white duration-300'}
                            onClick={()=> setMenuToggle(!menuToggle)}
                    >
                        <FontAwesomeIcon icon={faBars} className={'h-auto'} />
                    </button>
                    <MobileMenu {...{menuToggle, setMenuToggle, isLogin}} />

                </div>
                <div className={'flex flex-row justify-start sm:justify-center'}>
                    <div className={'hidden sm:block relative min-w-[300px]'}>
                        <LeftMenu roles={roles}/>
                    </div>
                    <div className={'w-[600px] flex flex-col gap-5 justify-start items-center'}>
                        <div className={'w-full'}>
                            <Notices data={noticeList} />
                        </div>
                        <div className={'w-full flex flex-wrap gap-2'}>
                            {
                                !initLoading
                                && !loading
                                && data?.length === 0
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
                            !loading
                            && !dynamicPage.isEndOfList
                            && !dynamicPage.isVisible
                            && <div ref={moreRef} className={'w-10 h-10'} />
                        }
                    </div>
                </div>
                <RightSubMenu {...{isLogin}} />
            </div>
        </SearchParamsProvider.Provider>
    )
}

