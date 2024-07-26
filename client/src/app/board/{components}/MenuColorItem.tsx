import {ToggleEnum} from "@/app/board/{components}/SubTextMenu";
import {useMemo} from "react";

export type MenuSubItemProps = {
    toggle: ToggleEnum;
    menuTitle: string;
    name: 'color' | 'backgroundColor';
    onClick: (name: ToggleEnum, value: string) => void;
}

const MenuColorItem = ({
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
        <div className={`absolute z-30 flex flex-col justify-left items-center w-20 bg-white duration-300 overflow-y-scroll shadow ${toggle === name ? 'max-h-80' : 'max-h-0'}`}>
            { colorSets }
        </div>
    )
}

export default MenuColorItem;

const colorSet  = [
    {color: '#FFFFFF', dark: false},

    {color: '#FFEAFE', dark: false},
    {color: '#FFC5FD', dark: false},
    {color: '#FF9BFD', dark: false},
    {color: '#FF66FE', dark: false},
    {color: '#CA19C7', dark: true},
    {color: '#A719A4', dark: true},
    {color: '#7D1679', dark: true},
    {color: '#550A53', dark: true},

    {color: '#FFF2DE', dark: false},
    {color: '#FFCE8A', dark: false},
    {color: '#FF9800', dark: false},
    {color: '#E68900', dark: false},
    {color: '#CB7900', dark: false},
    {color: '#B16800', dark: true},
    {color: '#9A5B00', dark: true},
    {color: '#834D00', dark: true},
    {color: '#663D00', dark: true},

    {color: '#FAFABE', dark: false},
    {color: '#DDE200', dark: false},
    {color: '#C3C500', dark: false},
    {color: '#909200', dark: true},
    {color: '#7C7F00', dark: true},
    {color: '#636600', dark: true},
    {color: '#4C4F00', dark: true},

    {color: '#F2FFD4', dark: false},
    {color: '#DCFF8C', dark: false},
    {color: '#BAFF1A', dark: false},
    {color: '#A8E718', dark: false},
    {color: '#97C926', dark: true},
    {color: '#7CA61B', dark: true},
    {color: '#638418', dark: true},
    {color: '#4F6220', dark: true},
    {color: '#37421D', dark: true},

    {color: '#D6FFEA', dark: false},
    {color: '#B2FFD9', dark: false},
    {color: '#76FFBA', dark: false},
    {color: '#00FF80', dark: false},
    {color: '#00DE6F', dark: true},
    {color: '#00C160', dark: true},
    {color: '#009E4E', dark: true},
    {color: '#006A36', dark: true},
    {color: '#004422', dark: true},

    {color: '#D8FFFF', dark: false},
    {color: '#94FEFF', dark: false},
    {color: '#33E1DE', dark: false},
    {color: '#00C4C1', dark: true},
    {color: '#00AFAE', dark: true},
    {color: '#008986', dark: true},
    {color: '#006262', dark: true},
    {color: '#004444', dark: true},

    {color: '#F3E7FF', dark: false},
    {color: '#CE9CFF', dark: false},
    {color: '#BB78FF', dark: false},
    {color: '#AB58FF', dark: true},
    {color: '#9226FF', dark: true},
    {color: '#7900F3', dark: true},
    {color: '#5700AE', dark: true},
    {color: '#37006F', dark: true},

    {color: '#D6D6D6', dark: false},
    {color: '#BBBBBB', dark: false},
    {color: '#AEAEAE', dark: false},
    {color: '#939393', dark: true},
    {color: '#787878', dark: true},
    {color: '#5D5D5D', dark: true},
    {color: '#353535', dark: true},
    {color: '#000000', dark: true},
]
