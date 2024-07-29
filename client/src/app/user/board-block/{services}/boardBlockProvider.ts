import {createContext} from "react";
import {UserInfoI} from "@/app/user/email/page";
import {PageI} from "@/app/{commons}/types/commons";


export interface BoardBlock {
    boardPk   : number;
    title     : string;
    reason    : string;
    answer    : string;
    createdAt : string;
    answerAt  : string;
    resultAt  : string;
}

export interface BoardBlockHistoriesI {
    id        : number;
    boardPk   : number;
    title     : string;
    createdAt : string;
    answerAt  : string;
    resultAt  : string;
}
export interface BoardBlockProviderI {
    boardBlock: BoardBlock;
    setBoardBlock: React.Dispatch<React.SetStateAction<BoardBlock>>;
    boardBlockHistories: BoardBlockHistoriesI[];
    setBoardBlockHistories: React.Dispatch<React.SetStateAction<BoardBlockHistoriesI[]>>;
    page: PageI;
    setPage: React.Dispatch<React.SetStateAction<PageI>>;
}

const BoardBlockProvider = createContext({} as BoardBlockProviderI);

export default BoardBlockProvider;