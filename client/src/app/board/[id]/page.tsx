'use client';

import Block from "@/app/board/{components}/Block";
import {ChangeEvent, useCallback, useEffect, useMemo, useRef, useState} from "react";
import GlobalLoadingSpinner from "@/app/{commons}/GlobalLoadingSpinner";
import {HtmlElements} from "@/app/board/{components}/block/type/Types";
import {BoardI} from "@/app/board/{services}/types";
import {blockTypeList} from "@/app/board/{components}/block/list";
import BlockProvider, {BlockService} from "@/app/board/{services}/BlockProvider";
import BoardProvider, {BoardService} from "@/app/board/{services}/BoardProvider";
import {faDownLeftAndUpRightToCenter, faUpRightAndDownLeftFromCenter} from "@fortawesome/free-solid-svg-icons";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import TempFileProvider, {TempFileI} from "@/app/board/{services}/TempFileProvider";
import Image from "next/image";
import {faHeart} from "@fortawesome/free-solid-svg-icons/faHeart";
import apiCall from "@/app/{commons}/func/api";
import {createDebounce} from "@/app/{commons}/func/debounce";
import SubTextMenu from "@/app/board/{components}/SubTextMenu";

export interface RateInfoI {
    id      : number;
    count   : number;
    status  : boolean;
}

export default function Page({params}: {params : {id: string}}) {

    const [board, setBoard] = useState<BoardService>({} as BoardService);

    const [rateInfo, setRateInfo] = useState<RateInfoI>({} as RateInfoI);

    const [loading, setLoading] = useState<boolean>(false);

    const [fullScreen, setFullScreen] = useState<boolean>(false);

    const [blockService, setBlockService] = useState<BlockService>({} as BlockService);

    const [tempFiles, setTempFiles] = useState<TempFileI[]>([]);

    const blockRef = useRef<HTMLElement[] | null[]>([]);

    const isNewBoard = useMemo(() => !params.id || params.id === 'new',[params.id]);

    const debounce = createDebounce(300);

    const defaultBlock = useMemo(()=>(
        {seq: 0, value: '', code: '00005', textStyle: {}}
    ),[]);

    const shortList = useMemo(()=> (
        blockTypeList.map(item => ({ command: item.command, code: item.code}))
    ), []);

    const rateCount = useMemo(() => {
        return rateInfo?.count !== undefined
            ? rateInfo.count
            : board?.data?.rate;
    },[rateInfo?.count, board.data?.rate]);

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

        const fetch = async () => {
            await apiCall<BoardI>({
                path: '/api/board/' + params.id,
                method: 'GET',
                call: 'Proxy'
            })
            .then(res => {
                setBoard({
                    ...board,
                    data: res.data,
                    isView: true
                });
            }).finally(() => {
                setLoading(false);
            });
        }

        const debounce = createDebounce(300);
        debounce(fetch);

    },[params.id]);

    useEffect(() => {
        const list = board.data?.content?.list;
        if (!list) return ;
        blockRef.current[list.length - 1]?.focus();
    },[board.data?.content?.list.length])

    useEffect(() => {
        if(params.id === 'new') return ;
        const fetch = async () => {
            await apiCall<RateInfoI>({
                path: '/api/board/rate/' + params.id,
                method: 'GET',
                call: 'Proxy'
            }).then(res => {
                setRateInfo(res.data);
            });
        }

        const debounce = createDebounce(300);
        debounce(fetch);
    },[params.id]);

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
        const block = shortList.find(item => item.command + ' ' === e.target?.value);
        if(!block) return false;
        const newList = board.data?.content?.list.map((item, index) => {
            if (item.seq === seq) {
                item.code = block.code;
                item.value = '';
            }
            return item;
        });
        setBoard({...board, data: {...board.data, content: {list: newList}}});

        setTimeout(() => {
            blockRef.current[seq]?.focus();
        },100);

        return true;
    },[board.data]);

    if(loading) return <GlobalLoadingSpinner />;

    const submitHandler = async (isSave: boolean) => {
        if(!validation()) {
            alert('내용을 입력해주세요');
            return ;
        }
        setLoading(true);
        try {
            const result = await apiCall<BoardI, BoardI>({
                path: '/api/board/' + (isSave ? 'new' : params.id),
                method: isSave ? 'POST': 'PUT',
                call: 'Proxy',
                body: board.data
            })
            .then(res => {
                return res.data;
            });

            if(isSave) {
                location.href = '/board/' + result?.id;
            } else {
               location.reload();
            }
        } catch (e) {
            alert('저장에 실패했습니다.');
            setLoading(false);
        }
    }

    const deleteHandler = async () => {
        setLoading(true);
        try {
            await apiCall({
                path: '/api/board/' + params.id,
                method: 'DELETE',
                call: 'Proxy'
            })
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

    const onClickDeleteHandler = (seq: number) => {
        const list = board.data?.content?.list;

        let newList = list.filter(item => item.seq !== seq);
        if (newList?.length === 0) {
            newList = [{seq, value: '', code: '00005', textStyle: {}}];
        }

        setBoard({
            ...board,
            data: {
                ...board.data,
                content: {
                    list: newList
                }
            }
        });

        if(newList.length === 0) {
            addBlockHandler(0);
        }

    }

    const onChangeTitleHandler = (e: ChangeEvent<HTMLInputElement>) => {
        if(e.target.name !== 'title') return ;
        setBoard({...board, data: {...board.data, title: e.target.value}});
    }

    const onKeyUpHandler = (e: React.KeyboardEvent<HTMLElement>, seq: number) => {
        if(e.key !== 'Enter') return;

        seq === 0 && e.currentTarget.getAttribute('name') === 'title' && blockRef.current[0]?.focus();

        const list = board.data?.content?.list;

        if (!list) return ;

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

        if(currentBlock.value !== '') return ;
        if(seq === 0) {
            setTimeout(() => {
                blockRef.current[0]?.focus();
            },100);
            return;
        }

        const newList = list.filter(item => item.seq !== seq)
            .sort((a, b) => a.seq - b.seq)
            .map((item, index) => {
                item.seq = index;
                return item;
            });

        setBoard({...board, data: {...board.data, content: {list: newList}}});
        blockRef.current[seq - 1]?.focus();
    }

    const onChangeRateHandler = async () => {
        return await apiCall<RateInfoI>({
            path: '/api/board/rate/' + params.id,
            method: rateInfo.status ? 'DELETE' : 'POST',
            call: 'Proxy'
        })
        .then(res => {
            setRateInfo(res.data);
        })
        .catch(e => {
            rateInfo.status || alert('로그인이 필요합니다.');
        });
    }

    if(!board?.data?.content || board.data?.content?.list?.length === 0) {
        return <GlobalLoadingSpinner />
    }

    return (
        <BoardProvider.Provider value={{board, setBoard}}>
            <TempFileProvider.Provider value={{tempFiles, setTempFiles}}>
                <BlockProvider.Provider value={{blockService, setBlockService}}>
                    <div className={'p-5 flex justify-center'}>
                        <div className={`w-full flex flex-col gap-3 duration-700 ${fullScreen || 'lg:w-2/3 xl:w-1/2'}`}>
                            <div className={'flex justify-between gap-2 h-auto border-b-2 border-solid border-blue-200 py-3'}>
                                <div className={'font-bold flex items-center w-full'}>
                                    {
                                        !board.isView
                                        && board.data
                                        && <input className={'w-full text-lg px-3 py-2 bg-gray-50 focus:bg-blue-50 hover:bg-blue-50 outline-0 rounded'}
                                                  name={'title'}
                                                  value={board.data?.title}
                                                  onChange={onChangeTitleHandler}
                                                  onKeyUp={e => onKeyUpHandler(e, 0)}
                                                  placeholder={'제목을 입력하세요'}
                                        />
                                    }
                                    {
                                        board.isView
                                        && !isNewBoard
                                        && <span className={'w-full text-lg py-1'}
                                        >{board.data.title}</span>
                                    }
                                </div>
                                {
                                    !isNewBoard &&
                                    <div className={'w-auto flex gap-1 justify-end'}>
                                      {
                                          !board.isView &&
                                          <button className={'w-16 rounded h-full border-2 border-blue-200 text-blue-400 hover:bg-blue-200 hover:text-white py-1 px-3 text-sm duration-300'}
                                                  onClick={()=> debounce(()=> submitHandler(false))}
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
                                                  onClick={()=> debounce(()=> deleteHandler())}
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
                                            ? <FontAwesomeIcon className={'text-blue-400'}
                                                               icon={faDownLeftAndUpRightToCenter}
                                            />
                                            : <FontAwesomeIcon className={'text-blue-400'}
                                                               icon={faUpRightAndDownLeftFromCenter}
                                            />
                                        }
                                    </button>
                                </div>
                            </div>
                            <div>
                                {
                                    !isNewBoard && board.isView
                                    && <div className={'flex gap-2 justify-between'}>
                                      <div className={'flex flex-col justify-between text-sm'}>
                                        <p>
                                            작성일: {board.data.createdAt}
                                        </p>
                                        <p>
                                            조회수: {board.data.viewCount}
                                        </p>
                                      </div>
                                      <div className={'flex gap-2 items-center'}>
                                        <Image src={process.env.NEXT_PUBLIC_CDN_SERVER + board.data.profileImage}
                                               className={'rounded-full border-2 border-solid border-blue-300'}
                                               width={50}
                                               height={50}
                                               alt={''}
                                        />
                                        <p className={'font-bold'}
                                        >{board.data.writer}</p>
                                      </div>
                                    </div>
                                }
                            </div>
                            <div className={['flex flex-col', board.isView ? 'gap-4' : 'gap-4'].join(' ')}>
                                {
                                    board.data.content.list.map((item, index) => {
                                       return <Block key={'block' + index}
                                               blockRef={blockRef}
                                               onChangeHandler={e => {onChangeHandler(e, item.seq)}}
                                               onKeyDownHandler={e=> {onKeyDownHandler(e, item.seq)}}
                                               onKeyUpHandler={e=> {onKeyUpHandler(e, item.seq)}}
                                               onClickAddHandler={()=> addBlockHandler(item.seq)}
                                               onClickDeleteHandler={onClickDeleteHandler}
                                               { ...item}
                                        />
                                    })
                                }
                            </div>
                            <div>
                                {
                                  isNewBoard
                                  && <div className={'flex gap-1 justify-end'}>
                                    <button className={'w-full rounded h-full border-2 border-blue-200 hover:bg-blue-200 hover:text-white py-1 px-3 text-sm duration-300'}
                                            onClick={()=> debounce(()=>submitHandler(true))}
                                    >작성
                                    </button>
                                  </div>
                                }
                            </div>
                            <div className={'flex justify-center'}>
                                {
                                    !isNewBoard && board.isView
                                    && <button className={'px-6 py-3 flex gap-2 justify-center items-center border border-blue-400 text-xl rounded hover:bg-blue-400 hover:text-white duration-300'}
                                               onClick={()=>debounce(onChangeRateHandler)}
                                    >
                                        <FontAwesomeIcon icon={faHeart} className={`${rateInfo.status ? 'text-blue-600' : ''}`}/>
                                        <span>
                                          { rateCount }
                                        </span>
                                    </button>
                                }
                            </div>
                        </div>
                        {
                            !board.isView && blockService.blockMenu === 'openTextMenu'
                            && <SubTextMenu blockRef={blockRef} />
                        }
                    </div>
                </BlockProvider.Provider>
            </TempFileProvider.Provider>
        </BoardProvider.Provider>
    )
}
