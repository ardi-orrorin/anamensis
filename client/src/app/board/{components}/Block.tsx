'use client';

import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {faPlus} from "@fortawesome/free-solid-svg-icons/faPlus";
import {faEllipsisVertical} from "@fortawesome/free-solid-svg-icons";
import {blockTypeList} from "@/app/board/{components}/block/list";
import {BlockProps, HtmlElements, MouseEnterHTMLElements} from "@/app/board/{components}/block/type/Types";
import React, {useContext, useMemo, useState} from "react";
import MenuItem from "@/app/board/{components}/MenuItem";
import BlockProvider, {BlockMenu, BlockService} from "@/app/board/{services}/BlockProvider";
import BoardProvider from "@/app/board/{services}/BoardProvider";
import {BlockI, CommentI, ExtraValueI} from "@/app/board/{services}/types";
import SubObjectMenu from "@/app/board/{components}/SubObjectMenu";
import {findElement} from "@/app/board/{services}/funcs";


type CopyProps = {
    isCopy: boolean;
    seq: number;
}

export default function Block(props: BlockProps) {
    const {
        seq, code,
        value,
        textStyle, blockRef,
        onClickAddHandler,
        onClickDeleteHandler,
    } = props;

    const {board, setBoard, comment} = useContext(BoardProvider);
    const {blockService, setBlockService, commentService, setCommentService} = useContext(BlockProvider);
    const [isCopy, setIsCopy] = useState<CopyProps>({} as CopyProps);

    const isCursor = useMemo(() => {
        return window.location.hash === `#block-${seq}`;
    },[window.location.hash]);

    const onFocusHandler = (e: React.FocusEvent<HtmlElements>) => {
        if(e.currentTarget.ariaRoleDescription !== 'text') {
            return setBlockService({} as BlockService);
        }

        const rect = e.target.getBoundingClientRect();
        const blockMenu: BlockMenu = 'openTextMenu';
        const positionX = rect.x + 550 > window.innerWidth ? 50 : rect.x + 120;
        const positionY = rect.y - 45

        const block: BlockI = {seq, code, value, textStyle};
        setBlockService({
            ...blockService,
            block,
            blockMenu: blockMenu,
            screenX: positionX,
            screenY: positionY,
        })
    }

    const onMouseEnterHandler = (e: React.MouseEvent<MouseEnterHTMLElements> ) => {
        if(e.currentTarget.ariaRoleDescription === 'object') {
            const blockMenu: BlockMenu = 'openObjectMenu';

            const block: BlockI = {seq, code, value, textStyle};
            setBlockService({
                block,
                blockMenu: blockMenu,
                screenX: 0,
                screenY: 0,
            })
        }

        let ele = findElement(e.currentTarget);
        const rect = ele.getBoundingClientRect();
        const blockSeq = Number(ele.id.split('-')[1]);
        const comments: CommentI[] = comment.filter(c => c.blockSeq === blockSeq);
        setCommentService({
            commentMenu: true,
            screenX: rect.x + 550 > window.innerWidth ? 50 : rect.x + 120,
            screenY: rect.y - 45,
            blockSeq: Number(ele.id.split('-')[1]),
            comments: comments,
        })
    }

    const onMouseLeaveHandler = (e: React.MouseEvent<HTMLImageElement | HTMLInputElement> ) => {
        setBlockService({blockMenu: '', block: {} as BlockI, screenX: 0, screenY: 0});
        setCommentService({commentMenu: false, screenX: 0, screenY: 0, blockSeq: 0, comments: []});
    }

    const openMenuToggle  = () => {
        if(blockService.blockMenu !== 'openMenu' || blockService.block.seq !== seq) {
            setBlockService({...blockService, blockMenu: 'openMenu', block: {seq, code, value, textStyle}});
            return ;
        }

        setBlockService({...blockService, blockMenu: '', block: {
                seq: 0,
                code: '',
                value: '',
            }});
    }

    const onClickObjectMenu = (type: string) => {
        if(type === 'delete') {
            if(!onClickDeleteHandler) return;
            onClickDeleteHandler(seq);
            return ;
        }

        if(type === 'detailView') {
            const block =blockTypeList.find(b=> b.code === code);

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

    const shareLinkHandler = async (e: React.MouseEvent<HTMLDivElement>) => {
        e.preventDefault();
        if(typeof window === 'undefined') return ;
        const bastUrl = window.location.href.split('#')[0];

        const url = bastUrl + `#block-${seq}`;

        await navigator.clipboard.writeText(url);

        setIsCopy({isCopy: true, seq});

        setTimeout(() => {
            setIsCopy({isCopy: false, seq});
        }, 700);
    }

    return (
        <div className={[
            'flex relative',
            isCursor && 'bg-red-700 border-2 border-dashed border-red-800 border-opacity-20 bg-opacity-20 rounded',
        ].join(' ')}
             onContextMenu={shareLinkHandler}
        >
            {
                board.isView
                && <div className={[
                    'absolute left-1/2 top-1/2 z-30 text-sm w-52 h-14 flex justify-center items-center bg-white rounded shadow border-l-8 border-solid border-blue-300 duration-200',
                    isCopy.isCopy ? 'opacity-100' : 'opacity-0',
                ].join(' ')
                }>
                      {`block-${isCopy.seq}`} 링크가 복사되었습니다.
                </div>
            }
            {
                !board.isView &&
                <button className={'w-8 h-full flex justify-center items-center text-gray-600 hover:text-gray-950'}
                        onClick={onClickAddHandler}
                >
                  <FontAwesomeIcon icon={faPlus} height={20} />
                </button>
            }
            {
                !board.isView &&
                <button className={'w-8 h-full flex justify-center items-center text-gray-600 hover:text-gray-950'}
                        onClick={()=> openMenuToggle()}
                >
                  <FontAwesomeIcon icon={faEllipsisVertical} height={20} />
                </button>
            }
            <div className={`relative w-full h-full flex items-center rounded`}>
                {
                    blockTypeList.filter(b=> b.code === props.code)?.map(c => {
                        'use client'
                        const Component = c.component;
                        return (
                            <div key={'blockContainer' + seq} className={'flex flex-col w-full'}>
                                {
                                    blockService?.block?.seq === seq
                                    && c.type === 'object'
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
                        )
                    })
                }
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


