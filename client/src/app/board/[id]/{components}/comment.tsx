import {useContext, useMemo, useRef, useState} from "react";
import {BlockI, BoardI, CommentI} from "@/app/board/{services}/types";
import Image from "next/image";
import BoardProvider from "@/app/board/{services}/BoardProvider";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {faComment} from "@fortawesome/free-solid-svg-icons";
import apiCall from "@/app/{commons}/func/api";
import Link from "next/link";
import {faXmark} from "@fortawesome/free-solid-svg-icons/faXmark";
import LoadingSpinner from "@/app/{commons}/LoadingSpinner";
import {defaultProfile} from "@/app/{commons}/func/image";
import moment from "moment";
import {QuestionBlockExtraValueType} from "@/app/board/{components}/block/extra/questionBlock";
import {updateBoard} from "@/app/board/{services}/funcs";
import {useSearchParams} from "next/navigation";
import PageNavigator from "@/app/{commons}/PageNavigator";
import {Common} from "@/app/{commons}/types/commons";
import {useQuery} from "@tanstack/react-query";
import boardApiService from "@/app/board/{services}/boardApiService";
import {useBlockEvent} from "@/app/board/{hooks}/useBlockEvent";

export type SaveComment = {
    boardPk   : string;
    blockSeq  : string | null;
    content   : string;
    parentPk? : string;
}

const Comment = ({
    params
} : {
    params: {id: string};
}) => {
    const searchParams = useSearchParams();

    const {
        board, isNewBoard, isTemplate
    } = useContext(BoardProvider);

    const {newComment, setNewComment} = useContext(BoardProvider);

    const {data, refetch} = useQuery(boardApiService.getComments({
        isEdit: isNewBoard || isTemplate,
        boardPk: Number(board.data.id),
        searchParams,
    }));

    const {page, content: comment} = data || {page:{page:1, size: 10}} as Common.PageResponse<CommentI>;

    const [loading, setLoading] = useState(false);
    const ref = useRef<HTMLDivElement>(null);
    const onChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
        setNewComment({...newComment, content: e.target.value});
    }

    const submitClickHandler = async () => {
        if(!newComment.content){
            alert('댓글을 입력하세요');
            return;
        }

        try {
            const body: SaveComment = {boardPk: board.data.id, content: newComment.content, blockSeq: newComment.blockSeq};

            setLoading(true);

            await apiCall<boolean, SaveComment>({
                path: '/api/board/comment',
                method: 'POST',
                body,
                isReturnData: true,
            })

            await refetch();

            setNewComment({
                boardPk: board.data.id,
                content: '',
            } as SaveComment);

        } catch (err: any) {
            alert(err.response.data.message);
        } finally {
            setLoading(false);
        }
    }

    const onDeleteHandler = () => {
        setNewComment({
            ...newComment,
            blockSeq: null,
        });
    }

    const comments = useMemo(() =>
        comment?.map((item, index) => {
            return (
                <CommentItem key={index} {...item} refetch={refetch} />
            )
        })
    ,[comment])

    if(!board.isView) return <></>

    return (
        <div className={'w-auto flex flex-col gap-4'}>
            <div className={'flex gap-2 text-lg items-center py-2'}
                 ref={ref}
            >
                <FontAwesomeIcon icon={faComment} />
                <div className={'flex'}>
                    <h2>
                        댓글
                    </h2>
                    <span>
                        ({page?.total})
                    </span>
                </div>
            </div>
            {
                board?.isView
                && board?.data?.isLogin
                && <div className={'w-full flex gap-1'}>
                    <button className={[
                        'absolute h-16 flex flex-col justify-center items-center text-xs text-white bg-blue-400 hover:bg-red-600 duration-300'
                    ].join(' ')}
                            style={{width: newComment.blockSeq !== undefined && newComment.blockSeq !== null ? '29px' : '0'}}
                            onClick={onDeleteHandler}
                    >
                      <span>{ newComment.blockSeq?.split('-')[1] }</span>
                    </button>
                    <textarea className={[
                        'w-full h-16 border border-solid border-gray-200  resize-none text-sm outline-0 duration-300',
                        newComment.blockSeq !== undefined && newComment.blockSeq !== null ? 'pl-10 pr-2 py-2' : 'p-2'
                    ].join(' ')}
                              placeholder={'댓글을 입력하세요'}
                              value={newComment.content}
                              onChange={onChange}
                    />
                    <button className={'w-20 border border-solid border-gray-200 text-gray-700 hover:bg-gray-700 hover:text-white duration-300 focus:outline-none focus:bg-gray-700 focus:text-white'}
                            onClick={submitClickHandler}
                            disabled={loading}
                    >
                        {
                        loading
                            ? <LoadingSpinner size={20} />
                            : '등록'
                        }
                    </button>
                </div>
            }
            <div className={'w-auto flex flex-col gap-4'}>
                { comments }
            </div>
            {
                page?.total > 10
                && <PageNavigator {...page} />
            }
        </div>
    )
}

const CommentItem = (props: CommentI & {refetch: ()=> Promise<any>}) => {
    const {
        blockSeq, content
        , writer, profileImage
        , createdAt, children
        , isWriter
        , id, refetch
    } = props;

    const {board} = useContext(BoardProvider);

    const {setSelectedBlock} = useBlockEvent();

    const {deleteComment, setDeleteComment} = useContext(BoardProvider);
    const [loading, setLoading] = useState(false);

    const extraValue = useMemo(()=> {
        return board.data.content.list.find(item => item.code === '00303')?.extraValue as QuestionBlockExtraValueType;
    },[]);

    const existBlock = useMemo(()=> {
        return board.data.content.list.find(item => item.hash === blockSeq) !== undefined;
    }, [board.data.content.list, blockSeq]);

    const deleteHandler = async () => {
        if(deleteComment.id !== id || !deleteComment.confirm) {
            setDeleteComment({id, confirm: true});
            return;
        }

        setLoading(true);

        try {
            await apiCall({
                path: '/api/board/comment/' + id,
                method: 'DELETE',
                isReturnData: true,
            })
        } catch (err: any) {
            alert(err.response.data.message);
        } finally {
            setLoading(false);
            await refetch();
            setDeleteComment({confirm: false});
        }
    }

    const disabledDeleteConfirm = () => {
        setDeleteComment({confirm: false});
    }

    const selectedAnswerHandler = async () => {
        if(!extraValue) return;

        const newExtraValue  = {
            ...extraValue,
            selectId: id + '',
            selectDate: moment().format('YYYY-MM-DD HH:mm:ss'),
            state: 'completed',
        } as QuestionBlockExtraValueType;

        const list = board.data.content.list.map(item => {
            if(item.code === '00303') {
                return {
                    ...item,
                    extraValue: newExtraValue
                }
            }
            return item;
        }) as BlockI[];

        const body = updateBoard({
            isTemplate: false,
            board: board.data,
            list,
            waitUploadFiles: [],
            waitRemoveFiles: [],
        });


        await apiCall<BoardI, BoardI>({
            path: '/api/board/select-answer/' + board.data.id,
            method: 'PUT',
            body,
            isReturnData: true,
        })
        .then(res => {
            location.href = '/board/' + board.data.id;
        })
    }

    return (
        <div className={['relative flex-col flex sm:flex-row w-full justify-start text-sm sm:shadow shadow-md duration-300', deleteComment.id === id && deleteComment.confirm ? 'bg-red-500 text-white' : 'bg-white text-black'].join(' ')}>
            {
                board?.data?.categoryPk === 3
                && board?.data?.isWriter
                && board.data.writer !== writer
                && extraValue?.state === 'wait'
                && <button className={'w-full h-9 sm:w-[40px] sm:h-auto flex justify-center items-center bg-green-400 text-white hover:bg-green-800 duration-300'}
                           onClick={selectedAnswerHandler}
                >
                    채택 하기
                </button>
            }
            {
                board?.data?.categoryPk === 3
                && extraValue?.state === 'completed'
                && extraValue?.selectId.toString() === id.toString()
                && <button className={'w-full h-9 sm:w-[30px] sm:h-auto px-1 flex justify-center items-center bg-yellow-600 text-white duration-300'}
                           onClick={selectedAnswerHandler}
                >
                    채택
                </button>
            }
            {
                loading
                && <div className={'absolute flex justify-center items-center w-full h-full bg-gray-100 opacity-60'}>
                    <LoadingSpinner size={20} />
                </div>
            }

            <div className={'flex w-full'}>
                {
                    blockSeq
                        ? existBlock
                            ? <Link className={'w-[30px] flex justify-center items-center text-white bg-blue-400 hover:bg-blue-800 duration-300'}
                                href={`${existBlock ? `#block-${blockSeq}` : '' }`}
                                onClick={()=> setSelectedBlock(blockSeq)}
                            >
                                {blockSeq.split('-')[1]}
                            </Link>
                            : <div className={'w-[30px] flex justify-center items-center text-white bg-red-400 line-through'}>
                                {blockSeq.split('-')[1]}
                            </div>
                        : <div className={['w-0 sm:w-[30px]'].join(' ')} />
                }
                <div className={'flex flex-col sm:flex-row w-full'}>
                    <div className={'flex flex-row sm:flex-col w-full justify-between sm:justify-start sm:w-48 gap-2 border-b sm:border-b-0 sm:border-x p-3 border-solid border-gray-200'}
                         onClick={() => {deleteComment.confirm && disabledDeleteConfirm()}}
                    >
                        <div className={'flex gap-2 items-center sm:items-end'}>
                            <Image className={'h-10 w-10 rounded-full'}
                                   src={defaultProfile(profileImage)}
                                   height={50} width={530}
                                   alt={''}
                            />
                            <div className={'flex h-full gap-1 items-center sm:items-end text-xs'}>
                                <span>{writer}</span>
                            </div>
                        </div>
                        <span className={'text-[0.6rem] sm:text-xs'}>{createdAt}</span>
                    </div>
                    <div className={'w-full break-all text-xs p-3'}
                         onClick={() => {deleteComment.confirm && disabledDeleteConfirm()}}
                    >
                        <p className={''}>
                            { content }
                        </p>
                    </div>
                </div>
            </div>
            {
                isWriter
                && extraValue?.selectId.toString() !== id.toString()
                && <button className={'w-full h-9 sm:w-[40px] sm:h-auto flex justify-center items-center bg-red-400 text-white hover:bg-red-800 duration-300'}
                           onClick={deleteHandler}
                >
                    <FontAwesomeIcon icon={faXmark} />
                </button>
            }
        </div>
    )

}

export default Comment;