import {ToggleEnum} from "@/app/board/{components}/SubTextMenu";
import {useMemo} from "react";

export type MenuSubItemProps = {
    value: string;
    toggle: ToggleEnum;
    onClick: (name: ToggleEnum, value: string) => void;
}

const MenuFontsizeItem = ({
    value,
    toggle,
    onClick
}: MenuSubItemProps) => {
    const fontSize = ['','10px', '12px', '14px', '16px', '18px', '20px', '24px', '32px', '40px', '48px', '64px', '80px', '100px']

    const fontSizes = useMemo(() =>
        fontSize.map((size, index) => {
            const fontSize = size === '' ? '1rem' : size
            const minHeight = size === '' ? '1rem' : Number(size.split('px')[0]) + 5 + 'px';
            return (
                <button key={'fontSize' + index}
                        className={'w-full max-w-96 text-left tracking-wider duration-300 hover:bg-blue-200 hover:text-blue-800 truncate'}
                        onClick={()=> onClick('fontSize', size)}
                        style={{fontSize, minHeight}}
                >
                    {
                        size === '' ? '기본'
                            : value !== '' ? `[${size}] ${value}`
                                : size
                    }
                </button>
            )
        })
    ,[fontSize])

    return (
        <div className={`absolute z-30 flex flex-col justify-left gap-1 items-start max-w-96 bg-white duration-300 overflow-x-hidden overflow-y-scroll shadow ${toggle === 'fontSize' ? 'max-h-72' : 'max-h-0'}`}>
            { fontSizes }
        </div>
    )
}

export default MenuFontsizeItem;
