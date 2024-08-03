import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {faXmark} from "@fortawesome/free-solid-svg-icons/faXmark";
import React, {Dispatch, SetStateAction} from "react";

const SearchHistory = ({
    searchHistory,
    setSearchValue,
    removeSearchHistory,
    onSearchHistory,
    setOnSearchHistory,
    onSearchHandler,
}: {
    searchHistory: string[];
    setSearchValue: Dispatch<SetStateAction<string>>;
    removeSearchHistory: (value: string) => void;
    onSearchHistory: boolean;
    setOnSearchHistory: Dispatch<SetStateAction<boolean>>;
    onSearchHandler: (init: boolean, keyword?: string) => void;
}) => {
    return (
        <div className={[
            'absolute top-6 z-20 w-full flex flex-col bg-white rounded-b-3xl shadow-md duration-700 overflow-y-hidden',
            onSearchHistory && searchHistory.length > 0 ? 'max-h-52' : 'max-h-0',
        ].join(' ')}
             onMouseLeave={()=> setOnSearchHistory(false)}
        >
            <ul className={'flex flex-col gap-1 bg-white'}>
                <div className={'h-6'} />
                {
                    searchHistory.map((keyword, index) => {
                        return (
                            <li key={'searchHistory' + index}
                                className={'w-full flex gap-2 text-xs px-2 h-7 items-center bg-white hover:bg-gray-300 duration-300'}
                            >
                                <button className={'w-full h-full flex items-center'}
                                        onClick={(e)=> {
                                            // e.stopPropagation();
                                            setSearchValue(keyword);
                                            onSearchHandler(false, keyword);
                                        }}
                                >
                                    {keyword}
                                </button>
                                <button className={'min-w-8 h-full flex justify-center items-center bg-gray-100 rounded-md'}
                                        onClick={(e) => {
                                            e.stopPropagation();
                                            removeSearchHistory(keyword);
                                        }}
                                >
                                    <FontAwesomeIcon icon={faXmark} />
                                </button>
                            </li>
                        )
                    })
                }
            </ul>
            <div className={'h-4 rounded-b-xl'} />
        </div>
    )
}

export default SearchHistory;