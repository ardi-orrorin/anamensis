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

export type SaveComment = {
    boardPk   : string;
    blockSeq  : number | null;
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
                <h2>
                    댓글
                </h2>
            </div>
            <div className={'w-auto flex flex-col gap-2'}>
                {
                    comment.map((item, index) => {
                        return (
                            <CommentItem key={index} {...item} board={board} />
                        )
                    })
                }
            </div>
            {
                board.isView
                && board.data.isLogin
                && <div className={'w-full flex gap-1'}>
                    {
                        <button className={[
                            'flex flex-col justify-center items-center rounded text-xs text-white bg-blue-400 hover:bg-red-600 duration-300 shadow',
                            newComment.blockSeq !== undefined && newComment.blockSeq !== null ? 'w-9' : 'w-0'
                        ].join(' ')}
                                onClick={onDeleteHandler}
                        >
                          <span>{newComment.blockSeq}</span>
                        </button>
                    }
                   <textarea className={'w-full border-2 border-solid border-gray-200 rounded p-2 resize-none text-sm outline-0 shadow'}
                              placeholder={'댓글을 입력하세요'}
                              value={newComment.content}
                              onChange={onChange}
                    />
                  <button className={'w-20 border-2 border-solid border-gray-200 text-gray-700 rounded hover:bg-gray-700 hover:text-white duration-300 shadow'}
                          onClick={submitClickHandler}
                  >
                    등록
                  </button>
                </div>
            }
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

    const {setComment} = useContext(BoardProvider);

    const existBlock = useMemo(()=> {
        return board.data.content.list.find(item => item.seq === blockSeq) !== undefined;
    }, [board.data.content.list, blockSeq]);

    const deleteHandler = async () => {
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
        }
    }

    return (
        <div className={'w-full flex justify-start text-sm shadow bg-white'}>
            {
                blockSeq
                ? <Link className={['w-10 flex justify-center items-center text-white',existBlock ? 'bg-blue-400 hover:bg-blue-800 duration-300' : 'bg-red-400 line-through'].join(' ')}
                        href={`${existBlock ? `#block-${blockSeq}` : '' }`}
                    >
                        {blockSeq}
                    </Link>
                : <div className={['w-10'].join(' ')} />
            }
            <div className={'flex flex-col w-48 gap-2 border-x p-3 border-solid border-gray-200'}>
                <div className={'flex gap-2 items-end'}>
                    <Image className={'h-6 w-6 rounded-full'}
                           src={process.env.NEXT_PUBLIC_CDN_SERVER + profileImage}
                           height={30} width={30}
                           alt={''}
                    />
                    <div className={'flex h-full gap-1 items-end text-xs'}>
                        <span>{writer}</span>
                    </div>
                </div>
                <span className={'text-xs'}>{createdAt}</span>
            </div>
            <div className={'w-full whitespace-pre-wrap text-xs  p-3'}>
                <p>
                    {content}
                </p>
            </div>
            {
                isWriter
                && <button className={'w-10 flex justify-center items-center bg-red-400 text-white hover:bg-red-800 duration-300'}
                           onClick={deleteHandler}
              >
                    <FontAwesomeIcon icon={faXmark} />
                </button>
            }

        </div>
    )

}

export default Comment;