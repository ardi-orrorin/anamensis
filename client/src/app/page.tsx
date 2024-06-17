'use client';

import {useEffect, useRef, useState} from "react";
import {PageResponse} from "@/app/{commons}/types/commons";
import apiCall from "@/app/{commons}/func/api";
import {createDebounce} from "@/app/{commons}/func/debounce";
import BoardComponent, {BoardListI} from "@/app/{components}/boardComponent";
import {faMagnifyingGlass} from "@fortawesome/free-solid-svg-icons/faMagnifyingGlass";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import LoadingSpinner from "@/app/{commons}/LoadingSpinner";
import LeftMenu from "@/app/{components}/leftMenu";
import TopMenu from "@/app/{components}/topMenu";
import useSWR from "swr";

export type BoardListParams = {
    page       : number;
    size       : number;
    type       : string;
    value      : string;
    categoryPk : string;
}

type DynamicPage = {
    isEndOfList: boolean;
    isVisible  : boolean;
}

export default function Page() {

    const [data, setData] = useState<PageResponse<BoardListI>>({} as PageResponse<BoardListI>);
    const footerRef = useRef<HTMLDivElement>(null);
    const [searchValue, setSearchValue] = useState('');
    const [searchFocus, setSearchFocus] = useState(false);
    const [dynamicPage, setDynamicPage] = useState<DynamicPage>({
        isEndOfList: false,
        isVisible  : false,
    });

    const [searchParams, setSearchParams] = useState<BoardListParams>({
        page: 1,
        size: 20,
        type: 'title',
    } as BoardListParams);

    const fetchDebounce = createDebounce(500);
    const initFetch = useSWR('/', async () => {
        await apiCall<PageResponse<BoardListI>, BoardListParams>({
            path: '/api/board',
            method: 'GET',
            params: searchParams,
            isReturnData: true,
        })
        .then(res => {
            if(res.content.length === 0) {
                setDynamicPage({ isEndOfList: true, isVisible: false});
            }

            setData(res);
            setDynamicPage({ isEndOfList: false, isVisible: false});
            setSearchParams({...searchParams, page: searchParams.page + 1});
        })
    },{
        revalidateOnFocus: false
    });

    useEffect(() => {
        if(!footerRef.current) return;

        const observer = new IntersectionObserver((entries) => {
            if(entries[0].isIntersecting) {
                if(dynamicPage.isVisible) return;
                setDynamicPage({...dynamicPage, isVisible: true});
            }
        });
        observer.observe(footerRef.current);

        return () => observer.disconnect();
    });

    useEffect(() => {
        if(!dynamicPage.isVisible) return;

        fetchDebounce( () => fetchApi(searchParams, true));
    }, [dynamicPage.isVisible])

    const fetchApi = async (searchParams: BoardListParams, isAdd: boolean) => {
        if(!data?.content) return;
        await apiCall<PageResponse<BoardListI>, BoardListParams>({
            path: '/api/board',
            method: 'GET',
            params: searchParams,
            isReturnData: true,
        }).then(res => {
            const isEndOfList = res.content.length === 0;
            const isVisible = false;

            isAdd ? setData({...data, content: [...data.content, ...res.content]})
                  : setData(res);

            setDynamicPage({...dynamicPage, isVisible, isEndOfList});
            setSearchParams({...searchParams, page: searchParams.page + 1});
            setSearchValue('');
        });
    }

    const onSearchHandler = () => {
        const initPage = {page: 1, size: 20};
        const params = searchValue === ''
        ? {...initPage} as BoardListParams
        : {...searchParams, ...initPage, value: searchValue, type: 'title'};


        setSearchParams(params);
        fetchDebounce( () => fetchApi(params, false));
    }

    const onEnterHandler = (e: React.KeyboardEvent<HTMLInputElement>) => {
        if(e.key === 'Enter') {
            onSearchHandler();
        }
    }

    const categorySelectHandler = async (categoryPk: string) => {
        const params = {type: 'categoryPk', value: categoryPk, page: 1, size: 10} as BoardListParams;
        setSearchParams(params);
        await fetchApi(params, false);
    }

    if(initFetch.error) return <div>error</div>

    return (
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
                <TopMenu select={categorySelectHandler}
                         searchParams={searchParams}
                />
            </div>
            <div className={'flex flex-row justify-start sm:justify-center'}>
                <div className={'hidden sm:block relative min-w-[300px]'}>
                    <LeftMenu select={categorySelectHandler}
                              searchParams={searchParams}
                    />
                </div>

                <div className={'w-[850px] flex flex-wrap gap-5 justify-center items-center'}>
                    {
                        data?.content
                        && data.content.length === 0
                        && <div className={'text-center text-2xl w-full py-20 text-gray-600'}>검색 결과가 없습니다.</div>
                    }
                    {
                        data?.content
                        && data.content.map((item, index) => {
                            return (
                                <BoardComponent key={'boardsummary' + index} {...item} />
                            )
                        })
                    }
                </div>
            </div>
            {
                dynamicPage.isEndOfList
                    ? <></>
                    : dynamicPage.isVisible
                        ? <div className={'flex justify-center h-20'}><LoadingSpinner size={50} /></div>
                        : <div ref={footerRef} className={'h-2'} />
            }
        </div>

    )
}

