'use client';

import Block from "@/app/board/{components}/Block";
import {ChangeEvent, useCallback, useContext, useEffect, useMemo, useRef, useState} from "react";
import {HtmlElements} from "@/app/board/{components}/block/type/Types";
import {BlockI, BoardI, Category} from "@/app/board/{services}/types";
import {
    faDownLeftAndUpRightToCenter,
    faStar as faStarSolid,
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
import {deleteImage, initBlock, listSort, onChangeBlockGlobalHandler, updateBoard} from "@/app/board/{services}/funcs";
import WriterInfo from "@/app/board/[id]/{components}/writerInfo";
import {useRouter} from "next/navigation";
import HotKeyInfo from "@/app/board/[id]/{components}/hotKeyInfo";
import {useBoardHotKey} from "@/app/board/[id]/{hooks}/hotkey";
import TemplateMenu from "@/app/board/[id]/{components}/templateMenu";
import ModalProvider from "@/app/user/board-block/{services}/modalProvider";
import BoardblockModal from "@/app/board/[id]/{components}/boardblockModal";
import {AxiosError} from "axios";

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
        , isFavorite, setIsFavorite
        , isNewBoard, isTemplate
        , boardTemplate, setBoardTemplate
        , roles,  summary
    } = useContext(BoardProvider);

    const {
        blockService
    } = useContext(BlockProvider);

    const {
        setLoading
        , commentLoading
    } = useContext(LoadingProvider);

    const {
        waitUploadFiles, setWaitUploadFiles,
        waitRemoveFiles, setWaitRemoveFiles
    } = useContext(TempFileProvider);


    const [fullScreen, setFullScreen] = useState<boolean>(false);
    const [modal, setModal] = useState({toggle: false, id: 0});

    const blockRef = useRef<HTMLElement[] | null[]>([]);

    const debounce = createDebounce(300);

    const categoryName = useMemo(() =>
        Category.findById(board.data?.categoryPk.toString())?.name
    ,[board?.data?.categoryPk]);

    const favoriteConf = useMemo(() =>
        !isNewBoard
        && !isTemplate
        && board.isView
        && board.data.isPublic
        && board.data.isLogin
    ,[isNewBoard, isTemplate, board.isView, board.data?.isPublic, board.data?.isLogin]);

    const newSaveConf = useMemo(() =>
        isNewBoard || (isTemplate && !boardTemplate?.isApply)
    ,[isNewBoard, isTemplate, boardTemplate.isApply]);

    const updateSaveConf = useMemo(() =>
        !isNewBoard
        && (!isTemplate || boardTemplate.isApply)
        && !board.isView
    , [isNewBoard, isTemplate, boardTemplate.isApply, board.isView]);

    const viewBoardInfoConf = useMemo(() =>
        !isNewBoard
        && !isTemplate
        && board.isView
    ,[isNewBoard, isTemplate, board.isView]);

    const router = useRouter();

    useEffect(() => {
        window.scrollTo(0, 0);
    },[]);

    const addBlock = useCallback((seq: number, init: boolean, value?: string, cusSeq?: boolean) => {
        const block: BlockI = initBlock({seq: cusSeq ? seq : 0});
        if(!init) block.seq = seq + 0.1;
        if(value) block.value = value;
        return block;
    },[]);

    const validation = useCallback(() => {
        const title = board.data.title !== '';
        const content = board.data.content.list.filter(item => item.value !== '').length > 0;
        return title && content;
    },[board.data]);

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
                         ? '/board-template'
                         : `/board/${params.id}`
                       : isTemplate
                         ? '/board-template/' + boardTemplate.templateId
                         : `/board/${params.id}`
            );

            const result = await apiCall<BoardI, BoardI>({
                method: isSave ? 'POST': 'PUT',
                path,
                body,
                isReturnData: true
            })
            .then(res => {
                return res
            });

            isNewBoard && isSave
                ? router.push('/board/' + result?.id)
                : location.reload();

            if(isTemplate) {
                const message = board.data.title + (isSave ? `을(를) 템플릿 저장되었습니다.` : '이(가) 템플릿에 수정했습니다.');
                alert(message);
                router.push('/')
            }

        } catch (e) {
            const err = e as AxiosError;

            const message = err?.response?.status === 400
                ? err.response.data
                : err?.response?.status === 500
                ? '저장에 실패했습니다.'
                : '로그인이 필요합니다.';

            alert(message);

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
        const list = [...board.data?.content?.list];
        if (!list) return ;

        list.push(addBlock(seq, false, value));

        listSort(list);

        setBoard({...board, data: {...board.data, content: {list: list}}});
    }

    const onChangeHandler = (e: ChangeEvent<HtmlElements>, seq: number) => {
        const list = [...board.data?.content?.list];
        if (!list) return ;

        const onChange = onChangeBlockGlobalHandler({
            seq,
            board,
            setBoard,
            blockRef,
            isTemplate,
            value: e.target.value,
        });

        if(onChange) return ;

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

    const onBlockClickHandler = useCallback(() => {
        setModal({toggle: true, id: Number(board?.data?.id)});
    },[modal]);

    useBoardHotKey({
        blockService,
        board,
        setBoard,
        fullScreen,
        setFullScreen,
        blockRef
    })

    if(!board?.data?.content || board.data?.content?.list?.length === 0) {
        return;
    }

    return (
        <ModalProvider.Provider value={{modal, setModal}}>
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
                    <div className={'flex w-full gap-2'}>
                        {
                            favoriteConf
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
                    </div>
                    <div className={'flex justify-end sm:justify-start gap-2 h-auto'}>
                        {
                            !isNewBoard
                            && !isTemplate
                            && <HeaderBtn submitClickHandler={() => debounce(() => submitHandler(false))}
                                          deleteClickHandler={() => debounce(() => deleteHandler())}
                                          blockClickHandler={() => debounce(() => onBlockClickHandler())}
                                          {...{roles, board, editClickHandler}}
                            />
                        }
                        <div className={'flex gap-1'}>
                            {
                                (isNewBoard || !board.isView)
                                && <>
                                    <button
                                      className={[
                                          'w-16 rounded h-14 border-2 py-1 px-3 text-xs duration-300',
                                          board.data?.isPublic
                                              ? 'text-blue-600 border-blue-200 hover:bg-blue-200 hover:text-white'
                                              : 'text-red-600 border-red-200 hover:bg-red-200 hover:text-white'
                                      ].join(' ')}
                                      onClick={() => {
                                          setBoard({...board, data: {...board.data, isPublic: !board.data.isPublic}});
                                      }}
                                    > { board.data?.isPublic ? '공개' : '비공개' }
                                    </button>
                                    <button className={[
                                            'w-16 rounded h-14 border-2 py-1 px-3 text-xs duration-300 whitespace-pre',
                                            board.data?.membersOnly
                                                ? 'text-red-600 border-red-200 hover:bg-red-200 hover:text-white'
                                                : 'text-blue-600 border-blue-200 hover:bg-blue-200 hover:text-white'
                                        ].join(' ')}
                                            onClick={() => {
                                                setBoard({...board, data: {...board.data, membersOnly: !board.data.membersOnly}});
                                            }}>
                                        { board.data?.membersOnly ? '회원\n 전용' : '모두' }
                                    </button>
                                </>
                            }
                            {
                                (isNewBoard || isTemplate)
                                && <TemplateMenu />
                            }
                            <button
                                className={'w-14 rounded h-14 border-2 border-blue-200 hover:bg-blue-200 hover:text-white py-1 px-3 text-sm duration-300'}
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
                        viewBoardInfoConf
                        && <BoardInfo {...board.data}/>
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
                        newSaveConf
                        && <div className={'flex gap-1 justify-end mt-5'}>
                            <button
                              className={'w-full rounded h-full border-2 border-blue-200 hover:bg-blue-200 hover:text-white py-1 px-3 text-sm duration-300'}
                              onClick={() => debounce(() => submitHandler(true))}
                            >작성
                            </button>
                        </div>
                    }
                    {
                        updateSaveConf
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
                      {...{board, rateInfo}}
                />
                {
                    !isNewBoard
                    && board.isView
                    && <WriterInfo {...{board, summary}} />
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
            {
                modal.toggle
                && <BoardblockModal />
            }
        </div>
        </ModalProvider.Provider>
    )
}
