'use client';

import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {faPlus} from "@fortawesome/free-solid-svg-icons/faPlus";
import {faEllipsisVertical} from "@fortawesome/free-solid-svg-icons";
import {blockTypeList} from "@/app/{commons}/{components}/block/list";
import {BlockProps} from "@/app/{commons}/{components}/block/type/Types";
import React, {MouseEventHandler, useContext, useEffect, useState} from "react";
import MenuItem from "@/app/board/{components}/MenuItem";
import BlockProvider, {BlockMenu} from "@/app/board/{services}/BlockProvider";
import BoardProvider from "@/app/board/{services}/BoardProvider";


type CopyProps = {
    isCopy: boolean;
    seq: number;


}

export default function Block(props: BlockProps) {
    const {
        seq,
        isCursor,
        textStyle,
        onClickAddHandler,
        onClickDeleteHandler,
        value,
    } = props;

    const {board, setBoard} = useContext(BoardProvider);
    const {blockService, setBlockService} = useContext(BlockProvider);
    const [isCopy, setIsCopy] = useState<CopyProps>({} as CopyProps);

    const onMouseEnterHandler = (e: React.MouseEvent<HTMLInputElement | HTMLImageElement> ) => {
        let blockMenu: BlockMenu = '';
        if(e.target instanceof HTMLImageElement) {
            blockMenu = 'openObjectMenu';
        } else if(e.target instanceof HTMLInputElement) {
            blockMenu = 'openTextMenu';
        }

        setBlockService({...blockService, blockMenu: blockMenu, seq})
    }

    const onMouseLeaveHandler = (e: React.MouseEvent<HTMLImageElement | HTMLInputElement> ) => {
        setBlockService({blockMenu: '', seq: 0});
    }

    const openMenuToggle  = () => {
        if(blockService.blockMenu !== 'openMenu' || blockService.seq !== seq) {
            setBlockService({...blockService, blockMenu: 'openMenu', seq});
            return ;
        }

        setBlockService({...blockService, blockMenu: '', seq: 0});
    }

    const openMenuClick = (code: string) => {
        if(!code || code === '') return ;

        const newList = board.data?.content?.list.map((item, index) => {
            if (item.seq === seq) {
                if(item.code.slice(0, 3) !== code.slice(0, 3)) {
                    item.value = '';
                }
                item.code = code;
            }
            return item;
        });

        setBlockService({...blockService, blockMenu: '', seq: 0});
        setBoard({...board, data: {...board.data, content: {list: newList}}});
    }

    const onClickSubTextMenu = (type: string, value: string) => {
        const newList = board.data?.content?.list.map((item, index) => {
            if (item.seq === seq) {
                item.textStyle = type === ''
                ? {}
                : {...item.textStyle, [type]: value};
            }
            return item;
        });
        setBoard({...board, data: {...board.data, content: {list: newList}}});
    }

    const onClickObjectMenu = (type: string) => {
        if(type === 'delete') {
            if(!onClickDeleteHandler) return;
            onClickDeleteHandler(seq);
            return ;
        }

        if(type === 'detailView') {
            const url = process.env.NEXT_PUBLIC_CDN_SERVER + value;
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

    const shareLinkHandler = (e: React.MouseEvent<HTMLDivElement>) => {
        e.preventDefault();
        const bastUrl = window.location.href.split('#')[0];

        const url = bastUrl + `#block-${seq}`;
        navigator.clipboard.writeText(url);

        setIsCopy({isCopy: true, seq});

        setTimeout(() => {
            setIsCopy({} as CopyProps);
        }, 1000);

    }

    return (
        <div className={['flex relative'].join(' ')}
             onContextMenu={shareLinkHandler}
        >
            {
                board.isView
                && isCopy.isCopy
                && <div className={'absolute left-1/2 top-1/2 z-30 text-sm w-52 h-14 flex justify-center items-center bg-white rounded shadow border-l-8 border-solid border-blue-300'}>
                      {`block-${isCopy.seq}`} 링크가 복사되었습니다.
                </div>
            }
            {
                isCursor
                && <div className={'z-10 absolute w-full h-full flex justify-center items-center bg-red-700 border-2 border-dashed border-red-800 opacity-40 bg-opacity-40 rounded'}>
                    select
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
                        const SubMenuComponent = c.subMenuComponent;
                        const onClick = c.type === 'text' ? onClickSubTextMenu : onClickObjectMenu;
                        return <div key={'blockContainer' + seq} className={'flex w-full'}>
                            {
                                blockService.seq === seq
                                && <SubMenuComponent key={'subMenu' + seq}
                                                     isView={board.isView}
                                                     value={value}
                                                     textStyle={textStyle || {}}
                                                     onClick={onClick}
                                />
                            }
                            <Component key={'block' + seq}
                                       isView={board.isView}
                                       onMouseEnterHandler={onMouseEnterHandler}
                                       onMouseLeaveHandler={onMouseLeaveHandler}
                                       onChangeValueHandler={onChangeValueHandler}
                                       {...props}
                            />
                        </div>
                    })
                }
            </div>
            {
                !board.isView
                && blockService.blockMenu === 'openMenu'
                && blockService.seq === seq
                && <MenuItem onClick={openMenuClick} />
            }
        </div>
    )
}


