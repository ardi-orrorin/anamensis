import {ToggleEnum} from "@/app/board/{components}/SubTextMenu";

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
    const fontSize = [ 10, 12, 14, 16, 18, 20, 24, 32, 40, 48, 64, 80, 100 ];

    return (
        <div className={`absolute flex flex-col justify-left items-start max-w-96 bg-white duration-300 overflow-x-hidden overflow-y-scroll ${toggle === 'fontSize' ? 'max-h-72' : 'max-h-0'}`}>
            {
                fontSize.map((size, index) => {
                    return (
                        <button key={'fontSize' + index}
                                className={'max-w-96 text-left tracking-wider duration-300 hover:bg-blue-200 hover:text-blue-800 truncate'}
                                onClick={()=> onClick('fontSize', size + 'px')}
                                style={{fontSize: size + 'px', minHeight: (size + 5) + 'px'}}
                        >
                            {value !== '' ? value : size + 'px'}
                        </button>
                    )
                })
            }
        </div>
    )
}

export default MenuFontsizeItem;
