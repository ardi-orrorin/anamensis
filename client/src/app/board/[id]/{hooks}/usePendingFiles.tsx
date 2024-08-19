import {createContext, Dispatch, SetStateAction, useCallback, useContext, useState} from "react";
import apiCall from "@/app/{commons}/func/api";

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
    deleteDummyFiles: () => void;
    deleteImage: (absolutePath: string) => void;
}

const TempFileContext = createContext<TempFileProviderI>({} as TempFileProviderI);

export const TempFileProvider = ({
    children
}: {
    children: React.ReactNode;
}) => {
    const [waitUploadFiles, setWaitUploadFiles] = useState<TempFileI[]>([]);
    const [waitRemoveFiles, setWaitRemoveFiles] = useState<TempFileI[]>([]);

    const deleteDummyFiles = useCallback(async () =>  {
        waitUploadFiles.forEach(file => {
            const fileUri = file.filePath + file.fileName;
            apiCall({
                path: '/api/file/delete/filename',
                method: 'PUT',
                body: {fileUri},
                isReturnData: true
            });
        })
    },[waitUploadFiles]);

    const deleteImage = useCallback((absolutePath: string) => {
        const fileName = absolutePath.substring(absolutePath.lastIndexOf('/') + 1);
        const filePath = absolutePath.substring(0, absolutePath.lastIndexOf('/') + 1);

        setWaitUploadFiles(prevState => {
            return prevState.filter(item => item.fileName !== fileName);
        });

        setWaitRemoveFiles(prevState => {
            return [...prevState, {id: 0, fileName, filePath}];
        });
    },[waitUploadFiles, waitRemoveFiles]);

    return (
        <TempFileContext.Provider value={{
            waitUploadFiles  , setWaitUploadFiles,
            waitRemoveFiles  , setWaitRemoveFiles ,
            deleteDummyFiles , deleteImage
        }}>
            {children}
        </TempFileContext.Provider>
    )
}


export const usePendingFiles = () => {
    const context = useContext(TempFileContext);
    if (!context) {
        throw new Error('usePendingFiles must be used within a TempFileProvider');
    }
    return context;
}
