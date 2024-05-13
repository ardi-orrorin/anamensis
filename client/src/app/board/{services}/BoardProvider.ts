import {BoardI} from "@/app/board/{services}/types";
import {createContext, Dispatch, SetStateAction} from "react";

export interface BoardService {
    data: BoardI;
    isView: boolean;
}

export interface BoardProviderI {
    board: BoardService;
    setBoard: Dispatch<SetStateAction<BoardService>>
}

const BoardProvider = createContext<BoardProviderI>({} as BoardProviderI);

export default BoardProvider;
