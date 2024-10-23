import {BoardI, BoardTemplate, boardTemplateList, CommentI, DeleteCommentI} from "@/app/board/{services}/types";
import {createContext, Dispatch, SetStateAction} from "react";
import {RateInfoI} from "@/app/board/[id]/page";
import {SaveComment} from "@/app/board/[id]/{components}/comment";
import {BoardSummaryI} from "@/app/user/{services}/userProvider";

export interface BoardService {
    data: BoardI;
    isView: boolean;
}

export interface BoardTemplateService {
    isApply: boolean;
    templateId: number;
    list: boardTemplateList[];
    templates: BoardTemplate[];
}

export interface BoardProviderI {
    board: BoardService;
    setBoard: Dispatch<SetStateAction<BoardService>>
    comment: CommentI[];
    setComment: Dispatch<SetStateAction<CommentI[]>>
    newComment: SaveComment;
    setNewComment: Dispatch<SetStateAction<SaveComment>>;
    deleteComment: DeleteCommentI;
    setDeleteComment: Dispatch<SetStateAction<DeleteCommentI>>;
    summary: BoardSummaryI[];
    setSummary: Dispatch<SetStateAction<BoardSummaryI[]>>;
    myPoint: number;
    setMyPoint: Dispatch<SetStateAction<number>>;
    isNewBoard: boolean;
    isTemplate: boolean;
    boardTemplate: BoardTemplateService;
    setBoardTemplate: Dispatch<SetStateAction<BoardTemplateService>>;
}

const BoardProvider = createContext<BoardProviderI>({} as BoardProviderI);

export default BoardProvider;
