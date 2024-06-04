import {useContext} from "react";
import BlockProvider from "@/app/board/{services}/BlockProvider";
import Image from "next/image";

const CommentModal = () => {
    const {commentService} = useContext(BlockProvider);

    return (
        <div className={'absolute z-30 flex flex-col p-3 rounded gap-2 m-3 bg-white shadow max-h-36 overflow-y-scroll'} style={{top: commentService.screenY, left: commentService.screenX + 200}}>
            {
                commentService.comments.map((item, index) => {
                    return (
                        <div key={index} className={'flex gap-2 text-xs w-56'}>
                            <div className={'w-10 h-10 rounded-full'}>
                                <Image src={process.env.NEXT_PUBLIC_CDN_SERVER + item.profileImage} alt={''} height={50} width={50} />
                            </div>
                            <div className={'flex flex-col gap-1'}>
                                <span>{item.writer}</span>
                                <span>{item.content}</span>
                            </div>
                        </div>
                    )
                })
            }
        </div>
    );
}

export default CommentModal;