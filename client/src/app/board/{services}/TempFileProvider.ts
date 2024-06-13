import {createContext, Dispatch, SetStateAction} from "react";

export interface TempFileI {
    id: number;
    fileName: string;
    filePath: string;
}

export interface TempFileProviderI {
    waitUploadFiles: TempFileI[];
    setWaitUploadFiles: Dispatch<SetStateAction<TempFileI[]>>
    waitRemoveFiles: TempFileI[];
    setWaitRemoveFiles: Dispatch<SetStateAction<TempFileI[]>>
}

const TempFileProvider = createContext<TempFileProviderI>({} as TempFileProviderI);

export default TempFileProvider;
