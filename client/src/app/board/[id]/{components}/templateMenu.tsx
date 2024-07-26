import {useContext, useRef, useState} from "react";
import BoardProvider from "@/app/board/{services}/BoardProvider";
import useSWR from "swr";
import apiCall from "@/app/{commons}/func/api";
import {BoardTemplate} from "@/app/board/{services}/types";
import {blockTypeList} from "@/app/board/{components}/block/list";
import {StatusResponse} from "@/app/{commons}/types/commons";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {faXmark} from "@fortawesome/free-solid-svg-icons/faXmark";
import LoadingSpinner from "@/app/{commons}/LoadingSpinner";


type TemplateMenuOpenProps = {
    clientX: number;
    clientY: number;
    open: boolean;
}

export type TemplateList = {
    id: number;
    name: string;
}

const TemplateMenu = () => {

    const {board, setBoard} = useContext(BoardProvider);
    const [templates, setTemplates] = useState([] as TemplateList[]);
    const [open, setOpen] = useState({} as TemplateMenuOpenProps);
    const ref = useRef<HTMLButtonElement>(null);
    const [loading, setLoading] = useState(false);

    const { mutate } = useSWR('/api/board-template', async () => {
        setLoading(true);
        await apiCall<TemplateList[]>({
            path: '/api/board-template',
            method: 'GET',
            isReturnData: true,
        })
        .then((data) => {
            setTemplates(data);
        })
        .finally(() => {
            setLoading(false);
        })
    }, {
        revalidateOnFocus: false,
        revalidateOnReconnect: false,
        revalidateIfStale: false,
    });


    const openTemplateMenu = async () => {
        if(!ref?.current) return ;
        await mutate();
        const {left, bottom} = ref.current.getClientRects()[0];

        setOpen({
            clientX: left - 135,
            clientY: bottom + 5,
            open: true
        });
    }

    const onChangeTemplate = async (id: number) => {
        setLoading(true);
        try{
            const res = await apiCall<BoardTemplate>({
                path: '/api/board-template/' + id,
                method: 'GET',
                isReturnData: true
            })

            const isExtraObj = blockTypeList.find(item =>
                item.code === board.data.content.list[0].code)
                ?.type === 'extra';

            const list = isExtraObj
                    ? [board.data.content.list[0], ...res.content.list]
                    : [...res.content.list];

            const reFormList = list.map((item, index) => {
                const hash = Date.now() + '-' + index;
                return {...item, seq: index, hash};
            })

            setBoard({
                ...board,
                data: {
                    ...board.data,
                    content: {
                        ...board.data.content,
                        list: reFormList
                    },
                    isPublic: res.isPublic,
                    membersOnly: res.membersOnly
                }
            })
        } catch (e) {
            console.log(e)
        } finally {
            await mutate();
            setLoading(false);
        }
    }

    const onRemoveTemplate = async (id: number) => {
        setLoading(true);
        try {
            const res = await apiCall<StatusResponse>({
                path: '/api/board-template/' + id,
                method: 'DELETE',
                isReturnData: true
            })

            res.status === 'SUCCESS'
            && await mutate();
        } catch (e) {
            console.log(e)
        } finally {
            setLoading(false);
        }
    }

    return (
        <>
            <button className={[
                        'min-w-16 rounded h-full border-2 py-1 px-3 flex justify-center items-center text-sm duration-300 whitespace-pre tracking-widest',
                        templates.length > 0
                            ? 'text-blue-600 border-blue-200 hover:bg-blue-200 hover:text-white'
                            : 'text-red-600 border-red-200 hover:bg-red-200 hover:text-white'
                    ].join(' ')}
                    ref={ref}
                    onClick={openTemplateMenu}
                    disabled={loading}
            >
                {
                    loading
                    ? <LoadingSpinner size={20} />
                    : `TP(${templates.length})`
                }
            </button>
            {
                open.open
                && templates.length > 0
                && <>
                    <ul className={'z-20 p-1 fixed flex flex-col gap-1 border border-solid border-gray-300 bg-white shadow-md'}
                           style={{top: open.clientY, left: open.clientX}}
                           onClick={() => setOpen({clientX: 0, clientY: 0, open: false})}
                    >
                        {
                            templates.sort((a, b) => a.id - b.id)
                                .map((template) => {
                                    return (
                                        <Item key={'template' + template.id}
                                              id={template.id}
                                              name={template.name}
                                              onChangeTemplate={onChangeTemplate}
                                              onRemoveTemplate={onRemoveTemplate}
                                        />
                                    )
                                }
                            )
                        }
                    </ul>
                    <div className={'z-10 fixed w-full h-full'}
                         onClick={() => setOpen({clientX: 0, clientY: 0, open: false})}
                    ></div>
                </>
            }
        </>
    )
}

const Item = ({
    id,
    name,
    onChangeTemplate,
    onRemoveTemplate
}:{
    id: number,
    name: string,
    onChangeTemplate: (id: number) => void,
    onRemoveTemplate: (id: number) => void
}) => {
    return (
        <div className={'w-80 p-1 flex gap-5 justify-between text-sm hover:bg-gray-400 hover:text-white duration-300'}>
            <button className={'w-full'}
                    onClick={()=> onChangeTemplate(id)}
            >
                <span className={'text-start line-clamp-1'}>
                    {name}
                </span>
            </button>
            <button className={'px-4 py-1 bg-gray-200 rounded'}
                    onClick={()=>onRemoveTemplate(id)}
            >
                <FontAwesomeIcon icon={faXmark} />
            </button>
        </div>
    )
}

export default TemplateMenu;