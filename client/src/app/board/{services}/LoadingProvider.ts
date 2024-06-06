import {createContext, Dispatch, SetStateAction} from "react";


export interface LoadingProviderI {
    loading: boolean;
    setLoading: Dispatch<SetStateAction<boolean>>;
    commentLoading: boolean;
    setCommentLoading: Dispatch<SetStateAction<boolean>>;
}

const LoadingProvider = createContext<LoadingProviderI>({} as LoadingProviderI);

export default LoadingProvider;
