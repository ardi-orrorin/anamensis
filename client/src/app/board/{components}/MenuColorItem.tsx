import {ToggleEnum} from "@/app/board/{components}/SubTextMenu";
import {useMemo} from "react";
import {colorSet} from "@/app/{services}/constants";

export type MenuSubItemProps = {
    className?: string;
    toggle: ToggleEnum;
    menuTitle: string;
    name: 'color' | 'backgroundColor';
    onClick: (name: ToggleEnum, value: string) => void;
}

const MenuColorItem = ({
    className,
    toggle,
    menuTitle,
    name,
    onClick
}: MenuSubItemProps) => {

    const colorSets = useMemo(() =>
        colorSet.map((color, index) => {
            let style = {}
            if(name === 'color') {
                style = {
                    [name]: color.color,
                    backgroundColor: color.dark ? '#FFFFFF' : '#555555'
                }
            } else {
                style = {
                    [name]: color.color,
                    color: color.dark ? '#FFFFFF' : '#555555'
                }
            }
            return (
                <button key={'fontColor' + index}
                        className={'w-full text-sm text-center tracking-wider p-2 duration-300 hover:bg-blue-200 hover:text-blue-800'}
                        style={style}
                        onClick={()=> onClick(name, color.color)}
                >
                    {menuTitle}
                </button>
            )
        })
    ,[onClick]);

    return (
        <div className={[
            `absolute z-30 flex flex-col justify-left items-center w-20 bg-white duration-300 overflow-y-scroll shadow`,
            toggle === name ? 'max-h-80' : 'max-h-0',
            className,
        ].join(' ')}>
            { colorSets }
        </div>
    )
}

export default MenuColorItem;
