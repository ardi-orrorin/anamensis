'use client';

import axios, {AxiosResponse} from "axios";
import Block from "@/app/board/{components}/Block";
import {ChangeEvent, useCallback, useEffect, useMemo, useRef, useState} from "react";
import GlobalLoadingSpinner from "@/app/{commons}/GlobalLoadingSpinner";
import {HtmlElements} from "@/app/{commons}/{components}/block/type/Types";
import {BoardI} from "@/app/board/{services}/types";
import {blockTypeList} from "@/app/{commons}/{components}/block/list";
import BlockProvider, {BlockService} from "@/app/board/{services}/BlockProvider";
import BoardProvider, {BoardService} from "@/app/board/{services}/BoardProvider";
import {faDownLeftAndUpRightToCenter, faUpRightAndDownLeftFromCenter} from "@fortawesome/free-solid-svg-icons";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";

export default function Page({params}: {params : {id: string}}) {

    const [board, setBoard] = useState<BoardService>({} as BoardService);

    const [loading, setLoading] = useState<boolean>(false);

    const [fullScreen, setFullScreen] = useState<boolean>(false);

    const [blockService, setBlockService] = useState<BlockService>({} as BlockService);

    const blockRef = useRef<HTMLElement[] | null[]>([]);

    const isNewBoard = useMemo(() => !params.id || params.id === 'new',[params.id]);

    const defaultBlock = useMemo(()=>(
        {seq: 0, value: '', code: '00005', textStyle: {}}
    ),[]);
    const shortList = useMemo(()=> (
        blockTypeList.map(item => ({ command: item.command, code: item.code}))
    ), []);

    useEffect(() => {
        if(!isNewBoard) return ;
        const list = [addBlock(0, true)];
        setBoard({
            ...board,
            data: {
                ...board.data,
                content: {list},
                categoryPk: 2,
                title: '', writer: ''
            },
            isView: false
        });
    },[params.id]);

    useEffect(() => {
        if(isNewBoard) return ;
        setLoading(true);
        axios.get('/api/board/' + params.id)
            .then((res: AxiosResponse<BoardI>) => {
                setBoard({
                    ...board,
                    data: res.data,
                    isView: true
                });
            })
            .finally(() => {
                setLoading(false);
            });
    },[params.id]);

    useEffect(() => {
        const list = board.data?.content?.list;
        if (!list) return ;
        blockRef.current[list.length - 1]?.focus();
    },[board.data?.content?.list.length])

    const addBlock = useCallback((seq: number, init: boolean) => {
        const block = {...defaultBlock};
        if(!init) {
            block.seq = seq + 0.1;
        }
        return block;
    },[]);

    const validation = useCallback(() => {
        const title = board.data.title !== '';
        const content = board.data.content.list.filter(item => item.value !== '').length > 0;
        return title && content;
    },[board.data]);

    const onChangeBlockHandler = useCallback((e: ChangeEvent<HtmlElements>, seq: number) => {
        const block = shortList.find(item => item.command + ' ' === e.target.value);
        if(!block) return false;
        const newList = board.data?.content?.list.map((item, index) => {
            if (item.seq === seq) {
                item.code = block.code;
                item.value = '';
            }
            return item;
        });
        setBoard({...board, data: {...board.data, content: {list: newList}}});
        return true;
    },[board.data]);

    if(loading) return <GlobalLoadingSpinner />;

    const submitHandler = async (isSave: boolean) => {
        if(!validation()) {
            alert('내용을 입력해주세요');
            return ;
        }
        setLoading(true);
        let result = null;
        try {
            if(isSave) {
                result = await axios.post('/api/board/new', board.data, {
                    headers: {
                        'Content-Type': 'application/json',
                    }
                })
            } else {
                result = await axios.put('/api/board/' + params.id, board.data, {
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
        const list = board.data?.content?.list;
        if (!list) return ;

        const currentBlock = list.find(item => item.seq === seq)!;

        if(currentBlock.value === '') return ;

        list.push(addBlock(seq, false));

        list.sort((a, b) => a.seq - b.seq)
            .map((item, index) => {
                item.seq = index;
                return item;
        });
        setBoard({...board, data: {...board.data, content: {list: list}}});
    };

    const onChangeHandler = (e: ChangeEvent<HtmlElements>, seq: number) => {
        const list = board.data?.content?.list;
        if (!list) return ;

        if(onChangeBlockHandler(e, seq)) return ;

        list.map((item, index) => {
            if (item.seq === seq) {
                item.value = e.target.value;
            }
            return item;
        });

        setBoard({...board, data: {...board.data, content: {list: list}}});
    };

    const editClickHandler = () => {
        setBoard({...board, isView: !board.isView});
    }

    const onChangeTitleHandler = (e: ChangeEvent<HTMLInputElement>) => {
        if(e.target.name !== 'title') return ;
        setBoard({...board, data: {...board.data, title: e.target.value}});
    }

    const onKeyUpHandler = (e: React.KeyboardEvent<HTMLElement>, seq: number) => {
        const list = board.data?.content?.list;

        if (!list) return ;

        if(e.key !== 'Enter') return;

        if(!list[seq + 1]) {
            addBlockHandler(seq);
        }

        blockRef.current[seq + 1]?.focus();
    }

    const onKeyDownHandler = (e: React.KeyboardEvent<HTMLElement>, seq: number) => {
        if(e.key !== 'Backspace') return;
        const list = board.data?.content?.list;
        if (!list) return ;

        const currentBlock = list.find(item => item.seq === seq)!;

        if(seq === 0 && currentBlock.value === '') {
            const newList = list.map((item, index) => {
                if (item.seq !== 0) return item;
                return addBlock(0, true);
            });
            setBoard({...board, data: {...board.data, content: {list: newList}}});
        }

        if(currentBlock.value !== '' || seq === 0) return ;

        const newList = list.filter(item => item.seq !== seq)
            .sort((a, b) => a.seq - b.seq)
            .map((item, index) => {
                item.seq = index;
                return item;
            });

        setBoard({...board, data: {...board.data, content: {list: newList}}});
        blockRef.current[seq - 1]?.focus();
    }

    return (
        <BoardProvider.Provider value={{board, setBoard}}>
            <div className={'p-5 flex justify-center'}>
                <div className={`w-full flex flex-col gap-6 duration-700 ${fullScreen || 'lg:w-2/3 xl:w-1/2'}`}>
                    <div className={'flex justify-between gap-2 h-auto border-b-2 border-solid border-blue-200 py-3'}>
                        <div className={'font-bold flex items-center w-full'}>
                            {
                                !board.isView && board.data &&
                                <input className={'w-full text-lg p-1 bg-gray-50 focus:bg-blue-50 hover:bg-blue-50 outline-0 rounded'}
                                       name={'title'}
                                       value={board.data?.title}
                                       onChange={onChangeTitleHandler}
                                       placeholder={'제목을 입력하세요'}
                                />
                            }
                            {
                                !isNewBoard && board.isView &&
                                <span className={'w-full text-lg px-4 py-1'}
                                >{board.data.title}</span>
                            }
                        </div>
                        {
                            !isNewBoard &&
                            <div className={'w-auto flex gap-1 justify-end'}>
                              {
                                  !board.isView &&
                                  <button className={'w-16 rounded h-full border-2 border-blue-200 text-blue-400 hover:bg-blue-200 hover:text-white py-1 px-3 text-sm duration-300'}
                                          onClick={()=>submitHandler(false)}
                                  >저장
                                  </button>
                              }
                              <button className={'w-16 rounded h-full border-2 border-blue-200 text-blue-400 hover:bg-blue-200 hover:text-white py-1 px-3 text-sm duration-300'}
                                      onClick={editClickHandler}
                              >{board.isView ? '수정' : '취소'}
                              </button>
                              {
                                  !board.isView &&
                                  <button className={'w-16 rounded h-full border-2 border-red-200 text-red-400 hover:bg-red-200 hover:text-white py-1 px-3 text-sm duration-300'}
                                          onClick={deleteHandler}
                                  >삭제
                                  </button>
                              }
                              {
                                  board.isView &&
                                  <button className={'w-16 rounded border-2 border-blue-200 text-blue-400 hover:bg-blue-200 hover:text-white py-1 px-3 text-sm duration-300'}
                                  >공유
                                  </button>
                              }
                            </div>
                        }
                        <div>
                            <button className={'w-14 rounded h-full border-2 border-blue-200 hover:bg-blue-200 hover:text-white py-1 px-3 text-sm duration-300'}
                                    onClick={()=> setFullScreen(!fullScreen)}>
                                {
                                    fullScreen
                                    ? <FontAwesomeIcon icon={faDownLeftAndUpRightToCenter} className={'text-blue-400'} />
                                    : <FontAwesomeIcon icon={faUpRightAndDownLeftFromCenter} className={'text-blue-400'} />
                                }
                            </button>
                        </div>
                    </div>
                    <BlockProvider.Provider value={{blockService, setBlockService}}>
                        <div className={'flex flex-col'}>
                            {
                                board.data
                                && board.data.content
                                && board.data.content.list
                                && board.data.content.list.length > 0
                                && board.data.content.list.map((item, index) =>
                                    <Block key={index}
                                           blockRef={blockRef}
                                           seq={item.seq}
                                           value={item.value}
                                           textStyle={item.textStyle}
                                           code={item.code}
                                           // setValue={e=>{}}
                                           onChangeHandler={e => {onChangeHandler(e, item.seq)}}
                                           onKeyDownHandler={e=> {onKeyDownHandler(e, item.seq)}}
                                           onKeyUpHandler={e=> {onKeyUpHandler(e, item.seq)}}
                                           onClickAddHandler={()=> addBlockHandler(item.seq)}
                                    />
                                )
                            }
                        </div>
                    </BlockProvider.Provider>
                    <div>
                        {
                          isNewBoard &&
                          <div className={'flex gap-1 justify-end'}>
                            <button className={'w-full rounded h-full border-2 border-blue-200 hover:bg-blue-200 hover:text-white py-1 px-3 text-sm duration-300'}
                                    onClick={()=>submitHandler(true)}
                            >작성
                            </button>
                          </div>
                        }
                    </div>
                </div>
            </div>
        </BoardProvider.Provider>
    )
}