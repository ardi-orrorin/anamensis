import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {faEllipsisVertical} from "@fortawesome/free-solid-svg-icons";
import {useContext, useEffect, useRef, useState} from "react";
import BoardProvider from "@/app/board/{services}/BoardProvider";
import useSWR from "swr";
import apiCall from "@/app/{commons}/func/api";
import {BoardTemplate} from "@/app/board/{services}/types";


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

    const { mutate } = useSWR('/api/board-template', () =>
        apiCall<TemplateList[]>({
            path: '/api/board-template',
            method: 'GET',
            isReturnData: true,
        })
        .then((data) => {
            setTemplates(data);
        })
    );


    const openTemplateMenu = () => {
        if(!ref?.current) return ;
        mutate();
        const {left, bottom} = ref.current.getClientRects()[0];

        setOpen({
            clientX: left,
            clientY: bottom + 5,
            open: true
        });
    }

    // todo: extra 존재 여부에 따른 적용 처리
    const onChangeTemplate = async (id: number) => {
        try{
            const res = await apiCall<BoardTemplate>({
                path: '/api/board-template/' + id,
                method: 'GET',
                isReturnData: true
            })

            // fixme: extra 존재 여부에 따른 적용 처리
            setBoard({
                ...board,
                data: {
                    ...board.data,
                    content: res.content,
                    isPublic: res.isPublic,
                    membersOnly: res.membersOnly
                }
            })

        } catch (e) {
            console.log(e)
        }
    }

    return (
        <>
            <button className={[
                        'w-16 rounded h-full border-2 py-1 px-3 text-xs duration-300 whitespace-pre',
                        board?.data?.membersOnly
                            ? 'text-red-600 border-red-200 hover:bg-red-200 hover:text-white'
                            : 'text-blue-600 border-blue-200 hover:bg-blue-200 hover:text-white'
                    ].join(' ')}
                    ref={ref}
                    onClick={openTemplateMenu}
            >
                <FontAwesomeIcon icon={faEllipsisVertical} />
            </button>
            {
                open.open
                && <>
                    <ul className={'z-20 p-1 fixed flex flex-col gap-1 border border-solid border-gray-300 bg-white shadow-md'}
                           style={{top: open.clientY, left: open.clientX}}
                           onClick={() => setOpen({clientX: 0, clientY: 0, open: false})}
                    >
                        {
                            templates.sort((a, b) => a.id - b.id)
                                .map((template) => {
                                return (
                                    <button key={'template' + template.id}
                                            className={'w-60 p-1 flex text-sm hover:bg-gray-400 hover:text-white duration-300'}
                                            onClick={()=> onChangeTemplate(template.id)}
                                    >
                                        <span className={'text-start line-clamp-1'}>
                                            {template.name}
                                        </span>
                                    </button>
                                )}
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

export default TemplateMenu;