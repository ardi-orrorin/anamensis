'use client';

import React, {useEffect, useState} from "react";
import {PageResponse} from "@/app/{commons}/types/commons";
import apiCall from "@/app/{commons}/func/api";
import BoardComponent, {BoardListI} from "@/app/{components}/boardComponent";
import {faMagnifyingGlass} from "@fortawesome/free-solid-svg-icons/faMagnifyingGlass";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import LeftMenu from "@/app/{components}/leftMenu";
import TopMenu from "@/app/{components}/topMenu";
import {RoleType} from "@/app/user/system/{services}/types";
import SearchParamsProvider, {BoardListParamsI} from "@/app/{services}/SearchParamsProvider";
import LoadingSpinner from "@/app/{commons}/LoadingSpinner";


type DynamicPage = {
    isEndOfList: boolean;
    isVisible  : boolean;
}

export default function Page() {

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
        size: 20,
    } as BoardListParamsI);

    useEffect(() => {
        setLoading(true);
        !searchParams.add && setData([]);
        const fetch = async() => await apiCall<PageResponse<BoardListI>, BoardListParamsI>({
            path: '/api/board',
            method: 'GET',
            params: searchParams
        })
        .then(res => {
            setLoading(false);
            setInitLoading(false);

            const roles = res.headers['next.user.roles'] || ''

            if(roles) setRoles(JSON.parse(roles));

            const condition = res.data.content.length === 0

            condition ? setDynamicPage({...dynamicPage, isEndOfList: true})
                : setDynamicPage({...dynamicPage, isVisible:false}) ;

            searchParams.add
             ? setData([...data, ...res.data.content])
             : setData(res.data.content);
        })

        fetch();
    },[searchParams])

    const onSearchHandler = () => {
        const initPage = {page: 1, size: 20};
        const params = searchValue === ''
        ? {...initPage} as BoardListParamsI
        : {...searchParams, ...initPage, value: searchValue, type: 'title'};


        setSearchParams(params);
    }

    const onEnterHandler = (e: React.KeyboardEvent<HTMLInputElement>) => {
        if(e.key === 'Enter') {
            onSearchHandler();
        }
    }

    const moreHandler = () => {
        setSearchParams({...searchParams, page: searchParams.page + 1, add: true});
    }

    return (
        <SearchParamsProvider.Provider value={{searchParams, setSearchParams}}>
            <div className={'p-5 flex flex-col gap-10'}>
                <div className={'px-4 sm:px-10 md:px-20 lg:px-44 w-full flex justify-center items-center gap-3'}>
                    <div className={['relative flex justify-center duration-700', searchFocus ? 'w-full sm:w-[70%]' : 'w-70 sm:w-[40%]'].join(' ')}>
                        <input className={'rounded-full outline-0 border-solid border-gray-200 border text-xs w-full h-10 py-3 pl-4 pr-16 focus:bg-blue-50 duration-500'}
                               placeholder={'검색어'}
                               value={searchValue || ''}
                               onChange={(e) => setSearchValue(e.target.value)}
                               onKeyUp={onEnterHandler}
                               onFocus={() => setSearchFocus(true)}
                                onBlur={() => setSearchFocus(false)}
                        />
                        <button className={'absolute right-2 top-1 border rounded-full py-1.5 px-3 hover:text-white hover:bg-blue-300 duration-500'} onClick={onSearchHandler}>
                            <FontAwesomeIcon icon={faMagnifyingGlass} className={'h-4 text-gray-400'}/>
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

                    <div className={'w-[850px] flex flex-wrap gap-5 justify-center items-center'}>
                        {
                            !initLoading
                            && !loading
                            && data?.length === 0
                            && <div className={'text-center text-2xl w-full py-20 text-gray-600'}>검색 결과가 없습니다.</div>
                        }
                        {
                            data
                            && data.map((item, index) => {
                                if(!item) return;
                                return (
                                    <BoardComponent key={'boardsummary' + index} {...item} />
                                )
                            })
                        }
                    </div>
                </div>
                <div>
                    <div className={'flex justify-center text-xs py-5'}>
                        {
                            loading
                            ? <LoadingSpinner size={20} />
                            : !dynamicPage.isEndOfList
                                && <button className={'border rounded-full py-2 px-6 hover:text-white hover:bg-blue-300 duration-500'}
                                           onClick={moreHandler}
                                >더보기</button>
                        }
                    </div>
                </div>
            </div>
        </SearchParamsProvider.Provider>
    )
}

