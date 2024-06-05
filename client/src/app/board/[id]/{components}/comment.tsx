import {Dispatch, SetStateAction, useContext, useEffect, useState} from "react";
import {CommentI} from "@/app/board/{services}/types";
import Image from "next/image";
import BoardProvider from "@/app/board/{services}/BoardProvider";
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
                            <CommentItem key={index} {...item} />
                        )
                    })
                }
            </div>
            {
                board.isView
                && board.data.isLogin
                && <div className={'flex flex-col gap-2'}>
                    {
                        newComment.blockSeq !== undefined
                        && newComment.blockSeq !== null
                        && <ul className={'flex gap-2'}>
                          <button className={'rounded text-xs py-1 px-3 bg-blue-400 text-white'}
                                  onClick={onDeleteHandler}
                          >
                            <span>B-{newComment.blockSeq} &nbsp;</span>
                            <FontAwesomeIcon icon={faXmark} />
                          </button>
                        </ul>
                    }
                    <div className={'w-full flex gap-2'}>
                       <textarea className={'w-full border-2 border-solid border-gray-200 rounded p-2 resize-none text-sm outline-0'}
                                  placeholder={'댓글을 입력하세요'}
                                  value={newComment.content}
                                  onChange={onChange}
                        />
                      <button className={'w-20 border-2 border-solid border-gray-200 text-gray-700 rounded hover:bg-gray-700 hover:text-white duration-300'}
                              onClick={submitClickHandler}
                      >
                        등록
                      </button>
                    </div>
                </div>
            }
        </div>
    )
}

const CommentItem = (props: CommentI) => {
    const {blockSeq, content, writer, profileImage, createdAt, children } = props;
    return (
        <div className={'w-full flex gap-3 justify-start text-sm shadow bg-white py-3 px-2'}>
            <div className={'flex flex-col w-44 gap-2 border-r border-solid border-gray-200'}>
                <div className={'flex gap-2 items-end'}>
                    <Image src={process.env.NEXT_PUBLIC_CDN_SERVER + profileImage} alt={''} height={30} width={30} className={'h-6 w-6 rounded-full'} />
                    <div className={'flex h-full gap-1 items-end text-xs'}>
                        <span>{writer}</span>
                    </div>
                </div>
                <span className={'text-xs'}>{createdAt}</span>
            </div>
            <div className={'w-full flex flex-col gap-2'}>
                {
                    blockSeq !== null
                    && <span>
                    <Link className={'py-1 px-3 bg-blue-400 text-white text-xs rounded'} href={`#block-${blockSeq}`}>B-{blockSeq}</Link>
                  </span>

                }
                <div className={'w-full whitespace-pre-wrap text-xs'}>
                    <p>
                        {content}
                    </p>
                </div>
            </div>
        </div>
    )

}

export default Comment;