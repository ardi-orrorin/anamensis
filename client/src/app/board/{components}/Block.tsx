'use client';

import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {faPlus} from "@fortawesome/free-solid-svg-icons/faPlus";
import {faEllipsisVertical} from "@fortawesome/free-solid-svg-icons";
import {blockTypeList} from "@/app/{commons}/{components}/block/list";
import {BlockProps} from "@/app/{commons}/{components}/block/type/Types";
import React, {useContext, useMemo, useState} from "react";
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
        code,
        textStyle,
        onClickAddHandler,
        onClickDeleteHandler,
        value,
        blockRef,
    } = props;

    const {board, setBoard} = useContext(BoardProvider);
    const {blockService, setBlockService} = useContext(BlockProvider);
    const [isCopy, setIsCopy] = useState<CopyProps>({} as CopyProps);

    const isCursor = useMemo(() => {
        return window.location.hash === `#block-${seq}`;
    },[window.location.hash]);


    const onMouseEnterHandler = (e: React.MouseEvent<HTMLInputElement | HTMLImageElement | HTMLAnchorElement> ) => {
        const blockMenu: BlockMenu = e.target instanceof HTMLImageElement ? 'openObjectMenu' : 'openTextMenu';
        const maxScreenX = window.innerWidth - 250;
        const positionX = e.clientX + 250  > maxScreenX ? maxScreenX - 250 : e.clientX + 10;
        const positionY = e.clientY - 60 > 0 ? e.clientY - 60 : 0;

        setBlockService({
            ...blockService,
            seq,
            blockMenu: blockMenu,
            screenX: positionX,
            screenY: positionY,
        })
    }

    const onMouseLeaveHandler = (e: React.MouseEvent<HTMLImageElement | HTMLInputElement> ) => {
        // setBlockService({blockMenu: '', seq: 0, screenX: 0, screenY: 0});
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

        setTimeout(() => {
            blockRef?.current[seq]?.focus();
        },100);

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


