import rootFunc from "@/app/{services}/funcs";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {faXmark} from "@fortawesome/free-solid-svg-icons/faXmark";
import React, {Dispatch, SetStateAction} from "react";
import {Root} from "@/app/{services}/types";

const RightMenu = ({
    searchHistory,
    setSearchValue,
    onSearchHandler,
    setSearchHistory,
}:{
    searchHistory      : Root.SearchHistoryProps;
    setSearchValue     : Dispatch<SetStateAction<string>>;
    setSearchHistory   : Dispatch<SetStateAction<Root.SearchHistoryProps>>;
    onSearchHandler    : (init: boolean, keyword?: string) => void;
}) => {
    return (
        <div className={'sticky z-30 top-4 mt-4 flex flex-col gap-6'}>
            <SearchHistory {...{searchHistory, setSearchValue, onSearchHandler, setSearchHistory}} />
        </div>
    );
}

const SearchHistory = ({
   searchHistory,
   setSearchValue,
   onSearchHandler,
   setSearchHistory,
}: {
    searchHistory      : Root.SearchHistoryProps;
    setSearchValue     : Dispatch<SetStateAction<string>>;
    setSearchHistory   : Dispatch<SetStateAction<Root.SearchHistoryProps>>;
    onSearchHandler    : (init: boolean, keyword?: string) => void;
}) => {
    return (
        <div className={'flex flex-col gap-2'}>
            <h4 className={'text-sm font-bold'}>최근 검색 내역</h4>
            <div className={'flex flex-wrap items-center gap-2'}>
                {
                    searchHistory.history.map((history, index) => {

                        return (
                            <button key={index}
                                    className={'px-2 py-1 text-xs text-blue-500 flex items-center gap-2 border rounded-full border-solid border-blue-400'}
                                    onClick={()=> {
                                        setSearchValue(history);
                                        onSearchHandler(false, history);
                                    }}
                            >
                                <button className={'h-full flex items-center'}
                                        onClick={()=>{
                                            rootFunc.removeSearchHistory({searchHistory, setSearchHistory, keyword: history});
                                        }}
                                >
                                    <FontAwesomeIcon icon={faXmark} className={'text-xs'} />
                                </button>
                                <span className={'h-full flex items-center'}>
                                        {history}
                                    </span>
                            </button>
                        )
                    })
                }
            </div>
        </div>
    )
}

export default React.memo(RightMenu, (prev, next) => {
    return prev.searchHistory === next.searchHistory;
});