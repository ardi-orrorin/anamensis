'use client';

import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {faPlus} from "@fortawesome/free-solid-svg-icons/faPlus";
import {faEllipsisVertical} from "@fortawesome/free-solid-svg-icons";
import {blockTypeList} from "@/app/board/{components}/block/list";
import {
    BlockProps,
    HtmlElements,
    MouseEnterHTMLElements,
    MouseLeaveHTMLElements
} from "@/app/board/{components}/block/type/Types";
import React, {useCallback, useContext, useMemo, useState} from "react";
import MenuItem from "@/app/board/{components}/MenuItem";
import BlockProvider, {BlockMenu, BlockService} from "@/app/board/{services}/BlockProvider";
import BoardProvider from "@/app/board/{services}/BoardProvider";
import {BlockI, CommentI, ExtraValueI} from "@/app/board/{services}/types";
import SubObjectMenu from "@/app/board/{components}/SubObjectMenu";
import {findElement} from "@/app/board/{services}/funcs";

type ContextMenuProps = {
    clientX: number;
    clientY: number;
    isView: boolean;
    mode: 'url' | 'answer';
}

const Block = (props: BlockProps) => {
    const {
        seq, code,
        value, hash,
        textStyle, blockRef,
        onClickAddHandler,
        onClickDeleteHandler,
    } = props;

    const {board, setBoard, comment, setNewComment, newComment} = useContext(BoardProvider);

    const {blockService, setBlockService, commentService, setCommentService, selectedBlock} = useContext(BlockProvider);
    const [touch, setTouch] = useState(setTimeout(() => false, 0));
    const [contextMenu, setContextMenu] = useState<ContextMenuProps>({} as ContextMenuProps);

    const block = useMemo(() =>
        blockTypeList.find(b => b.code === props.code)
    , [props.code]);

    const Component = block?.component!;

    const onFocusHandler = useCallback((e: React.FocusEvent<HtmlElements>) => {
        if(e.currentTarget.ariaRoleDescription !== 'text') {
            return setBlockService({} as BlockService);
        }

        const rect = e.target.getBoundingClientRect();
        const blockMenu: BlockMenu = 'openTextMenu';
        const positionX = rect.x + 550 > window.innerWidth ? 50 : rect.x + 120;
        const positionY = rect.y - 45

        const block: BlockI = {seq, code, value, textStyle, hash};

        setBlockService({
            ...blockService,
            block,
            blockMenu,
            screenX: positionX,
            screenY: positionY,
        })
    },[board?.data?.content?.list[seq]]);

    const onMouseEnterHandler = (e: React.MouseEvent<MouseEnterHTMLElements> ) => {
        if(e.currentTarget.ariaRoleDescription === 'object') {
            const blockMenu: BlockMenu = 'openObjectMenu';

            const block: BlockI = {
                seq, code, value
                , textStyle, hash
            };
            setBlockService({
                block,
                blockMenu: blockMenu,
                screenX: 0,
                screenY: 0,
            })
        }

        let ele = findElement(e.currentTarget);
        const rect = ele.getBoundingClientRect();
        const blockSeq = ele.id.replaceAll('block-', '');
        const comments: CommentI[] = comment.filter(c => c.blockSeq === blockSeq);
        setCommentService({
            commentMenu: true,
            screenX: rect.x + 550 > window.innerWidth ? 50 : rect.x + 120,
            screenY: rect.y - 45,
            blockSeq: ele.id.replaceAll('block-', ''),
            comments: comments,
        })
    }

    const onMouseLeaveHandler = useCallback((e: React.MouseEvent<MouseLeaveHTMLElements> ) => {
        setBlockService({blockMenu: '', block: {} as BlockI, screenX: 0, screenY: 0});
        setCommentService({commentMenu: false, screenX: 0, screenY: 0, blockSeq: '', comments: []});
    },[]);

    const openMenuToggle  = useCallback(() => {

        if(blockService.blockMenu !== 'openMenu' || blockService.block.seq !== seq) {
            setBlockService({...blockService, blockMenu: 'openMenu', block: {seq, code, value, textStyle, hash}});
            return ;
        }

        setBlockService({...blockService, blockMenu: '', block: {
                seq: 0, code: '', value: '', hash: '',
            }
        });
    },[]);

    const onClickObjectMenu = useCallback((type: string) => {
        if(type === 'delete') {
            if(!onClickDeleteHandler) return;
            onClickDeleteHandler(seq);
            return ;
        }

        if(type === 'detailView') {
            const block = blockTypeList.find(b=> b.code === code);

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
    },[]);

    const onChangeValueHandler = useCallback((value: string) => {
        const newList = board.data?.content?.list.map((item, index) => {
            if (item.seq === seq) {
                item.value = value;
            }
            return item;
        });

        setBoard({...board, data: {...board.data, content: {list: newList}}});
    },[board?.data?.content.list[seq]])

    const onChangeExtraValueHandler = useCallback((value: ExtraValueI) => {
        const newList = board.data?.content?.list.map((item, index) => {
            if (item.seq === seq) {
                item.extraValue = value;
            }
            return item;
        });

        setBoard({...board, data: {...board.data, content: {list: newList}}});
    },[board?.data?.content.list[seq]]);

    const contextLinkHandler = useCallback(async (e: React.MouseEvent<HTMLDivElement> | React.TouchEvent<HTMLDivElement>) => {
        if(!board?.isView) return;
        if(!board?.data?.isLogin) return;

        e.preventDefault();

        const {clientX, clientY} = e.nativeEvent as MouseEvent;
        setContextMenu({clientX, clientY, isView: true} as ContextMenuProps);
    },[board?.isView, board?.data?.isLogin]);

    const shareLinkHandler = useCallback(() => {
        if(!board.data.isLogin) return;
        if(typeof window === 'undefined') return ;
        if(!board?.data?.id) return;

        const url = `${window.location.origin}/board/${board.data.id}#block-${hash}`;

        navigator.clipboard.writeText(url);
        setContextMenu({...contextMenu, isView: false, mode: 'url'});

        setTimeout(() => {
            setContextMenu({} as ContextMenuProps);
        },700);
    },[contextMenu]);

    const answerLinkHandler = useCallback(() => {
        if(!board.data.isLogin) return;
        if(typeof window === 'undefined') return ;

        setContextMenu({...contextMenu, isView: false, mode: 'answer'});

        setTimeout(() => {
            if(board.data.isLogin) setNewComment({...newComment, blockSeq: hash});
            setContextMenu({} as ContextMenuProps);
        }, 700);
    },[contextMenu]);

    const shareLinkLongTouchHandler = useCallback(async (e: React.TouchEvent<HTMLDivElement>) => {
        if(!board.data.isLogin) return;

        e.preventDefault();
        const touchTime = 400;
        if(touch) clearTimeout(touch);

        setTouch(setTimeout(() => {
            contextLinkHandler(e);
        }, touchTime));
    },[board?.data?.isLogin]);

    return (
        <div className={[
            'flex relative items-center',
            selectedBlock === hash && board.isView && 'bg-red-700 border-2 border-dashed border-red-800 border-opacity-20 bg-opacity-20 rounded',
        ].join(' ')}
             onContextMenu={contextLinkHandler}
             onTouchStart={shareLinkLongTouchHandler}
             onTouchEnd={() => clearTimeout(touch)}
        >
            {
                contextMenu.isView
                && <div className={`z-[20] w-40 fixed flex flex-col justify-start items-start bg-gray-500 rounded shadow-md`}
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
                           onClick={()=> openMenuToggle()}
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

export default React.memo(Block,(prevProps, nextProps) => {
    return prevProps.value === nextProps.value && prevProps.seq === nextProps.seq
});