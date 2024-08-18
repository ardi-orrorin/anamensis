'use client';

import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {faPlus} from "@fortawesome/free-solid-svg-icons/faPlus";
import {faEllipsisVertical} from "@fortawesome/free-solid-svg-icons";
import {blockTypeFlatList} from "@/app/board/{components}/block/list";
import {
    BlockProps,
    HtmlElements,
    MouseEnterHTMLElements,
    MouseLeaveHTMLElements
} from "@/app/board/{components}/block/type/Types";
import React, {useCallback, useContext, useEffect, useMemo, useRef, useState} from "react";
import MenuItem from "@/app/board/{components}/MenuItem";
import BoardProvider from "@/app/board/{services}/BoardProvider";
import {BlockI, ExtraValueI} from "@/app/board/{services}/types";
import SubObjectMenu from "@/app/board/{components}/SubObjectMenu";
import {useBlockEvent} from "@/app/board/[id]/{hooks}/useBlockEvent";

type ContextMenuProps = {
    clientX: number;
    clientY: number;
    isView: boolean;
    mode: 'url' | 'answer';
}

const Block = (props: BlockProps) => {
    const {
        seq, code,
        value, hash, isView,
        textStyle, blockRef,
        onClickAddHandler,
        onClickDeleteHandler
    } = props;

    const {board, setBoard, comment, setNewComment, newComment} = useContext(BoardProvider);

    const {
        blockService, selectedBlock,
        onFocus, onMouseEnter,
        onMouseLeave, openMenuToggle,
    } = useBlockEvent();

    const [contextMenu, setContextMenu] = useState<ContextMenuProps>({} as ContextMenuProps);

    const timeout = useRef<NodeJS.Timeout>();

    const block = useMemo(() =>
        blockTypeFlatList.find(b =>
            b.code === props.code
        )
    , [props.code]);

    const Component = useMemo(()=>block?.component!,[block]);

    useEffect(()=> {
        return () => {
            if(timeout.current) clearTimeout(timeout.current);
        }
    },[])

    const onFocusHandler = (e: React.FocusEvent<HtmlElements>) => {
        const block = {seq, code, value, textStyle, hash} as BlockI;

        onFocus({event: e, block});
    }

    const onMouseEnterHandler = (e: React.MouseEvent<MouseEnterHTMLElements> ) => {
        const block = {
            seq, code, value
            , textStyle, hash
        } as BlockI;

        onMouseEnter({event: e, block, content: comment});
    }

    const onMouseLeaveHandler = useCallback((e: React.MouseEvent<MouseLeaveHTMLElements> ) => {
        onMouseLeave();
    },[]);

    const openMenuToggleHandler = useCallback(() => {
        const block = {
            seq, code, value
            , textStyle, hash
        } as BlockI;

        openMenuToggle({block});

    },[seq, code, value, hash]);

    const onClickObjectMenu = (type: string) => {
        if(type === 'delete') {
            if(!onClickDeleteHandler) return;
            onClickDeleteHandler(seq);
            return ;
        }

        if(type === 'detailView') {
            const block = blockTypeFlatList.find(b=> b.code === code);

            let url = '';

            switch (block?.tag) {
                case 'image':
                    url = process.env.NEXT_PUBLIC_CDN_SERVER + value;
                    break;
                case 'link':
                    url = JSON.parse(value).url;
                    break;
                default:
                    url = '';
                    break;
            }

            window.open(url, '_blank');

            return ;
        }
    }

    const onChangeValueHandler = (value: string) => {
        const newList = board.data?.content?.list.map((item, index) => {
            if (item.seq === seq) {
                item.value = value;
            }
            return item;
        });
        setBoard({...board, data: {...board.data, content: {list: newList}}});
    }

    const onChangeExtraValueHandler = (value: ExtraValueI) => {
        const newList = board.data?.content?.list.map((item, index) => {
            if (item.seq === seq) {
                item.extraValue = value;
            }
            return item;
        });

        setBoard({...board, data: {...board.data, content: {list: newList}}});
    }

    const contextLinkHandler = async (e: React.MouseEvent<HTMLDivElement> | React.TouchEvent<HTMLDivElement>) => {
        if(!board?.isView || !board?.data?.isLogin) return;

        e.preventDefault();

        const {clientX, clientY} = e.nativeEvent as MouseEvent;
        setContextMenu({clientX, clientY, isView: true} as ContextMenuProps);
    }

    const shareLinkHandler = useCallback(() => {
        if(!board.data.isLogin || !board?.data?.id ||  typeof window === 'undefined') return;

        const url = `${window.location.origin}/board/${board.data.id}#block-${hash}`;

        navigator.clipboard.writeText(url);
        setContextMenu({...contextMenu, isView: false, mode: 'url'});

        timeout.current = setTimeout(() => {
            setContextMenu({} as ContextMenuProps);
        },700);
    },[contextMenu]);

    const answerLinkHandler = useCallback(() => {
        if(!board.data.isLogin || typeof window === 'undefined') return;

        setContextMenu({...contextMenu, isView: false, mode: 'answer'});

        timeout.current = setTimeout(() => {
            if(board.data.isLogin) setNewComment({...newComment, blockSeq: hash});
            setContextMenu({} as ContextMenuProps);
        }, 700);

    },[contextMenu]);

    const shareLinkLongTouchHandler = async (e: React.TouchEvent<HTMLDivElement>) => {
        if(!board.data.isLogin) return;

        e.preventDefault();
        const touchTime = 400;
        if(timeout.current) clearTimeout(timeout.current);

        timeout.current = setTimeout(() => {
            contextLinkHandler(e);
        }, touchTime);
    }

    return (
        <div className={[
            'flex relative items-center',
            selectedBlock === hash && board.isView && 'bg-red-700 border-2 border-dashed border-red-800 border-opacity-20 bg-opacity-20 rounded',
        ].join(' ')}
             onContextMenu={contextLinkHandler}
             onTouchStart={shareLinkLongTouchHandler}
             onTouchEnd={() => clearTimeout(timeout.current)}
        >
            {
                contextMenu.isView
                && <>
                    <div className={`z-[20] w-40 fixed flex flex-col justify-start items-start bg-gray-500 rounded shadow-md`}
                         style={{left: contextMenu.clientX, top: contextMenu.clientY}}
                    >
                        <button className={'w-full p-2 text-sm bg-white hover:bg-gray-400 hover:text-white duration-300'}
                                onClick={shareLinkHandler}
                        >
                          블록 주소 복사
                        </button>
                        <button className={'w-full p-2 text-sm bg-white hover:bg-gray-400 hover:text-white duration-300'}
                                onClick={answerLinkHandler}
                        >
                          댓글 참조
                        </button>
                    </div>
                    <div className={'z-[10] w-full h-full fixed top-0 left-0'}
                         onClick={()=> setContextMenu({} as ContextMenuProps)}
                    ></div>
                </>
            }
            {
                !contextMenu.isView
                && contextMenu.clientY
                && contextMenu.clientX
                && <div className={`z-[20] p-2 w-60 fixed flex flex-col text-sm justify-center items-center bg-white rounded shadow-md`}
                        style={{left: contextMenu.clientX, top: contextMenu.clientY}}
                >
                    {
                        contextMenu.mode === 'url'
                        ? 'url 주소를 클립보드로 복사했습니다.'
                        : contextMenu.mode === 'answer'
                            ? '댓글 참조를 클립보드로 복사했습니다.'
                            : ''
                    }
                </div>
            }
            {
                !board.isView
                && <button className={'min-w-8 w-8 h-full flex justify-center items-center text-gray-600 hover:text-gray-950'}
                           onClick={onClickAddHandler}
                >
                  <FontAwesomeIcon icon={faPlus} height={20} />
                </button>
            }
            {
                !board.isView
                && block?.type !== 'extra'
                && <button className={'min-w-8 w-8 h-full flex justify-center items-center text-gray-600 hover:text-gray-950'}
                           onClick={()=> openMenuToggleHandler()}
                >
                  <FontAwesomeIcon icon={faEllipsisVertical} height={20} />
                </button>
            }
            <div className={`relative w-full h-full flex items-center rounded`}>
                <div key={'blockContainer' + seq} className={'flex flex-col w-full'}>
                    {
                        blockService?.block?.seq === seq
                        && block?.type === 'object'
                        && <SubObjectMenu key={'subMenu' + seq}
                                          isView={board.isView}
                                          value={value}
                                          onClick={onClickObjectMenu}
                        />
                    }
                    <Component key={'block' + seq}
                               isView={board.isView}
                               onMouseEnterHandler={onMouseEnterHandler}
                               onMouseLeaveHandler={onMouseLeaveHandler}
                               onChangeValueHandler={onChangeValueHandler}
                               onFocusHandler={onFocusHandler}
                               onChangeExtraValueHandler={onChangeExtraValueHandler}
                               {...props}
                    />
                </div>
            </div>
            {
                !board.isView
                && blockService.blockMenu === 'openMenu'
                && blockService?.block?.seq === seq
                && <MenuItem seq={seq}
                             blockRef={blockRef!}
              />
            }
        </div>
    )
}

export default Block;