import {createContext, Dispatch, SetStateAction} from "react";

export interface TempFileI {
    id: number;
    fileName: string;
    filePath: string;
}

export interface TempFileProviderI {
    tempFiles: TempFileI[];
    setTempFiles: Dispatch<SetStateAction<TempFileI[]>>
}

const TempFileProvider = createContext<TempFileProviderI>({} as TempFileProviderI);

export default TempFileProvider;
