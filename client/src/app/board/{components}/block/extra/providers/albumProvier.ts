import {createContext, Dispatch, SetStateAction} from "react";

export type AlbumToggleType = {
    viewImage: string;
    viewToggle: boolean;
}

export type AlbumTypeContext = {
    albumToggle: AlbumToggleType;
    setAlbumToggle: Dispatch<SetStateAction<AlbumToggleType>>
}

const AlbumProvider = createContext({} as AlbumTypeContext);

export default AlbumProvider;