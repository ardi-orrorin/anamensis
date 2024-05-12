'use client';

import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {faPlus} from "@fortawesome/free-solid-svg-icons/faPlus";
import {faEllipsisVertical} from "@fortawesome/free-solid-svg-icons";
import {blockList} from "@/app/{components}/block/list";
import {BlockProps, MenuParams} from "@/app/{components}/block/type/Types";

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
        {label: '큰 제목', code: '00001'},
        {label: '작은 제목', code: '00002'},
        {label: '큰 본문', code: '00003'},
        {label: '보통 본문', code: '00004'},
        {label: '작은 본문', code: '00005'},
    ];

    const component = blockList.find(b=>
        b.code === code
    )?.component({
        // bg,
        // color,
        // size,
        // text,
        code,
        isView,
        blockRef: blockRef,
        seq: seq,
        value: value,
        setValue: setValue,
        openMenu: false,
        onKeyUpHandler: onKeyUpHandler,
        onKeyDownHandler: onKeyDownHandler,
        onChangeHandler: onChangeHandler,
        onClickAddHandler: onClickAddHandler,
        openMenuToggle: openMenuToggle
    })

    return (
        <div className={'flex relative'}>
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
                        onClick={()=> openMenuToggle({label: '', code: ''})}
                >
                  <FontAwesomeIcon icon={faEllipsisVertical} height={20} />
                </button>
            }
            <div className={`w-full h-full flex items-center rounded`}>
                { component }
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
                                              code={item.code}
                                              onClick={({label, code}) => openMenuToggle({label, code})}
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
    code
} : {
    label: string,
    code: string,
    onClick: ({label, code}:MenuParams) => void
}) => {
    return (
        <li className={'w-full'}>
            <button className={'w-full ps-3 h-8 text-left text-sm'}
                    onClick={()=> onClick({label, code})}
            >
                {label}
            </button>
        </li>
    )
}