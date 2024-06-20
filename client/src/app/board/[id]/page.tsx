'use client';

import Block from "@/app/board/{components}/Block";
import {ChangeEvent, useCallback, useContext, useEffect, useMemo, useRef, useState} from "react";
import GlobalLoadingSpinner from "@/app/{commons}/GlobalLoadingSpinner";
import {HtmlElements} from "@/app/board/{components}/block/type/Types";
import {BlockI, BoardI, Category} from "@/app/board/{services}/types";
import {blockTypeList} from "@/app/board/{components}/block/list";
import {faDownLeftAndUpRightToCenter, faUpRightAndDownLeftFromCenter} from "@fortawesome/free-solid-svg-icons";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import apiCall from "@/app/{commons}/func/api";
import {createDebounce} from "@/app/{commons}/func/debounce";
import SubTextMenu from "@/app/board/{components}/SubTextMenu";
import Comment from "@/app/board/[id]/{components}/comment";
import Rate from "@/app/board/[id]/{components}/rate";
import BoardTitle from "@/app/board/[id]/{components}/boardTitle";
import HeaderBtn from "@/app/board/[id]/{components}/headerBtn";
import BoardInfo from "@/app/board/[id]/{components}/boardInfo";
import BoardProvider from "@/app/board/{services}/BoardProvider";
import BlockProvider from "@/app/board/{services}/BlockProvider";
import LoadingProvider from "@/app/board/{services}/LoadingProvider";
import TempFileProvider from "@/app/board/{services}/TempFileProvider";
import KeyDownEvent from "@/app/board/{services}/keyDownEvent";
import KeyUpEvent from "@/app/board/{services}/keyUpEvent";

export interface RateInfoI {
    id      : number;
    count   : number;
    status  : boolean;
}

// fixme: 뒤로가기 등 강제 이동시 파일 삭제 처리 안됨

export default function Page({params}: {params : {id: string}}) {

    const {
        board, setBoard
        , rateInfo, setRateInfo
        , setComment
    } = useContext(BoardProvider);

    const {
        blockService, setSelectedBlock
    } = useContext(BlockProvider);

    const {
        loading, setLoading
        , commentLoading, setCommentLoading
    } = useContext(LoadingProvider);

    const {
        waitUploadFiles, setWaitUploadFiles,
        waitRemoveFiles, setWaitRemoveFiles
    } = useContext(TempFileProvider);

    const [fullScreen, setFullScreen] = useState<boolean>(false);

    const blockRef = useRef<HTMLElement[] | null[]>([]);

    const isNewBoard = useMemo(() => !params.id || params.id === 'new',[params.id]);

    const debounce = createDebounce(300);

    const defaultBlock:BlockI = {seq: 0, value: '', code: '00005', textStyle: {}, hash: Date.now().toString() + '-0'};

    const shortList = useMemo(()=> (
        blockTypeList.map(item => ({ command: item.command, code: item.code}))
    ), []);

    useEffect(() => {
        window.scrollTo(0, 0);
    },[]);

    useEffect(() => {
        if(!isNewBoard) return ;
        const list = board.data?.content?.list;

        if (!list) return ;
        const lastRef = blockRef.current[list.length - 1] as HTMLInputElement;

        if(!lastRef) return ;
        lastRef.focus();
    },[board.data?.content?.list.length])

    const addBlock = (seq: number, init: boolean, value?: string) => {
        const block: BlockI = {...defaultBlock};
        if(!init) {
            block.seq = seq + 0.1;
        }
        if(value) {
            block.value = value;
        }
        return block;
    };

    const validation = useCallback(() => {
        const title = board.data.title !== '';
        const content = board.data.content.list.filter(item => item.value !== '').length > 0;
        return title && content;
    },[board.data]);

    const onChangeBlockHandler = (e: ChangeEvent<HtmlElements>, seq: number) => {
        const block = shortList.find(item => item.command + ' ' === e.target?.value);
        if(!block) return false;
        const newList = board.data?.content?.list.map((item, index) => {
            if (item.seq === seq) {
                item.code = block.code;
                item.value = '';
            }
            return item;
        });
        setBoard({...board, data: {...board.data,  content: {list: newList}}});

        setTimeout(() => {
            blockRef.current[seq]?.focus();
        },100);

        return true;
    };

    if(loading) return <GlobalLoadingSpinner />;

    const submitHandler = async (isSave: boolean) => {
        if(!validation()) {
            alert('내용을 입력해주세요');
            return ;
        }

        setLoading(true);


        try {
            // todo: 저장시 빈 라인 제거 할 것인가?
            // 현재 : 빈 라인 포함 저장
            const bodyContent = board.data.content.list.filter(item => item.value !== '');
            const body: BoardI = {
                ...board.data,
                content: {
                    list: board.data.content.list
                },
                isPublic: board.data.isPublic,
                uploadFiles: waitUploadFiles.map(item => item.id),
                removeFiles: waitRemoveFiles.map(item => item.filePath + item.fileName),
            };

            const result = await apiCall<BoardI, BoardI>({
                path: '/api/board/' + (isSave ? 'new' : params.id),
                method: isSave ? 'POST': 'PUT',
                body,
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
            })
        } catch (e) {
            console.log(e);
        } finally {
            location.href = '../';
        }
    };

    const addBlockHandler = (seq: number, value?: string) => {
        const list = board.data?.content?.list;
        if (!list) return ;

        const currentBlock = list.find(item => item.seq === seq)!;

        if(currentBlock.value === '') return ;

        list.push(addBlock(seq, false, value));

        list.sort((a, b) => a.seq - b.seq)
            .map((item, index) => {
                item.seq = index;
                item.hash = item.hash.split('-')[0] + '-' + index;
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

        fileDeleteHandler(list, seq);

        let newList = list.filter(item => item.seq !== seq);
        if (newList?.length === 0) {
            newList = [{seq, value: '', code: '00005', textStyle: {}, hash: Date.now() + '-' + seq}];
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

    const fileDeleteHandler = async (blockList: BlockI[], seq: number) => {

        const fileRegexp = new RegExp('002[0-9]{2}');
        const fileBlock = blockList.find(item =>
            item.seq === seq && fileRegexp.test(item.code)
        );

        if(!fileBlock) return ;

        const fileName = fileBlock.value.split('/')[fileBlock.value.split('/').length - 1];
        const filePath = fileBlock.value.split('/').slice(0, -1).join('/') + '/';

        setWaitUploadFiles(prevState => {
            return prevState.filter(item => item.fileName !== fileName);
        });

        setWaitRemoveFiles(prevState => {
            return [...prevState, {id: 0, fileName, filePath}];
        });

        if(!isNewBoard) return;
        if(!fileBlock.value) return;

        await apiCall({
            path: '/api/file/delete/filename',
            method: 'PUT',
            body: {fileUri: fileBlock.value},
            isReturnData: true
        });

    }

    const onChangeTitleHandler = (e: ChangeEvent<HTMLInputElement>) => {
        if(e.target.name !== 'title') return ;
        setBoard({...board, data: {...board.data, title: e.target.value}});
    }

    const onKeyUpHandler = (e: React.KeyboardEvent<HTMLElement>, seq: number) => {

        switch (e.key) {
            case 'Enter':
                KeyUpEvent.enter({seq, board, blockRef, addBlockHandler, event: e});
                break;
        }
    }

    const onKeyDownHandler = (e: React.KeyboardEvent<HTMLElement>, seq: number) => {
        switch (e.key) {
            case 'ArrowUp':
                KeyDownEvent.arrowUp({seq, blockRef, event: e});
                break;
            case 'ArrowDown':
                KeyDownEvent.arrowDown({seq, blockRef, event: e, board});
                break;
            case 'Backspace':
                KeyDownEvent.backspace({board, seq, blockRef, setBoard, addBlock, event: e});
                break;
        }
    }

    const onChangeRateHandler = async () => {
        return await apiCall<RateInfoI>({
            path: rateInfo.status ? '/api/board/rate/' + params.id : '/api/board/rate/add/' + params.id,
            method: rateInfo.status ? 'DELETE' : 'GET',
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
        <>
            <div className={'p-5 flex flex-col gap-5 justify-center items-center'}>
                <div className={`w-full flex flex-col gap-3 duration-700 ${fullScreen || 'lg:w-2/3 xl:w-1/2'}`}>
                    <div className={'flex h-8 border-l-8 border-solid border-gray-500 px-2 items-center'}>
                        <span className={'font-bold'}>
                            {Category.findById(board.data.categoryPk.toString())?.name}
                        </span>
                    </div>
                    <div className={'flex flex-col sm:flex-row justify-between gap-3 h-auto border-b-2 border-solid border-blue-200 py-3'}>
                        <BoardTitle board={board}
                                    newBoard={isNewBoard}
                                    onChange={onChangeTitleHandler}
                                    onKeyUp={e => onKeyUpHandler(e, 0)}
                        />
                        <div className={'flex justify-end sm:justify-start gap-2 h-10 sm:h-auto'}>
                            {
                                !isNewBoard &&
                                <HeaderBtn isView={board.isView}
                                           isWriter={board.data.isWriter || false}
                                           isLogin={board.data.isLogin || false}
                                           submitClickHandler={() => debounce(() => submitHandler(false))}
                                           editClickHandler={editClickHandler}
                                           deleteClickHandler={() => debounce(() => deleteHandler())}
                                />
                            }
                            <div className={'flex gap-1'}>
                                {
                                    (isNewBoard || !board.isView)
                                    && <button
                                        className={[
                                            'w-16 rounded h-full border-2 py-1 px-3 text-xs duration-300',
                                            board.data.isPublic
                                                ? 'text-blue-600 border-blue-200 hover:bg-blue-200 hover:text-white'
                                                : 'text-red-600 border-red-200 hover:bg-red-200 hover:text-white'
                                        ].join(' ')}
                                        onClick={() => {
                                            setBoard({...board, data: {...board.data, isPublic: !board.data.isPublic}});
                                        }}
                                    > { board.data.isPublic ? '공개' : '비공개' }
                                  </button>
                                }
                                <button
                                    className={'w-14 rounded h-full border-2 border-blue-200 hover:bg-blue-200 hover:text-white py-1 px-3 text-sm duration-300'}
                                    onClick={() => setFullScreen(!fullScreen)}>
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
                    </div>
                    <div>
                        {
                            !isNewBoard
                            && board.isView
                            && <BoardInfo board={board}/>
                        }
                    </div>
                    <div className={['flex flex-col', board.isView ? 'gap-2' : 'gap-4'].join(' ')}>
                        {
                            board.data.content.list.map((item, index) => {
                                return <Block key={'block' + index}
                                              blockRef={blockRef}
                                              onChangeHandler={e => {
                                                  onChangeHandler(e, item.seq)
                                              }}
                                              onKeyDownHandler={e => {
                                                  onKeyDownHandler(e, item.seq)
                                              }}
                                              onKeyUpHandler={e => {
                                                  onKeyUpHandler(e, item.seq)
                                              }}
                                              onClickAddHandler={() => addBlockHandler(item.seq)}
                                              onClickDeleteHandler={onClickDeleteHandler}
                                              {...item}
                                />
                            })
                        }
                    </div>
                    <div>
                        {
                            isNewBoard
                            && <div className={'flex gap-1 justify-end mt-5'}>
                            <button
                              className={'w-full rounded h-full border-2 border-blue-200 hover:bg-blue-200 hover:text-white py-1 px-3 text-sm duration-300'}
                              onClick={() => debounce(() => submitHandler(true))}
                            >작성
                            </button>
                          </div>
                        }
                        {
                            !isNewBoard
                            && !board.isView
                            && <div className={'flex gap-1 justify-end mt-5'}>
                            <button
                              className={'w-full rounded h-10 border-2 border-blue-200 hover:bg-blue-200 hover:text-white py-1 px-3 text-sm duration-300'}
                              onClick={() => debounce(() => submitHandler(false))}
                            >저장
                            </button>
                          </div>
                        }
                    </div>
                    <Rate newBoard={isNewBoard}
                          onClick={() => debounce(onChangeRateHandler)}
                    />
                    {
                        !commentLoading
                        && <Comment />
                    }
                </div>
                <div>
                    {
                        !board.isView
                        && blockService.blockMenu === 'openTextMenu'
                        && <SubTextMenu blockRef={blockRef}/>
                    }
                </div>
                {
                    (isNewBoard || !board.isView) && (!isNewBoard || !board.isView)
                    && <div className={'h-60'} />
                }
            </div>
        </>
    )
}
