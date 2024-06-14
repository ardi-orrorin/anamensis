import {Dispatch, SetStateAction, useContext, useEffect, useMemo, useState} from "react";
import {CommentI} from "@/app/board/{services}/types";
import Image from "next/image";
import BoardProvider, {BoardService} from "@/app/board/{services}/BoardProvider";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {faComment} from "@fortawesome/free-solid-svg-icons";
import apiCall from "@/app/{commons}/func/api";
import {useRouter} from "next/navigation";
import Link from "next/link";
import {faXmark} from "@fortawesome/free-solid-svg-icons/faXmark";
import {Node} from "postcss";
import BlockProvider from "@/app/board/{services}/BlockProvider";

export type SaveComment = {
    boardPk   : string;
    blockSeq  : string | null;
    content   : string;
    parentPk? : string;
}

const Comment = () => {
    const {comment, setComment, board} = useContext(BoardProvider);
    const {newComment, setNewComment} = useContext(BoardProvider);

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

            await apiCall<boolean, SaveComment>({
                path: '/api/board/comment',
                method: 'POST',
                body,
                isReturnData: true,
            })

            const commentRes = await apiCall<CommentI[], {boardPk: string}>({
                path: '/api/board/comment',
                method: 'GET',
                params: {boardPk: board.data.id},
                isReturnData: true,
            });

            setComment(commentRes);

            setNewComment({
                boardPk: board.data.id,
                content: '',
            } as SaveComment);

        } catch (err: any) {
            alert(err.response.data.message);
        }
    }

    const onDeleteHandler = () => {
        setNewComment({
            ...newComment,
            blockSeq: null,
        });
    }

    if(!board.isView) return <></>

    return (
        <div className={'w-auto flex flex-col gap-4'}>
            <div className={'flex gap-2 text-lg items-center py-2'}>
                <FontAwesomeIcon icon={faComment} />
                <div className={'flex'}>
                    <h2>
                        댓글
                    </h2>
                    <span>
                        ({comment.length})
                    </span>
                </div>

            </div>
            {
                board.isView
                && board.data.isLogin
                && <div className={'w-full flex gap-1'}>
                <button className={[
                    'absolute h-16 flex flex-col justify-center items-center text-xs text-white bg-blue-400 hover:bg-red-600 duration-300'
                ].join(' ')}
                        style={{width: newComment.blockSeq !== undefined && newComment.blockSeq !== null ? '29px' : '0'}}
                        onClick={onDeleteHandler}
                >
                  <span>{newComment.blockSeq?.split('-')[1]}</span>
                </button>
                <textarea className={[
                    'w-full h-16 border border-solid border-gray-200  resize-none text-sm outline-0 duration-300',
                    newComment.blockSeq !== undefined && newComment.blockSeq !== null ? 'pl-10 pr-2 py-2' : 'p-2'
                ].join(' ')}
                          placeholder={'댓글을 입력하세요'}
                          value={newComment.content}
                          onChange={onChange}
                />
                <button className={'w-20 border border-solid border-gray-200 text-gray-700 hover:bg-gray-700 hover:text-white duration-300'}
                        onClick={submitClickHandler}
                >
                  등록
                </button>
              </div>
            }
            <div className={'w-auto flex flex-col gap-4'}>
                {
                    comment.map((item, index) => {
                        return (
                            <CommentItem key={index} {...item} board={board} />
                        )
                    })
                }
            </div>

        </div>
    )
}

const CommentItem = (props: CommentI & {board: BoardService}) => {
    const {blockSeq, content
        , writer, profileImage
        , createdAt, children
        , board , isWriter
        , id
    } = props;


    const {setSelectedBlock} = useContext(BlockProvider);
    const {setComment,deleteComment, setDeleteComment} = useContext(BoardProvider);

    const existBlock = useMemo(()=> {
        return board.data.content.list.find(item => item.hash === blockSeq) !== undefined;
    }, [board.data.content.list, blockSeq]);

    const deleteHandler = async () => {
        if(deleteComment.id !== id || !deleteComment.confirm) {
            setDeleteComment({id, confirm: true});
            return;
        }

        try {
            const deleteRes = await apiCall({
                path: '/api/board/comment/' + id,
                method: 'DELETE',
                isReturnData: true,
            })

            alert(deleteRes ? '삭제 완료 했습니다.' : '삭제에 실패했습니다.');

            const commentRes = await apiCall<CommentI[], {boardPk: string}>({
                path: '/api/board/comment',
                method: 'GET',
                params: {boardPk: board.data.id},
                isReturnData: true,
            });

            setComment(commentRes);

        } catch (err: any) {
            alert(err.response.data.message);
        } finally {
            setDeleteComment({confirm: false});
        }
    }

    const disabledDeleteConfirm = () => {
        setDeleteComment({confirm: false});
    }

    return (
        <div className={['flex-col flex  sm:flex-row w-full justify-start text-sm shadow duration-300', deleteComment.id === id && deleteComment.confirm ? 'bg-red-500 text-white' : 'bg-white text-black'].join(' ')}>
            <div className={'flex w-full'}>
                {
                    blockSeq
                        ? <Link className={['w-[30px] flex justify-center items-center text-white',existBlock ? 'bg-blue-400 hover:bg-blue-800 duration-300' : 'bg-red-400 line-through'].join(' ')}
                                href={`${existBlock ? `#block-${blockSeq}` : '' }`}
                                onClick={()=> setSelectedBlock(blockSeq)}
                        >
                            {blockSeq.split('-')[1]}
                        </Link>
                        : <div className={['w-[30px]'].join(' ')} />
                }
                <div className={'flex flex-col sm:flex-row w-full'}>
                    <div className={'flex flex-row sm:flex-col w-full justify-between sm:justify-start sm:w-48 gap-2 border-b sm:border-x p-3 border-solid border-gray-200'}
                         onClick={() => {deleteComment.confirm && disabledDeleteConfirm()}}
                    >
                        <div className={'flex gap-2 items-center sm:items-end'}>
                            <Image className={'h-6 w-6 rounded-full'}
                                   src={process.env.NEXT_PUBLIC_CDN_SERVER + profileImage}
                                   height={30} width={30}
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
                            {content}
                        </p>
                    </div>
                </div>
            </div>
            {
                isWriter
                && <button className={'w-full h-7 sm:w-[40px] sm:h-auto flex justify-center items-center bg-red-400 text-white hover:bg-red-800 duration-300'}
                           onClick={deleteHandler}
                >
                    <FontAwesomeIcon icon={faXmark} />
                </button>
            }

        </div>
    )

}

export default Comment;