import {createContext} from "react";
import {Common} from "@/app/{commons}/types/commons";
import {BoardBlocking} from "@/app/user/board-block/{services}/types";

export interface BoardBlockProviderI {
    boardBlock: BoardBlocking.BoardBlock;
    setBoardBlock: React.Dispatch<React.SetStateAction<BoardBlocking.BoardBlock>>;
    boardBlockHistories: BoardBlocking.BoardBlockHistories[];
    // setBoardBlockHistories: React.Dispatch<React.SetStateAction<BoardBlocking.BoardBlockHistories[]>>;
    page: Common.PageI;
    // setPage: React.Dispatch<React.SetStateAction<Common.PageI>>;
}

const BoardBlockProvider = createContext({} as BoardBlockProviderI);

export default BoardBlockProvider;