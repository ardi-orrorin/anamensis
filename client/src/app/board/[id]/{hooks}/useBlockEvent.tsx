import React, {createContext, Dispatch, SetStateAction, useCallback, useContext, useState} from "react";
import {BlockI, CommentI} from "@/app/board/{services}/types";
import {HtmlElements, MouseEnterHTMLElements} from "@/app/board/{components}/block/type/Types";

export type BlockMenu = '' | 'openMenu' | 'openTextMenu' | 'openObjectMenu';

interface PositionI {
    screenX : number;
    screenY : number;
}

export interface BlockService extends PositionI{
    blockMenu : BlockMenu;
    block     : BlockI;
}

export interface BlockEventProviderI {
    blockService      : BlockService;
    setBlockService   : Dispatch<SetStateAction<BlockService>>
    selectedBlock     : String;
    setSelectedBlock  : Dispatch<SetStateAction<String>>
    onFocus           : ({event, block}: EventHandler<React.FocusEvent<HtmlElements>>) => void;
    onMouseEnter      : ({event, block, content}: EventContentHandler<React.MouseEvent<MouseEnterHTMLElements>, CommentI[]>) => void;
    onMouseLeave      : () => void;
    openMenuToggle    : ({block}: {block: BlockI}) => void;
    onClose           : (e: React.MouseEvent<HTMLDivElement>) => void;
    setInitBlock      : () => void;
    setInitBlockMenu  : () => void;
}

type EventHandler<T> = {
    event: T;
    block: BlockI;
}

type EventContentHandler<T, C> = {
    content: C;
} & EventHandler<T>

const BlockEventContext = createContext<BlockEventProviderI>({} as BlockEventProviderI);

export const BlockEventProvider = ({children} : {children: React.ReactNode}) => {

    const [selectedBlock, setSelectedBlock] = useState<String>('');

    const [blockService, setBlockService] = useState<BlockService>({} as BlockService);

    const onFocus = useCallback(({event, block}: EventHandler<React.FocusEvent<HtmlElements>>) => {
        if (event.currentTarget.ariaRoleDescription !== 'text') {
            return setBlockService({} as BlockService);
        }

        const rect = event.target.getBoundingClientRect();
        const blockMenu: BlockMenu = 'openTextMenu';
        const screenX = rect.x + 550 > window.innerWidth ? 50 : rect.x + 120;
        const screenY = rect.y - 45

        setBlockService({
            ...blockService,
            block, blockMenu,
            screenX, screenY,
        })

    },[blockService]);

    const onMouseEnter = ({event, block} : EventHandler<React.MouseEvent<MouseEnterHTMLElements>>) => {
        if(event.currentTarget.ariaRoleDescription !== 'object') return;

        const blockMenu: BlockMenu = 'openObjectMenu';

        setBlockService({
            block,
            blockMenu: blockMenu,
            screenX: 0,
            screenY: 0,
        })
    }

    const onMouseLeave = useCallback(() => {
        setBlockService({blockMenu: '', block: {} as BlockI, screenX: 0, screenY: 0});
    },[]);


    const onClose = useCallback((e: React.MouseEvent<HTMLDivElement>) => {
        e.stopPropagation();
        setInitBlockMenu();
    },[blockService]);

    const openMenuToggle  = useCallback(({block}: {block: BlockI}) => {
        if(blockService.blockMenu !== 'openMenu' || blockService.block.seq !== block.seq) {
            setBlockService({...blockService, blockMenu: 'openMenu', block});
            return ;
        }

        setInitBlock();
    },[blockService]);

    const setInitBlockMenu = useCallback(() => {
        setBlockService({...blockService, blockMenu: ''});
    } , [blockService]);

    const setInitBlock = useCallback(() => {
        const initBlock = {
            seq: 0, code: '', value: '', hash: ''
        }

        setBlockService({...blockService, blockMenu: '', block: initBlock});
    },[blockService]);

    return (
        <BlockEventContext.Provider value={{
            blockService   ,  setBlockService,
            selectedBlock  ,  setSelectedBlock,
            onFocus        ,  onMouseEnter,
            onMouseLeave   ,  openMenuToggle,
            onClose        ,  setInitBlock,
            setInitBlockMenu
        }}>
            {children}
        </BlockEventContext.Provider>
    )
}

export const useBlockEvent = () => {
    const context = useContext(BlockEventContext);

    if (!context) {
        throw new Error('useBlockEvent must be used within a BlockEventProvider');
    }

    return context;
}


