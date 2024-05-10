'use client';

import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {faPlus} from "@fortawesome/free-solid-svg-icons/faPlus";
import {faEllipsisVertical} from "@fortawesome/free-solid-svg-icons";
import {ChangeEvent, Dispatch, LegacyRef, MutableRefObject, SetStateAction, useEffect} from "react";

type BlockProps = {
    seq: number;
    code: string;
    color: string;
    bg : string;
    text: string;
    size: string;
    isView: boolean;
    openMenu: boolean;
    openMenuToggle: () => void;
    onChangeHandler: (e: ChangeEvent<HTMLInputElement>) => void;
    onKeyUpHandler: (e: React.KeyboardEvent<HtmlElements>) => void;
    onKeyDownHandler: (e: React.KeyboardEvent<HtmlElements>) => void;
    onClickAddHandler: () => void;
    value: string;
    setValue: Dispatch<SetStateAction<string>>;
    blockRef: MutableRefObject<HTMLElement[] | null[]>;
}

type HtmlElements = HTMLInputElement | HTMLTextAreaElement | HTMLButtonElement | HTMLDataElement | HTMLDataListElement;

export default function Block({
    seq,
    code,
    color,
    bg,
    text,
    size,
    isView,
    openMenu,
    openMenuToggle,
    onChangeHandler,
    onKeyUpHandler,
    onKeyDownHandler,
    onClickAddHandler,
    value,
    setValue,
      blockRef
}: BlockProps) {
    const menuItems = [
        {label: 'Text'},
        {label: '1Text'},
        {label: '2Text'},
        {label: '3Text'},
        {label: '4Text'},
        {label: '5Text'},
        {label: '6Text'},
    ];

    return (
        <div className={'h-8 flex relative'}>
            {
                !isView &&
                <button className={'w-8 h-full flex justify-center items-center text-gray-600 hover:text-gray-950'}
                        onClick={onClickAddHandler}
                >
                  <FontAwesomeIcon icon={faPlus} height={20} />
                </button>
            }
            {
                !isView &&
                <button className={'w-8 h-full flex justify-center items-center text-gray-600 hover:text-gray-950'}
                        onClick={openMenuToggle}
                >
                  <FontAwesomeIcon icon={faEllipsisVertical} height={20} />
                </button>
            }
            <div className={`w-full h-full flex items-center rounded`}>
                {
                    // todo: 블록 타입 추가
                    !isView &&
                    <input className={`w-full h-full outline-0 px-3 bg-gray-50 focus:bg-blue-50 hover:bg-blue-50 duration-500`}
                           style={{color: color, backgroundColor: bg, fontSize: size}}
                           value={value}
                           onChange={onChangeHandler}
                           onKeyDown={onKeyDownHandler}
                           onKeyUp={onKeyUpHandler}
                           ref={el => blockRef.current[seq] = el}
                    >
                    </input>
                }
                {
                    isView &&
                    <span className={'w-full h-full flex items-center'}
                      style={{color: color, backgroundColor: bg, fontSize: size}}
                    >{value}</span>
                }
            </div>
            {
                openMenu &&
                <div className={'absolute top-8 left-3 bg-blue-100 z-10 w-32 max-h-36 duration-500 overflow-y-scroll rounded'}>
                    <ul className={'flex flex-col w-full text-blue-700'}>
                        {
                            menuItems.map((item, index) => {
                                return (
                                    <MenuItem key={index}
                                              label={item.label}
                                              onClick={openMenuToggle}
                                    />
                                )
                            })
                        }
                    </ul>
                </div>
            }
        </div>
    )
}

const MenuItem = ({
    label,
    onClick,
} : {
    label: string,
    onClick: (e: React.MouseEvent<HTMLButtonElement>) => void
}) => {
    return (
        <li className={'w-full'}>
            <button className={'w-full ps-3 h-8 text-left'}
                    onClick={onClick}
            >
                {label}
            </button>
        </li>
    )
}