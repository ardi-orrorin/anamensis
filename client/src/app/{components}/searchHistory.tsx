import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {faXmark} from "@fortawesome/free-solid-svg-icons/faXmark";
import React, {Dispatch, SetStateAction, useContext, useEffect, useRef} from "react";
import {faMagnifyingGlass} from "@fortawesome/free-solid-svg-icons/faMagnifyingGlass";
import {SearchHistoryContext, useSearchHistory} from "@/app/{hooks}/searchHisotryHook";

const SearchHistory = ({
    setSearchValue,
    onSearchHistory,
    setOnSearchHistory,
    onSearchHandler,
}: {
    setSearchValue     : Dispatch<SetStateAction<string>>;
    onSearchHistory    : boolean;
    setOnSearchHistory : Dispatch<SetStateAction<boolean>>;
    onSearchHandler    : (init: boolean, keyword?: string) => void;
}) => {

    const timeout = useRef<NodeJS.Timeout>();

    const {searchHistory, removeSearchHistories, onChangeToggle } = useSearchHistory();

    useEffect(()=>{
        return () => {
            timeout.current
            && clearTimeout(timeout.current);
        }
    },[])

    return (
        <div className={[
             'absolute top-5 z-20 w-full flex flex-col bg-white rounded-b-3xl shadow-md duration-700 overflow-y-hidden',
             onSearchHistory && searchHistory?.history?.length > 0 ? 'max-h-80' : 'max-h-0',
        ].join(' ')}
            onMouseEnter={()=> {
                clearTimeout(timeout.current);
                setOnSearchHistory(true);
            }}
             onMouseLeave={()=> {
                timeout.current = setTimeout(() => {
                    setOnSearchHistory(false);
                }, 500);
             }}
        >
            <div className={'min-h-6'} />
            <ul className={'flex flex-col gap-1 bg-white overflow-y-auto'}
                data-testid={'search-history-container'}
            >
                {
                    searchHistory.toggle
                    && searchHistory.history?.map((keyword, index) => {
                        return (
                            <li key={'searchHistory' + index}
                                className={'w-full flex gap-2 text-xs px-2 min-h-10 max-h-10 items-center bg-white hover:bg-gray-300 duration-300'}
                            >
                                <FontAwesomeIcon icon={faMagnifyingGlass} />

                                <button className={'w-full h-auto flex items-center'}
                                        onClick={(e)=> {
                                            setSearchValue(keyword);
                                            onSearchHandler(false, keyword);
                                        }}
                                >
                                    {keyword}
                                </button>
                                <button className={'min-w-10 h-6 flex justify-center items-center bg-gray-100 rounded-md'}
                                        onClick={(e) => {
                                            e.stopPropagation();
                                            removeSearchHistories(keyword);
                                        }}
                                >
                                    <FontAwesomeIcon icon={faXmark} />
                                </button>
                            </li>
                        )
                    })
                }
            </ul>
            <div className={'flex justify-between h-10 p-2'}>
                <div className="w-full py-2 inline-flex items-center cursor-pointer text-xs gap-2">
                    <input type="checkbox"
                           className={"sr-only peer hidden"}
                           checked={searchHistory.toggle}
                    />
                    <div className="relative w-11 h-6 ray-200 peer-focus:outline-none peer-focus:ring-4
                                    peer-focus:ring-blue-300 dark:peer-focus:ring-blue-800 rounded-full peer dark:bg-gray-300
                                    peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full
                                    peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:start-[2px]
                                    after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5
                                    after:transition-all dark:border-gray-400 peer-checked:bg-main"
                         onClick={(e)=> {
                            e.stopPropagation();
                            onChangeToggle();
                         }}
                    />
                    <button onClick={e =>{
                                e.stopPropagation();
                                onChangeToggle();
                            }}
                            data-testid={'search-hisotry-toggle'}
                    >
                        검색 기록
                    </button>
                </div>
                {
                    searchHistory.toggle
                    && <button className={'w-20 h-7 text-xs bg-white rounded hover:bg-gray-300 duration-300'}
                               onClick={() => removeSearchHistories()}
                    >
                        전체삭제
                    </button>
                }
            </div>
            <div className={'h-4 rounded-b-xl'}/>
        </div>
    )
}

export default React.memo(SearchHistory, (prev, next) => {
    return prev.onSearchHistory === next.onSearchHistory;
});
