import {createContext, Dispatch, SetStateAction} from "react";

type BlockMenu = '' | 'openMenu' | 'openTextMenu';

export interface BlockService {
    blockMenu: BlockMenu;
    seq: number;
}

export interface BlockProviderI {
    blockService: BlockService;
    setBlockService: Dispatch<SetStateAction<BlockService>>
}


const BlockProvider = createContext<BlockProviderI>({} as BlockProviderI);

export default BlockProvider;