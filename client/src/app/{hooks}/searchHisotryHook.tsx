'use client';
import {createContext, useCallback, useContext, useEffect, useState} from "react";
import {Root} from "@/app/{services}/types";

interface SearchHistoryProviderI {
    searchHistory   : Root.SearchHistoryProps;
    setHistories    : (keyword: string) => void;
    removeSearchHistories: (keyword?: string) => void;
    onChangeToggle  : () => void;
}

export const SearchHistoryContext = createContext<SearchHistoryProviderI>({} as SearchHistoryProviderI);

export const SearchHistoryProvider = ({children}: {children: React.ReactNode}) => {
    const [searchHistory, setSearchHistory] = useState<Root.SearchHistoryProps>({
        toggle: true,
        history: []
    });

    if(typeof window === 'undefined') <></> ;

    useEffect(() => {
        const history = localStorage.getItem('searchHistory');
        if (history) setSearchHistory(JSON.parse(history));
    }, []);

    const setHistories = useCallback((keyword: string) => {
        if (searchHistory.history.some(key => key === keyword) || keyword === '') return;

        const newHistory = [...searchHistory.history, keyword];

        const value = {...searchHistory, history: newHistory};
        setValue(value);
    }, [searchHistory]);

    const removeSearchHistories = useCallback((keyword?: string) => {
        if (!keyword) return setSearchHistory({...searchHistory, history: []});
        const newHistory = searchHistory?.history.filter(key => key !== keyword);
        const value = {...searchHistory, history: newHistory};
        setValue(value);
    }, [searchHistory]);

    const onChangeToggle = useCallback(() => {
        const value = {...searchHistory, toggle: !searchHistory.toggle};
        setValue(value);
    }, [searchHistory]);

    const setValue = useCallback((value: Root.SearchHistoryProps)=>{
        setSearchHistory(value);
        localStorage.setItem('searchHistory', JSON.stringify(value));
    },[searchHistory])

    return (
        <SearchHistoryContext.Provider value={{
            searchHistory, setHistories,
            removeSearchHistories, onChangeToggle
        }}>
            {children}
        </SearchHistoryContext.Provider>
    )
}

export const useSearchHistory = () => {
    const context = useContext(SearchHistoryContext);

    if (!context) throw new Error('useSearchHistory must be used within a SearchHistoryProvider');
    return context;
}