import {BoardI, CommentI, DeleteCommentI} from "@/app/board/{services}/types";
import {createContext, Dispatch, SetStateAction, useState} from "react";
import {RateInfoI} from "@/app/board/[id]/page";
import {SaveComment} from "@/app/board/[id]/{components}/comment";

export interface BoardService {
    data: BoardI;
    isView: boolean;

}

export interface BoardProviderI {
    board: BoardService;
    setBoard: Dispatch<SetStateAction<BoardService>>
    comment: CommentI[];
    setComment: Dispatch<SetStateAction<CommentI[]>>
    rateInfo: RateInfoI;
    setRateInfo: Dispatch<SetStateAction<RateInfoI>>;
    newComment: SaveComment;
    setNewComment: Dispatch<SetStateAction<SaveComment>>;
    deleteComment: DeleteCommentI;
    setDeleteComment: Dispatch<SetStateAction<DeleteCommentI>>;
}

const BoardProvider = createContext<BoardProviderI>({} as BoardProviderI);

export default BoardProvider;
