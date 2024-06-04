import {useContext, useEffect, useState} from "react";
import {CommentI} from "@/app/board/{services}/types";
import Image from "next/image";
import BoardProvider from "@/app/board/{services}/BoardProvider";

const Comment = () => {

    const {comment, setComment} = useContext(BoardProvider);

    // const [comment, setComment] = useState<CommentI>({
    //     id: 1,
    //     content: '댓글 내용 댓글 내용 댓글 내용 댓글 내용댓글 내용 댓글 내용 댓글 내용 댓글 내용댓글 내용 댓글 내용 댓글 내용 댓글 내용댓글 내용 댓글 내용 댓글 내용 댓글 내용',
    //     writer: '작성자',
    //     writerProfile: '/error.gif',
    //     createdAt: '2021-09-01 10:00:00',
    //     children: [],
    // });
    useEffect(()=>{
        setComment([
            {id: 1, content:'댓글 1', writer: '작성자1', writerProfile: '/error.gif', createdAt: '2021-09-01 10:00:00', children: []},
            {id: 1, content:'댓글 1', writer: '작성자1', writerProfile: '/error.gif', createdAt: '2021-09-01 10:00:00', children: []},
            {id: 1, content:'댓글 1', writer: '작성자1', writerProfile: '/error.gif', createdAt: '2021-09-01 10:00:00', children: []},
            {id: 1, content:'댓글 1', writer: '작성자1', writerProfile: '/error.gif', createdAt: '2021-09-01 10:00:00', children: []},
            {id: 1, content:'댓글 1', writer: '작성자1', writerProfile: '/error.gif', createdAt: '2021-09-01 10:00:00', children: []},
            {id: 1, content:'댓글 1', writer: '작성자1', writerProfile: '/error.gif', createdAt: '2021-09-01 10:00:00', children: []},
        ]);

    },[]);

    return (
        <div className={'w-auto flex flex-col gap-2'}>
            {
                comment.map((item, index) => {
                    return (
                        <CommentItem key={index} {...item} />
                    )
                })
            }
        </div>

    )
}

const CommentItem = (props: CommentI) => {
    const {id, content, writer, writerProfile, createdAt, children } = props;
    return (
        <div className={'w-full flex gap-3 justify-start text-sm shadow bg-white py-3 px-2'}>
            <div className={'flex flex-col w-44 gap-2 border-r border-solid border-gray-200'}>
                <div className={'flex gap-2 items-end'}>
                    <Image src={writerProfile} alt={''} height={30} width={30} className={'h-6 w-6 rounded-full'} />
                    <div className={'flex h-full gap-1 items-end text-xs'}>
                        <span>{writer}</span>
                    </div>
                </div>
                <span className={'text-xs'}>{createdAt}</span>
            </div>
            <p className={'w-full'}>
                {content}
            </p>
        </div>
    )

}

export default Comment;