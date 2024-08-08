import {createContext, Dispatch, SetStateAction} from "react";

export interface BoardListParamsI {
    page        : number;
    size        : number;
    type?       : string;
    value?      : string;
    categoryPk? : string;
    isSelf      : boolean;
    add         : boolean;
    isFavorite  : boolean;
    [key: string]: string | number | undefined | boolean;
}

export interface TempFileProviderI {
    searchParams: BoardListParamsI;
    setSearchParams: Dispatch<SetStateAction<BoardListParamsI>>;
}

const SearchParamsProvider = createContext<TempFileProviderI>({} as TempFileProviderI);

export default SearchParamsProvider;
