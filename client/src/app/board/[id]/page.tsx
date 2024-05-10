'use client';

import axios, {AxiosResponse} from "axios";
import Block from "@/app/board/{components}/Block";
import {ChangeEvent, useCallback, useEffect, useRef, useState} from "react";

export interface BoardI {
    id: string;
    title: string;
    content: BoardContentI;
    writer: string;
    createdAt: string;
}
interface BoardContentI {
    list: BoardContentI[];
    [key: string]: any;
}

type OpenMenuProps = {
    open: boolean;
    seq: number;
}

export default function Page({params}: {params : {id: string}}) {
    const [data, setData] = useState<BoardI>();
    const [isView, setIsView] = useState<boolean>(true);
    const [openMenu, setOpenMenu] = useState<OpenMenuProps>({
        open: false,
        seq: 0
    });

    const blockRef = useRef<HTMLElement[] | null[]>([]);

    useEffect(() => {
        const list = data?.content?.list ;
        if (!list) return ;
        blockRef.current[list.length - 1]?.focus();

        console.log('list.length', list);
    },[data?.content.list.length]);

    useEffect(() => {
        axios.get('/api/board/' + params.id)
            .then((res: AxiosResponse<BoardI>) => {
                setData(res.data);
            });
    },[]);

    const addBlockHandler = useCallback((seq: number) => {
        const list = data?.content?.list;

        if (!list) return ;

        const currentBlock = list.find(item => item.seq === seq)!;

        if(currentBlock.value === '') return ;

        const blockInit = { seq: seq + 0.1, value: '', bg: '', code: '', color: '', size: '', text: '' };

        list.push(blockInit as any)

        list.sort((a, b) => a.seq - b.seq)
            .map((item, index) => {
                item.seq = index;
                return item;
        });

        setData({...data, content: {list: list}});
    },[data]);

    const onChangeHandler = useCallback((e: ChangeEvent<HTMLInputElement>, seq: number) => {
        const list = data?.content?.list;
        if (!list) return ;

        list.map((item, index) => {
            if (item.seq === seq) {
                item.value = e.target.value;
            }
            return item;
        });
        setData({...data, content: {list: list}});
    },[data]);

    const editClickHandler = () => {
        setIsView(!isView);
    }

    const openMenuToggle  = (seq: number) => {
        if(openMenu.open && openMenu.seq === seq) {
            setOpenMenu({open: false, seq: 0});
            return ;
        }
        setOpenMenu({open: true, seq: seq});
        // todo: 블록 타입 변견
    }

    const onKeyUpHandler = (e: React.KeyboardEvent<HTMLElement>, seq: number) => {
        const list = data?.content?.list;

        if (!list) return ;

        if(e.key !== 'Enter') return;

        if(!list[seq + 1]) {
            addBlockHandler(seq);
        }
        blockRef.current[seq + 1]?.focus();
    }

    const onKeyDownHandler = (e: React.KeyboardEvent<HTMLElement>, seq: number) => {
        if(e.key !== 'Backspace') return;
        const list = data?.content?.list;
        if (!list) return ;

        const currentBlock = list.find(item => item.seq === seq)!;

        if(seq === 0 && currentBlock.value === '') {
            const newList = list.map((item, index) => {
                if (item.seq !== 0) return item;
                return {seq: 0, value: '', bg: '', code: '', color: '', size: '', text: ''};
            });
            setData({...data, content: {list: newList as BoardContentI[]}});
        }

        if(currentBlock.value !== '' || seq === 0) return ;

        const newList = list.filter(item => item.seq !== seq)
            .sort((a, b) => a.seq - b.seq)
            .map((item, index) => {
                item.seq = index;
                return item;
            });

        setData({...data, content: {list: newList}});

        blockRef.current[seq - 1]?.focus();
    }


    return (
        <div className={'p-5 flex justify-center'}>
            <div className={'w-full lg:w-2/3 xl:w-1/2 flex flex-col gap-6 duration-500'}>
                <div className={'h-12 border-b-4 border-solid border-blue-200 flex justify-between items-center px-4'}>
                    <div className={'font-bold'}>
                        제목
                    </div>
                    <div>
                        <button className={'rounded border-2 border-blue-200 hover:bg-blue-200 hover:text-white py-1 px-3 text-sm duration-300'}
                                onClick={editClickHandler}
                        >
                            수정
                        </button>
                        <button className={'rounded border-2 border-blue-200 hover:bg-blue-200 hover:text-white py-1 px-3 text-sm duration-300'}>
                            공유
                        </button>
                    </div>

                </div>
                <div className={'min-h-80 flex flex-col gap-3'}>
                    {
                        data?.content && data.content?.list && data.content.list?.length > 0 &&
                        data.content.list.map((item, index) =>
                            <Block key={index}
                                   blockRef={blockRef}
                                   seq={item.seq}
                                   value={item['value']}
                                   bg={item['bg']}
                                   code={item['code']}
                                   color={item['color']}
                                   isView={isView}
                                   openMenu={openMenu.open && Number(openMenu.seq) === Number(item.seq)}
                                   openMenuToggle={() => {openMenuToggle(item.seq)}}
                                   onChangeHandler={e => {onChangeHandler(e, item.seq)}}
                                   onKeyDownHandler={e=> {onKeyDownHandler(e, item.seq)}}
                                   onKeyUpHandler={e=> {onKeyUpHandler(e, item.seq)}}
                                   setValue={e=>{}}
                                   onClickAddHandler={()=> {addBlockHandler(item.seq)}}
                                   size={item['size']}
                                   text={item['text']}
                            />
                        )
                    }
                </div>
                <div>

                </div>
            </div>
        </div>
    )
}
