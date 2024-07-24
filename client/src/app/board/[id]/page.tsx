'use client';

import Block from "@/app/board/{components}/Block";
import {ChangeEvent, useCallback, useContext, useEffect, useMemo, useRef, useState} from "react";
import {HtmlElements} from "@/app/board/{components}/block/type/Types";
import {BlockI, BoardI, Category} from "@/app/board/{services}/types";
import {blockTypeList} from "@/app/board/{components}/block/list";
import {
    faDownLeftAndUpRightToCenter, faStar as faStarSolid,
    faUpRightAndDownLeftFromCenter
} from "@fortawesome/free-solid-svg-icons";

import {faStar as faStarRegular} from "@fortawesome/free-regular-svg-icons";


import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import apiCall, {ApiCallProps} from "@/app/{commons}/func/api";
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
import {deleteImage, initBlock, listSort, notAvailDupCheck, updateBoard} from "@/app/board/{services}/funcs";
import WriterInfo from "@/app/board/[id]/{components}/writerInfo";
import {useRouter} from "next/navigation";
import HotKeyInfo from "@/app/board/[id]/{components}/hotKeyInfo";
import {useBoardHotKey} from "@/app/board/[id]/{hooks}/hotkey";

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
        , isFavorite, setIsFavorite,
        isNewBoard, isTemplate,
    } = useContext(BoardProvider);

    const {
        blockService, setSelectedBlock
    } = useContext(BlockProvider);

    const {
        loading, setLoading
        , commentLoading
    } = useContext(LoadingProvider);

    const {
        waitUploadFiles, setWaitUploadFiles,
        waitRemoveFiles, setWaitRemoveFiles
    } = useContext(TempFileProvider);

    const [fullScreen, setFullScreen] = useState<boolean>(false);

    const blockRef = useRef<HTMLElement[] | null[]>([]);

    const debounce = createDebounce(300);

    const shortList = useMemo(()=> (
        blockTypeList.map(item => ({ command: item.command, code: item.code, notAvailDup : item.notAvailDup}))
    ), []);

    const categoryName = useMemo(() =>
            Category.findById(board.data?.categoryPk.toString())?.name
    ,[board?.data?.categoryPk]);

    const router = useRouter();

    useEffect(() => {
        window.scrollTo(0, 0);
    },[]);

    const addBlock = useCallback((seq: number, init: boolean, value?: string) => {
        const block: BlockI = initBlock({seq: 0});
        if(!init) block.seq = seq + 0.1;
        if(value) block.value = value;

        return block;
    },[]);

    const validation = useCallback(() => {
        const title = board.data.title !== '';
        const content = board.data.content.list.filter(item => item.value !== '').length > 0;
        return title && content;
    },[board.data]);

    const onChangeBlockHandler = (seq: number, e: ChangeEvent<HtmlElements> ) => {
        const block = shortList.find(item =>
            item.command + ' ' === e.target?.value
        );

        if(!block) return;

        if(notAvailDupCheck(block?.code, board.data?.content)) {
            return alert('중복 사용할 수 없는 블록입니다.');
        }

        if(block.notAvailDup) return ;

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
        },0);

        return true;
    };

    const submitHandler = async (isSave: boolean) => {
        if(!validation()) {
            alert('내용을 입력해주세요');
            return ;
        }

        setLoading(true);

        try {
            const body = isTemplate
                ? updateBoard({
                    isTemplate,
                    board: board.data,
                })
                : updateBoard({
                    isTemplate,
                    board: board.data,
                    list: board.data.content.list,
                    waitUploadFiles,
                    waitRemoveFiles,
                });

            const path = '/api' + (
                isSave ? isNewBoard
                           ? '/board/new'
                           : isTemplate
                           && '/board-template'
                       : params.id
            );

            const result = await apiCall<BoardI, BoardI>({
                method: isSave ? 'POST': 'PUT',
                path,
                body,
            })
            .then(res => {
                return res.data;
            });

            isNewBoard && isSave
                ? router.push('/board/' + result?.id)
                : isTemplate && isSave
                ? router.push('/')
                : location.reload();

        } catch (e) {
            alert('저장에 실패했습니다.');
            setLoading(false);
        }
    }

    const deleteHandler = useCallback(async () => {
        setLoading(true);
        try {
            await apiCall({
                path: '/api/board/' + params.id,
                method: 'DELETE',
            })
        } catch (e) {
            console.log(e);
        } finally {
            router.push('../');
        }
    },[]);

    const addBlockHandler = (seq: number, value?: string) => {
        const list = board.data?.content?.list;
        if (!list) return ;

        list.push(addBlock(seq, false, value));

        listSort(list);

        setBoard({...board, data: {...board.data, content: {list: list}}});
    }

    const onChangeHandler = (e: ChangeEvent<HtmlElements>, seq: number) => {
        const list = board.data?.content?.list;
        if (!list) return ;

        if(onChangeBlockHandler(seq, e)) return ;

        list.map((item, index) => {
            if (item.seq === seq) {
                item.value = e.target.value;
            }
            return item;
        });

        setBoard({...board, data: {...board.data, content: {list: list}}});
    }

    const editClickHandler = () => {
        if(!isNewBoard && !board.isView) {
            location.reload();
        } else {
            setBoard({...board, isView: !board.isView});
        }
    }

    const onClickDeleteHandler = async (seq: number) => {
        const list = board.data?.content?.list;

        await fileDeleteHandler(list, seq);

        let newList = list.filter(item => item.seq !== seq);

        listSort(newList);

        if (newList?.length === 0) {
            newList = [initBlock({seq: 0})];
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

        if(newList.length === 0) addBlockHandler(0);

    }

    const fileDeleteHandler = useCallback(async (blockList: BlockI[], seq: number) => {
        const fileRegexp = new RegExp('00[2-3][0-9]{2}');
        const fileBlock = blockList.find(item =>
            item.seq === seq && fileRegexp.test(item.code)
        );

        if(!fileBlock) return ;

        if(isNewBoard) {
            await apiCall({
                path: '/api/file/delete/filename',
                method: 'PUT',
                body: {fileUri: fileBlock.value as string},
                isReturnData: true
            });
        } else {
            deleteImage({
                absolutePath: fileBlock.value as string,
                setWaitUploadFiles,
                setWaitRemoveFiles
            });
        }


        // const fileRootPath = '/resource/board/'
        // if(!fileBlock?.extraValue) return ;

        // const files = Object?.keys(fileBlock?.extraValue!).filter(key =>
        //     fileBlock.extraValue![key].toString().includes(fileRootPath)
        // )?.map(key =>
        //     fileBlock.extraValue![key]
        // );
        //
        // fileBlock.value.includes('/resource/board/') && files.push(fileBlock.value);
        //
        // files.flat().forEach(file => {
        //     console.log('sdfdsfsdfsdf', file);
        //     if(isNewBoard) {
        //         apiCall({
        //             path: '/api/file/delete/filename',
        //             method: 'PUT',
        //             body: {fileUri: file as string},
        //             isReturnData: true
        //         });
        //     } else {
        //         deleteImage({
        //             absolutePath: file as string,
        //             setWaitUploadFiles,
        //             setWaitRemoveFiles
        //         });
        //     }
        // });
    },[board.isView, board.data?.content?.list, waitUploadFiles, waitRemoveFiles])

    const onChangeTitleHandler = (e: ChangeEvent<HTMLInputElement>) => {
        if(e.target.name !== 'title') return ;
        setBoard({...board, data: {...board.data, title: e.target.value}});
    }

    const onKeyUpHandler = (e: React.KeyboardEvent<HTMLElement>, seq: number) => {

    }

    const onKeyDownHandler = (e: React.KeyboardEvent<HTMLElement>, seq: number, isTitle?: boolean) => {
        if(e.nativeEvent.isComposing) return;

        switch (e.key) {
            case 'Enter':
                KeyDownEvent.enter({seq, board, blockRef, addBlockHandler, event: e});
                break;
            case 'ArrowUp':
                KeyDownEvent.arrowUp({seq, blockRef, event: e});
                break;
            case 'ArrowDown':
                KeyDownEvent.arrowDown({seq, blockRef, event: e, board});
                break;
            case 'Backspace':
                if(isTitle) return;
                KeyDownEvent.backspace({board, seq, blockRef, setBoard, addBlock, event: e});
                break;
        }
    }

    const onChangeRateHandler = useCallback(async () => {
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
    },[rateInfo]);

    const onClickFavoriteHandler = useCallback(async () => {
        try {
            const options: ApiCallProps = isFavorite ? {
                path: '/api/board-favorites/' + params.id,
                method: 'DELETE',
                isReturnData: true
            } : {
                path: '/api/board-favorites',
                method: 'POST',
                body: {id: params.id},
                isReturnData: true
            }
            await apiCall(options);
            setIsFavorite(!isFavorite);

        } catch (e: any) {
            console.log(e)
        }

    },[isFavorite]);

    useBoardHotKey({
        blockService,
        board,
        setBoard,
        fullScreen,
        setFullScreen,
        router,
        blockRef
    })


    if(!board?.data?.content || board.data?.content?.list?.length === 0) {
        return;
    }

    return (
        <div className={'p-5 flex flex-col gap-5 justify-center items-center'}>
            <div className={`relative w-full flex flex-col gap-6 duration-700 ${fullScreen || 'lg:w-2/3 xl:w-3/5'}`}>
                <div className={[`absolute z-10 top-1/4 -right-52 hidden`, fullScreen ? 'lg:hidden' : 'lg:block'].join(' ')}>
                    <HotKeyInfo isNewBoard={isNewBoard}
                                isView={board?.isView}
                    />
                </div>
                <div className={'flex gap-1 h-8 border-l-8 border-solid border-gray-500 px-2 items-center'}>
                    <span className={'font-bold'}>
                        { categoryName }
                    </span>
                    {
                        isTemplate
                        && <span className={'font-bold'}>
                            (템플릿 추가)
                        </span>
                    }
                </div>
                <div className={'flex flex-col sm:flex-row justify-between gap-3 h-auto border-b-2 border-solid border-main py-3'}>
                    {
                        !isNewBoard
                        && !isTemplate
                        && board.isView
                        && board.data.isPublic
                        && board.data.isLogin
                        && <button onClick={onClickFavoriteHandler}>
                            {
                                isFavorite
                                    ? <FontAwesomeIcon icon={faStarSolid} className={'text-yellow-600'} />
                                    : <FontAwesomeIcon icon={faStarRegular} className={'text-yellow-600'} />
                            }
                        </button>
                    }
                    <BoardTitle board={board}
                                newBoard={isNewBoard}
                                onChange={onChangeTitleHandler}
                                onKeyDown={e => onKeyDownHandler(e, 0, true)}
                    />
                    <div className={'flex justify-end sm:justify-start gap-2 h-10 sm:h-auto'}>
                        {
                            !isNewBoard
                            && !isTemplate
                            && <HeaderBtn isView={board.isView}
                                       isWriter={board.data?.isWriter || false}
                                       isLogin={board.data?.isLogin || false}
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
                                        board.data?.isPublic
                                            ? 'text-blue-600 border-blue-200 hover:bg-blue-200 hover:text-white'
                                            : 'text-red-600 border-red-200 hover:bg-red-200 hover:text-white'
                                    ].join(' ')}
                                    onClick={() => {
                                        setBoard({...board, data: {...board.data, isPublic: !board.data.isPublic}});
                                    }}
                                > { board.data?.isPublic ? '공개' : '비공개' }
                              </button>
                            }
                            {
                                ( isNewBoard || !board.isView )
                                && <button
                                className={[
                                    'w-16 rounded h-full border-2 py-1 px-3 text-xs duration-300 whitespace-pre',
                                    board.data?.membersOnly
                                        ? 'text-red-600 border-red-200 hover:bg-red-200 hover:text-white'
                                        : 'text-blue-600 border-blue-200 hover:bg-blue-200 hover:text-white'
                                ].join(' ')}
                                onClick={() => {
                                    setBoard({...board, data: {...board.data, membersOnly: !board.data.membersOnly}});
                                }}
                              > { board.data?.membersOnly ? '회원\n 전용' : '모두' }
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
                        && !isTemplate
                        && board.isView
                        && <BoardInfo {...board}/>
                    }
                </div>
                <div className={['flex flex-col', board.isView ? 'gap-2' : 'gap-4'].join(' ')}>
                    {
                        board.data?.content?.list.map((item, index) =>
                            <Block key={'block' + index}
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
                        )
                    }
                </div>
                <div>
                    {
                        isNewBoard
                        || isTemplate
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
                        && !isTemplate
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
                    !isNewBoard
                    && board.isView
                    && <WriterInfo />
                }
                {
                    !commentLoading
                    && <Comment params={params} />
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
    )
}
