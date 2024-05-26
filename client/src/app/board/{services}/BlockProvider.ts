import {createContext, Dispatch, SetStateAction} from "react";
import {BlockI} from "@/app/board/{services}/types";

export type BlockMenu = '' | 'openMenu' | 'openTextMenu' | 'openObjectMenu';

export interface BlockService {
    blockMenu: BlockMenu;
    block: BlockI;
    screenX: number;
    screenY: number;
}

export interface BlockProviderI {
    blockService: BlockService;
    setBlockService: Dispatch<SetStateAction<BlockService>>
}


const BlockProvider = createContext<BlockProviderI>({} as BlockProviderI);

export default BlockProvider;