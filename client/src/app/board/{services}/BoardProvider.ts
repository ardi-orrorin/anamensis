import {BoardI, CommentI} from "@/app/board/{services}/types";
import {createContext, Dispatch, SetStateAction} from "react";
import {RateInfoI} from "@/app/board/[id]/page";

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

}

const BoardProvider = createContext<BoardProviderI>({} as BoardProviderI);

export default BoardProvider;
