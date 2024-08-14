import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {faXmark} from "@fortawesome/free-solid-svg-icons/faXmark";
import {faMagnifyingGlass} from "@fortawesome/free-solid-svg-icons/faMagnifyingGlass";
import React from "react";
import {Root} from "@/app/{services}/types";

const SearchBox = (props: Root.SearchBoxProps) => {
    const {
        searchValue,
        setSearchValue,
        searchRef,
        searchHistory,
        onSearchHandler,
        onEnterHandler,
        searchFocus,
        setSearchFocus,
        onSearchHistory,
        setOnSearchHistory,
    } = props;

    return (
        <>
            <input className={'z-40 rounded-full outline-0 border-solid border-gray-100 border text-xs w-full h-10 py-3 pl-4 pr-20 focus:border-gray-500 focus:border focus:shadow-sm duration-500 bg-white'}
                   ref={searchRef}
                   placeholder={'검색어'}
                   value={searchValue || ''}
                   onClick={e=> e.stopPropagation()}
                   onChange={(e) => setSearchValue(e.target.value)}
                   data-testid={'search-input'}
                   onKeyUp={onEnterHandler}
                   onFocus={() => {
                       setSearchFocus(true)
                       if(searchHistory.history?.length === 0) return;
                       setOnSearchHistory(true)
                   }}
                   onMouseEnter={(e) => {
                       e.stopPropagation();
                       e.preventDefault();
                       if(!searchFocus) return;
                       if(searchHistory.history?.length === 0) return;
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
                           data-testid={'search-init'}
              >
                <FontAwesomeIcon className={'h-4 py-1.5 px-2 text-gray-400 hover:text-red-300 duration-300'}
                                 icon={faXmark}
                />
              </button>
            }
            <button className={'absolute z-50 right-2 top-1 duration-500'}
                    onClick={()=> onSearchHandler(false)}
                    data-testid={'search'}
            >
                <FontAwesomeIcon className={'h-4 py-1.5 px-2 text-gray-400 hover:text-blue-300 duration-300'}
                                 icon={faMagnifyingGlass}
                />
            </button>
        </>
    );
}

export default React.memo(SearchBox, (prev, next) => {
    return prev.searchValue     === next.searchValue
        && prev.searchFocus     === next.searchFocus
        && prev.onSearchHistory === next.onSearchHistory
        && prev.searchHistory   === next.searchHistory;
});