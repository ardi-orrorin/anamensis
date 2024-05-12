'use client';

import axios, {AxiosResponse} from "axios";
import Block from "@/app/board/{components}/Block";
import {ChangeEvent, useCallback, useEffect, useMemo, useRef, useState} from "react";
import GlobalLoadingSpinner from "@/app/{commons}/GlobalLoadingSpinner";
import {HtmlElements} from "@/app/{components}/block/type/Types";

export interface BoardI {
    id: string;
    categoryPk: number;
    title: string;
    content: BoardContentI;
    writer: string;
    createdAt: string;
}
export interface BoardContentI {
    list: BlockI[];
    [key: string]: any;
}

export interface BlockI {
    seq: number;
    value: string;
    bg: string;
    code: string;
    color: string;
    size: string;
    text: string;
}

type OpenMenuProps = {
    open: boolean;
    seq: number;
}

export default function Page({params}: {params : {id: string}}) {
    const [data, setData] = useState<BoardI>({} as BoardI);
    const [loading, setLoading] = useState<boolean>(false);
    const [isView, setIsView] = useState<boolean>(true);
    const [openMenu, setOpenMenu] = useState<OpenMenuProps>({
        open: false,
        seq: 0
    });

    const blockRef = useRef<HTMLElement[] | null[]>([]);
    const isNewBoard = useMemo(() => !params.id || params.id === 'new',[params.id]);

    useEffect(() => {
        if(!isNewBoard) return ;
        const list = [addBlock(0, true)];
        setData({...data, content: {list: list}, categoryPk: 2, title: '', writer: ''});
        setIsView(false);
    },[params.id]);

    useEffect(() => {
        if(isNewBoard) return ;
        setLoading(true);
        axios.get('/api/board/' + params.id)
            .then((res: AxiosResponse<BoardI>) => {
                setData(res.data);
            })
            .finally(() => {
                setLoading(false);
            });
    },[params.id]);

    useEffect(() => {
        const list = data?.content?.list ;
        if (!list) return ;
        blockRef.current[list.length - 1]?.focus();
    },[data?.content?.list.length]);

    const addBlock = useCallback((seq: number, init: boolean) => {
        const block = {seq: 0, value: '', bg: '', code: '00005', color: '', size: '', text: '' };
        if(!init) {
            block.seq = seq + 0.1;
        }
        return block;
    },[]);

    const validation = useCallback(() => {
        const title = data.title !== '';
        const content = data.content.list.filter(item => item.value !== '').length > 0;
        return title && content;
    },[data]);

    if(loading) return <GlobalLoadingSpinner />;

    const submitHandler = async (isSave: boolean) => {
        console.log(data)
        if(!validation()) {
            alert('내용을 입력해주세요');
            return ;
        }
        setLoading(true);
        let result = null;
        try {
            if(isSave) {
                result = await axios.post('/api/board/new', data, {
                    headers: {
                        'Content-Type': 'application/json',
                    }
                })
            } else {
                result = await axios.put('/api/board/' + params.id, data, {
                    headers: {
                        'Content-Type': 'application/json',
                    }
                });
            }
        } catch (e) {
            alert('저장에 실패했습니다.');
        } finally {
            if(isSave) {
                location.href = '/board/' + result?.data?.id;
            } else {
                location.reload();
            }

        }
    };

    const deleteHandler = async () => {
        setLoading(true);
        try {
            await axios.delete('/api/board/' + params.id);
        } catch (e) {
            console.log(e);
        } finally {
            location.href = '/board';
        }
    };

    const addBlockHandler = (seq: number) => {
        const list = data?.content?.list;
        if (!list) return ;

        const currentBlock = list.find(item => item.seq === seq)!;

        if(currentBlock.value === '') return ;

        list.push(addBlock(seq, false));

        list.sort((a, b) => a.seq - b.seq)
            .map((item, index) => {
                item.seq = index;
                return item;
        });

        setData({...data, content: {list: list}});
    };

    const onChangeHandler = (e: ChangeEvent<HtmlElements>, seq: number) => {
        const list = data?.content?.list;
        if (!list) return ;

        list.map((item, index) => {
            if (item.seq === seq) {
                item.value = e.target.value;
            }
            return item;
        });
        setData({...data, content: {list: list}});
    };

    const editClickHandler = () => {
        setIsView(!isView);
    }

    const openMenuToggle  = (seq: number, code: string) => {
        console.log('openMenuToggle', openMenu.open, seq, code)
        if(openMenu.open && openMenu.seq === seq) {
            setOpenMenu({open: false, seq: 0});
            if(code && code !== '') {

                const list = data?.content?.list;
                if (!list) return ;
                const newList = list.map((item, index) => {
                    if (item.seq === seq) {
                        item.code = code;
                    }
                    return item;
                });
                setData({...data, content: {list: newList}});
            }
            return ;
        }
        setOpenMenu({open: true, seq: seq});
        // todo: 블록 타입 변견
    }

    const onChangeTitleHandler = (e: ChangeEvent<HTMLInputElement>) => {
        if(e.target.name !== 'title') return ;
        setData({...data, title: e.target.value});
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
            setData({...data, content: {list: newList}});
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
                <div className={'flex justify-between gap-2 h-auto border-b-4 border-solid border-blue-200 py-3'}>
                    <div className={'font-bold flex items-center w-full'}>
                        {
                            !isView &&
                            <input className={'w-full text-lg p-2 bg-gray-50 focus:bg-blue-50 hover:bg-blue-50 outline-0 rounded'}
                                   name={'title'}
                                   value={data.title}
                                   onChange={onChangeTitleHandler}
                                   placeholder={'제목을 입력하세요'}
                            />
                        }
                        {
                            !isNewBoard && isView &&
                            <span className={'w-full text-lg py-2'}>{data.title}</span>
                        }
                    </div>
                    {
                        !isNewBoard &&
                        <div className={'w-auto flex gap-1 justify-end'}>
                          {
                              !isView &&
                            <button className={'w-16 rounded h-full border-2 border-blue-200 hover:bg-blue-200 hover:text-white py-1 px-3 text-sm duration-300'}
                                    onClick={()=>submitHandler(false)}
                            >
                              저장
                            </button>
                          }
                          <button className={'w-16 rounded h-full border-2 border-blue-200 hover:bg-blue-200 hover:text-white py-1 px-3 text-sm duration-300'}
                                  onClick={editClickHandler}
                          >
                              {
                                  isView ? '수정' : '취소'
                              }
                          </button>
                            {
                                !isView &&
                                <button className={'w-16 rounded h-full border-2 border-red-200 hover:bg-red-200 hover:text-white py-1 px-3 text-sm duration-300'}
                                        onClick={deleteHandler}
                                >
                                    삭제
                                </button>
                            }
                            {
                                isView &&
                                <button className={'w-16 rounded border-2 border-blue-200 hover:bg-blue-200 hover:text-white py-1 px-3 text-sm duration-300'}>
                                  공유
                                </button>
                            }

                        </div>
                    }
                </div>
                <div className={'flex flex-col'}>
                    {
                        data && data.content && data.content.list && data.content.list.length > 0 &&
                        data.content.list.map((item, index) =>
                            <Block key={index}
                                   blockRef={blockRef}
                                   seq={item.seq}
                                   value={item.value}
                                   bg={item.bg}
                                   code={item.code}
                                   color={item.color}
                                   isView={isView}
                                   openMenu={openMenu.open && Number(openMenu.seq) === Number(item.seq)}
                                   openMenuToggle={({label, code}) => {openMenuToggle(item.seq, code)}}
                                   onChangeHandler={e => {onChangeHandler(e, item.seq)}}
                                   onKeyDownHandler={e=> {onKeyDownHandler(e, item.seq)}}
                                   onKeyUpHandler={e=> {onKeyUpHandler(e, item.seq)}}
                                   setValue={e=>{}}
                                   onClickAddHandler={()=> addBlockHandler(item.seq)}
                                   size={item.size}
                                   text={item.text}
                            />
                        )
                    }
                </div>
                <div>
                    {
                      isNewBoard &&
                      <div className={'flex gap-1 justify-end'}>
                        <button className={'w-full rounded h-full border-2 border-blue-200 hover:bg-blue-200 hover:text-white py-1 px-3 text-sm duration-300'}
                                onClick={()=>submitHandler(true)}
                        >
                          작성
                        </button>
                      </div>
                    }
                </div>
            </div>
        </div>
    )
}
