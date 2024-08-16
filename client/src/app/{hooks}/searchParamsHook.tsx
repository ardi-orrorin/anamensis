'use client';
import React, {createContext, Dispatch, RefObject, SetStateAction, useCallback, useContext, useState} from "react";
import {Root} from "@/app/{services}/types";

export interface SearchParamsProviderI {
    searchParams       : Root.BoardListParamsI;
    setSearchParams    : Dispatch<SetStateAction<Root.BoardListParamsI>>;
    searchValue        : string;
    setSearchValue     : Dispatch<SetStateAction<string>>;
    searchFocus        : boolean;
    setSearchFocus     : Dispatch<SetStateAction<boolean>>;
    onSearchHistory    : boolean;
    setOnSearchHistory : Dispatch<SetStateAction<boolean>>;
    onSearchHandler    : (props: onSearchHandlerParams) => void;
    onEnterHandler     : (props: onEnterHandlerParams) => void;
}

type onSearchHandlerParams = {init: boolean, keyword?: string, setHistories?: (keyword: string) => void};
type onEnterHandlerParams = {event: React.KeyboardEvent<HTMLInputElement>, searchRef: RefObject<HTMLDivElement>, setHistories?: (keyword: string) => void};
export const SearchParamsContext = createContext<SearchParamsProviderI>({} as SearchParamsProviderI);

export const SearchParamsProvider = ({children}: {children: React.ReactNode}) => {
    const pageSize = 20;

    const [searchParams, setSearchParams] = useState<Root.BoardListParamsI>({
        page: 1,
        size: pageSize,
    } as Root.BoardListParamsI);

    const [searchValue, setSearchValue] = useState('');
    const [searchFocus, setSearchFocus] = useState(false);
    const [onSearchHistory, setOnSearchHistory] = useState(false);

    const onSearchHandler = useCallback((props: onSearchHandlerParams) => {
        const {init, keyword, setHistories} = props;
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

        setHistories && setHistories(value);

    },[searchParams, searchValue]);

    const onEnterHandler = useCallback((props: onEnterHandlerParams) => {
        const {event, searchRef, setHistories} = props;

        if(event.key === 'Enter') {
            onSearchHandler({init: false, setHistories});
        }
        if(event.key === 'Escape') {
            if(!searchRef?.current) return;

            setSearchValue('')
            searchRef.current.blur();
        }
    },[searchValue]);

    return (
        <SearchParamsContext.Provider value={{
            searchParams, setSearchParams,
            searchValue, setSearchValue,
            searchFocus, setSearchFocus,
            onSearchHistory, setOnSearchHistory,
            onSearchHandler, onEnterHandler
        }}>
            {children}
        </SearchParamsContext.Provider>
    )
}

export const useCusSearchParams = () => {
    const context = useContext(SearchParamsContext);
    if(!context) throw new Error('useSearchParams must be used within a SearchParamsProvider');
    return context;
}