'use client';

import {useEffect, useRef, useState} from "react";
import {PageResponse} from "@/app/{commons}/types/commons";
import apiCall from "@/app/{commons}/func/api";
import {createDebounce} from "@/app/{commons}/func/debounce";
import GlobalLoadingSpinner from "@/app/{commons}/GlobalLoadingSpinner";
import BoardComponent, {BoardListI} from "@/app/{components}/boardComponent";
import {faMagnifyingGlass} from "@fortawesome/free-solid-svg-icons/faMagnifyingGlass";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import LoadingSpinner from "@/app/{commons}/LoadingSpinner";
import {linkGc} from "next/dist/client/app-link-gc";


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
        size: 10,
        type: 'title',
    } as BoardListParams);

    const addDebounce = createDebounce(2000);
    const fetchDebounce = createDebounce(500);

    useEffect(() => {
         const fetch = async () => {
            await apiCall<PageResponse<BoardListI>, BoardListParams>({
                path: '/api/board',
                method: 'GET',
                params: searchParams,
                isReturnData: true,
            }).then(res => {
                if(res.content.length === 0) {
                    setDynamicPage({ isEndOfList: true, isVisible: false});
                }

                setData(res);
                setDynamicPage({ isEndOfList: false, isVisible: false});
            });
        }

        const debounce = createDebounce(500);
        debounce(fetch);

    },[]);

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

        const params = {...searchParams, page: searchParams.page + 1};
        fetchDebounce( () => fetchApi(params, true));

    }, [dynamicPage.isVisible])

    const fetchApi = async (searchParams: BoardListParams, isAdd: boolean) => {
        if(!data.content) return;
        await apiCall<PageResponse<BoardListI>, BoardListParams>({
            path: '/api/board',
            method: 'GET',
            params: searchParams,
            isReturnData: true,
        }).then(res => {
            isAdd
            ? setData({...data, content: [...data.content, ...res.content]})
            : setData(res);

            const isEndOfList = res.content.length === 0;
            const isVisible = false;

            setDynamicPage({...dynamicPage, isVisible, isEndOfList});
        });
    }

    const onSearchHandler = () => {
        const initPage = {page: 1, size: 10};
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

    return (
        <div className={'p-5 flex flex-col gap-10'}>
            <div className={'px-4 sm:px-10 md:px-20 lg:px-44 w-full flex justify-center items-center gap-3'}>
                <div className={['relative flex justify-center duration-1000', searchFocus ? 'w-[50%]' : 'w-60'].join(' ')}>
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
            <div className={'flex flex-wrap gap-5 justify-center px-36'}>
                {
                    data.content
                    && data.content.length === 0
                    && <div className={'text-center text-2xl w-full py-20 text-gray-600'}>검색 결과가 없습니다.</div>
                }
                {
                    data.content
                    && data.content.map((item, index) => {
                        return (
                            <BoardComponent key={'boardsummary' + index} {...item} />
                        )
                    })
                }
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
