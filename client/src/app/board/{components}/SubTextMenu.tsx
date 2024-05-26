import React, {useContext} from "react";
import {faBold, faItalic, faTextSlash} from "@fortawesome/free-solid-svg-icons";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import BlockProvider from "@/app/board/{services}/BlockProvider";
import {TextStylesType} from "@/app/board/{services}/types";
import {faXmark} from "@fortawesome/free-solid-svg-icons/faXmark";
import BoardProvider from "@/app/board/{services}/BoardProvider";

const SubTextMenu = ({
    isView,
}: {
    isView    : boolean;
}) => {
    if(isView) return <></>
    const {blockService, setBlockService} = useContext(BlockProvider);
    const {board, setBoard} = useContext(BoardProvider);

    if(!blockService.block) return <></>
    const {seq, code, value, textStyle} = blockService.block;

    if(!textStyle) return <></>
    const buttonStyle = 'py-2 px-3 h-full hover:bg-blue-50 hover:text-black duration-300 outline-0 '

    const selectChangeHandler = (e: React.ChangeEvent<HTMLSelectElement>) => {
        onClickSubTextMenu(e.target.name, e.target.value)
    }

    const selectFontStyle = (type: string, value:string) => {
        value = textStyle[type] === value ? '' : value;
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
    }

    return (
        <div className={`fixed bg-gray-100 z-20 w-auto max-h-52 duration-200 rounded shadow-md`}
             style={{top: blockService.screenY, left: blockService.screenX}}
        >
            <ul className={'flex overflow-hidden rounded text-sm bg-white'}>
                <li>
                    <select className={buttonStyle + (textStyle.fontSize && textStyle.fontSize !== '' ?  'bg-blue-400 text-white' : 'bg-white')}
                            value={textStyle.fontSize ?? ''}
                            name={'fontSize'}
                            onChange={selectChangeHandler}
                    >
                        <option value={''}>글자크기</option>
                        {
                            fontSize.map((size, index) => {
                                return (
                                    <option key={'fontSize' + index}
                                            value={size ?? ''}
                                    >{size}
                                    </option>
                                )
                            })
                        }
                    </select>
                </li>
                <li>
                   <select className={buttonStyle + (textStyle.color && textStyle.color !== '' ?  'bg-blue-400 text-white' : 'bg-white')}
                           name={'color'}
                           value={textStyle.color ?? ''}
                           onChange={selectChangeHandler}
                   >
                       <option value={''}>글자색</option>
                       {
                           colorSet.map((color, index) => {
                               return (
                                   <option key={'fontColor' + index}
                                           value={color}
                                   >{color}
                                   </option>
                               )
                           })
                       }
                   </select>
                </li>
                <li>
                    <select className={buttonStyle + (textStyle.backgroundColor && textStyle.backgroundColor !== '' ?  'bg-blue-400 text-white' : 'bg-white')}
                            name={'backgroundColor'}
                            value={textStyle.backgroundColor ?? ''}
                            onChange={selectChangeHandler}
                    >
                        <option value={''}>배경색</option>
                        {
                            colorSet.map((color, index) => {
                                return (
                                    <option key={'backgroundColor' + index}
                                            value={color}
                                    >{color}
                                    </option>
                                )
                            })
                        }
                    </select>
                </li>
                {
                    fontStyle.map((style, index) => {
                        return (
                            <li key={'fontStyle' + index}>
                                <button className={buttonStyle + (textStyle[style.style] === style.value ? 'bg-blue-400 text-white' : 'bg-white')}
                                        onClick={() => selectFontStyle(style.style, style.value)}
                                >
                                    <FontAwesomeIcon icon={style.icon} />
                                </button>
                            </li>
                        )
                    })
                }
                <li>
                    <button className={['min-w-16',buttonStyle + (Object.keys(textStyle).length > 0 ? 'bg-blue-400 text-white' : 'bg-white')].join(' ')}
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

const fontSize = ['10px','12px','14px','16px','18px','20px','24px','32px','40px','48px','64px','80px','100px'];

const colorSet  = ['red','blue','green','yellow','orange','purple','black','white'];

export default SubTextMenu;