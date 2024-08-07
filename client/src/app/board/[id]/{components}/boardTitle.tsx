import {BoardService} from "@/app/board/{services}/BoardProvider";
import React from "react";

const BoardTitle = ({
    newBoard,
    board,
    onChange,
    onKeyDown
}: {
    newBoard  : boolean
    board     : BoardService,
    onChange  : (e: React.ChangeEvent<HTMLInputElement>) => void,
    onKeyDown : (e: any) => void,
}) => {

    return <div className={"font-bold flex w-full items-center"}>
        {
            !board.isView
            && board.data
            && <input className={"w-full text-lg px-3 py-2 bg-gray-50 focus:bg-blue-50 hover:bg-blue-50 outline-0 rounded"}
                      name={"title"}
                      value={board.data?.title}
                      onChange={onChange}
                      onKeyDown={onKeyDown}
                      placeholder={"제목을 입력하세요"}
                      autoFocus={true}
            />
        }
        {
            board.isView
            && !newBoard
            && <span className={"flex w-full text-lg py-1 break-all"}
            >{ board.data.title }
            </span>
        }
    </div>;
}

export default React.memo(BoardTitle, (prev, next) => {
    return prev.newBoard === next.newBoard
        && prev.board    === next.board;
});