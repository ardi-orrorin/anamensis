import {createContext, Dispatch, SetStateAction} from "react";

export type BlockMenu = '' | 'openMenu' | 'openTextMenu' | 'openObjectMenu';

export interface BlockService {
    blockMenu: BlockMenu;
    seq: number;
    screenX: number;
    screenY: number;
}

export interface BlockProviderI {
    blockService: BlockService;
    setBlockService: Dispatch<SetStateAction<BlockService>>
}


const BlockProvider = createContext<BlockProviderI>({} as BlockProviderI);

export default BlockProvider;