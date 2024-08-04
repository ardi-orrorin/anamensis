'use client';

import React, {MutableRefObject, useCallback, useContext, useMemo, useState} from "react";
import {faBold, faItalic, faTextSlash} from "@fortawesome/free-solid-svg-icons";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import BlockProvider from "@/app/board/{services}/BlockProvider";
import BoardProvider from "@/app/board/{services}/BoardProvider";
import MenuColorItem from "@/app/board/{components}/MenuColorItem";
import MenuFontsizeItem from "@/app/board/{components}/MenuFontsizeItem";
import MenuItem from "@/app/board/{components}/MenuItem";

export type ToggleEnum = 'blockMenu' | 'fontSize' | 'color' | 'backgroundColor' | 'fontStyle' | '';

const SubTextMenu = ({
    blockRef,
}: {
    blockRef  : MutableRefObject<HTMLElement[] | null[]>;
}) => {

    const [toggle, setToggle] = useState<ToggleEnum>('');
    const {blockService, setBlockService} = useContext(BlockProvider);
    const {board, setBoard} = useContext(BoardProvider);

    const {seq, code, textStyle} = blockService.block;

    const selectFontStyle = (type: string, value:string) => {
        value = textStyle![type] === value ? '' : value;
        onClickSubTextMenu(type, value)
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
        setTimeout(() => {
            blockRef.current[seq]?.focus();
        },100);
    }


    const onClickColorHandler = useCallback((name: ToggleEnum, value: string) => {
        onClickSubTextMenu(name, value);

        setToggle(name ? '' : name)
        setTimeout(() => {
            blockRef.current[seq]?.focus();
        },100);
    },[blockRef?.current[seq]]);

    const buttonStyle = 'py-2 px-3 h-full hover:bg-blue-50 hover:text-black duration-300 outline-0 '

    const fontStyles = useMemo(() =>
        fontStyle.map((style, index) => {
            return (
                <li key={'fontStyle' + index}>
                    <button className={buttonStyle + (textStyle![style.style] === style.value ? 'bg-blue-400 text-white' : 'bg-white')}
                            onClick={() => selectFontStyle(style.style, style.value)}
                    >
                        <FontAwesomeIcon icon={style.icon} />
                    </button>
                </li>
            )
        })
    , [textStyle]);

    return (
        <div className={`fixed bg-gray-100 z-20 w-auto max-h-52 duration-200 rounded shadow-md`}
             style={{top: blockService.screenY, left: blockService.screenX}}
        >
            <ul className={'grid grid-cols-3 md:flex overflow-hidden rounded text-sm bg-white'}>
                <li>
                    <button className={[
                                'min-w-20 tracking-wider',
                                buttonStyle,
                            ].join(' ')}
                            onClick={() => toggle === 'blockMenu' ? setToggle('') : setToggle('blockMenu')}
                    >
                        블록타입
                    </button>
                    {
                        !board.isView
                        && <MenuItem subMenu={true}
                                     seq={seq}
                                     toggle={toggle}
                                     blockRef={blockRef}
                       />
                    }
                </li>
                <li>
                    <button className={[
                        'min-w-20 tracking-wider',
                        buttonStyle + (textStyle?.fontSize && textStyle.fontStyle !== '' ?  'bg-blue-400 text-white' : 'bg-white'),
                    ].join(' ')}
                            onClick={() => toggle === 'fontSize' ? setToggle('') : setToggle('fontSize')}
                    >
                        글자크기
                    </button>
                    <MenuFontsizeItem toggle={toggle}
                                      onClick={onClickColorHandler}
                                      value={board.data.content.list[seq]?.value ?? ''}
                    />
                </li>
                <li>
                    <button className={[
                                'min-w-20 tracking-wider',
                                buttonStyle + (textStyle?.color && textStyle.color !== '' ?  'bg-blue-400 text-white' : 'bg-white'),
                            ].join(' ')}
                            onClick={() => toggle === 'color' ? setToggle('') : setToggle('color')}
                    >
                        글자색
                    </button>
                    <MenuColorItem className={'font-bold'}
                                   toggle={toggle}
                                   menuTitle={'글자색'}
                                   name={'color'}
                                   onClick={onClickColorHandler}
                    />
                </li>
                <li>
                    <button className={[
                            'min-w-20 tracking-wider',
                            buttonStyle + (textStyle?.backgroundColor && textStyle.backgroundColor !== '' ?  'bg-blue-400 text-white' : 'bg-white'),
                        ].join(' ')}
                            onClick={() => toggle === 'backgroundColor' ? setToggle('') :  setToggle('backgroundColor')}
                    >
                        배경색
                    </button>
                    <MenuColorItem name={'backgroundColor'}
                                   menuTitle={'배경색'}
                                   toggle={toggle}
                                   onClick={onClickColorHandler}
                    />
                </li>
                { fontStyles }
                <li>
                    <button className={['min-w-16',buttonStyle + (Object.keys(textStyle!).length > 0 ? 'bg-blue-400 text-white' : 'bg-white')].join(' ')}
                            onClick={() => selectFontStyle('', '')}
                    >
                        초기화
                    </button>
                </li>
            </ul>
        </div>
    )
}

const fontStyle = [
    {icon : faBold, style: 'fontWeight', value: '700'},
    {icon : faItalic, style: 'fontStyle', value: 'Italic'},
    {icon : faTextSlash, style: 'textDecoration', value: 'line-through'},
]

export default SubTextMenu;