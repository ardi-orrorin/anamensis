import {createContext, Dispatch, SetStateAction} from "react";
import {Root} from "@/app/{services}/types";

export interface TempFileProviderI {
    searchParams    : Root.BoardListParamsI;
    setSearchParams : Dispatch<SetStateAction<Root.BoardListParamsI>>;
}

const SearchParamsProvider = createContext<TempFileProviderI>({} as TempFileProviderI);

export default SearchParamsProvider;
