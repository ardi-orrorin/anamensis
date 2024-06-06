import {createContext, Dispatch, SetStateAction} from "react";
import {BlockI, CommentI} from "@/app/board/{services}/types";

export type BlockMenu = '' | 'openMenu' | 'openTextMenu' | 'openObjectMenu';

export interface BlockService {
    blockMenu: BlockMenu;
    block: BlockI;
    screenX: number;
    screenY: number;
}

export interface CommentService {
    commentMenu: boolean;
    blockSeq: string;
    screenX: number;
    screenY: number;
    comments: CommentI[];
}

export interface BlockProviderI {
    blockService: BlockService;
    setBlockService: Dispatch<SetStateAction<BlockService>>
    commentService: CommentService;
    setCommentService: Dispatch<SetStateAction<CommentService>>
    selectedBlock: String;
    setSelectedBlock: Dispatch<SetStateAction<String>>
}


const BlockProvider = createContext<BlockProviderI>({} as BlockProviderI);


export default BlockProvider;