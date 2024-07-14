'use client';

import React, {useEffect, useRef, useState} from "react";
import {PageResponse} from "@/app/{commons}/types/commons";
import apiCall from "@/app/{commons}/func/api";
import BoardComponent, {BoardListI} from "@/app/{components}/boardComponent";
import {faMagnifyingGlass} from "@fortawesome/free-solid-svg-icons/faMagnifyingGlass";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import LeftMenu from "@/app/{components}/leftMenu";
import TopMenu from "@/app/{components}/topMenu";
import {RoleType} from "@/app/user/system/{services}/types";
import SearchParamsProvider, {BoardListParamsI} from "@/app/{services}/SearchParamsProvider";
import {faXmark} from "@fortawesome/free-solid-svg-icons/faXmark";
import {createDebounce} from "@/app/{commons}/func/debounce";
import {useRootHotKey} from "@/app/{hooks}/hotKey";
import Notices, {NoticeType} from "@/app/{components}/boards/notices";

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

    const [searchParams, setSearchParams] = useState<BoardListParamsI>({
        page: 1,
        size: pageSize,
    } as BoardListParamsI);

    const [noticeList, setNoticeList] = useState<NoticeType[]>([]);

    const moreRef = React.useRef<HTMLDivElement>(null);
    const searchRef = useRef<HTMLInputElement>(null);

    const fetchDebounce = createDebounce(100);

    useEffect(()=> {
        apiCall<NoticeType[]>({
            path: '/api/board/notice',
            method: 'GET',
            isReturnData: true
        })
        .then(res => {
            if(!res) return;
            setNoticeList(res);
        })
    },[]);

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


    const onSearchHandler = (init: boolean) => {
        const initPage = {page: 1, size: pageSize};

        if(init) {
            setSearchValue('')
            setSearchParams(initPage as BoardListParamsI);
            return;
        }

        const params = searchValue === ''
        ? {...initPage} as BoardListParamsI
        : {...searchParams, ...initPage, value: searchValue, type: 'content'};

        setSearchParams(params);
    }

    const onEnterHandler = (e: React.KeyboardEvent<HTMLInputElement>) => {
        if(e.key === 'Enter') {
            onSearchHandler(false);
        }
        if(e.key === 'Escape') {
            if(!searchRef?.current) return;

            setSearchValue('')
            searchRef.current.blur();
        }
    }

    useRootHotKey({searchRef});

    return (
        <SearchParamsProvider.Provider value={{
            searchParams, setSearchParams,
        }}>
            <div className={'p-5 flex flex-col gap-10'}>
                <div className={'px-4 sm:px-10 md:px-20 lg:px-44 w-full flex justify-center items-center gap-3'}>
                    <div className={['relative flex justify-center duration-700', searchFocus ? 'w-full sm:w-[70%]' : 'w-70 sm:w-[40%]'].join(' ')}>
                        <input className={'rounded-full outline-0 border-solid border-gray-200 border text-xs w-full h-10 py-3 pl-4 pr-20 focus:bg-blue-50 duration-500'}
                               ref={searchRef}
                               placeholder={'검색어'}
                               value={searchValue || ''}
                               onChange={(e) => setSearchValue(e.target.value)}
                               onKeyUp={onEnterHandler}
                               onFocus={() => setSearchFocus(true)}
                               onBlur={() => setSearchFocus(false)}
                        />
                        {
                            searchValue.length > 0
                            && <button className={'absolute right-12 top-1 duration-500'}
                                       onClick={()=> onSearchHandler(true)}
                          >
                            <FontAwesomeIcon className={'h-4 py-1.5 px-2 text-gray-400 hover:text-red-300 duration-300'}
                                             icon={faXmark}
                            />
                          </button>
                        }
                        <button className={'absolute right-2 top-1 duration-500'}
                                onClick={()=> onSearchHandler(false)}
                        >
                            <FontAwesomeIcon className={'h-4 py-1.5 px-2 text-gray-400 hover:text-blue-300 duration-300'}
                                             icon={faMagnifyingGlass}
                            />
                        </button>
                    </div>
                </div>
                <div className={'flex sm:hidden justify-center'}>
                    <TopMenu />
                </div>
                <div className={'flex flex-row justify-start sm:justify-center'}>
                    <div className={'hidden sm:block relative min-w-[300px]'}>
                        <LeftMenu roles={roles}
                        />
                    </div>
                    <div className={'w-[850px] flex flex-col gap-5 justify-start items-center'}>
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

                            {
                                data
                                && data?.length > 0
                                && data.map((item, index) => {
                                    if(!item) return;
                                    return (
                                        <BoardComponent key={'boardsummary' + index} {...item} />
                                    )
                                })
                            }
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
            </div>
        </SearchParamsProvider.Provider>
    )
}

