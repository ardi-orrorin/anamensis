import React from "react";
import {BoardService} from "@/app/board/{services}/BoardProvider";
import {System} from "@/app/user/system/{services}/types";
import {useQueryClient} from "@tanstack/react-query";

type HeaderBtnProps = {
    board    : BoardService;
    submitClickHandler: () => void;
    editClickHandler: () => void;
    deleteClickHandler: () => void;
    blockClickHandler: () => void;
}

const HeaderBtn = ({
    board
    , submitClickHandler, editClickHandler
    , deleteClickHandler, blockClickHandler
}: HeaderBtnProps) => {

    const roles = useQueryClient().getQueryData<System.Role[]>(['userRole']) || [];
    const isView = board.isView;
    const {isWriter, isPublic, isBlocked, isLogin} = board.data;

    return (
        <>
        <div className={"w-auto h-14 flex gap-1 justify-end"}>
            {
                !isView
                && isLogin
                && <button className={"w-16 rounded h-full border-2 border-blue-200 text-blue-400 hover:bg-blue-200 hover:text-white py-1 px-3 text-sm duration-300"}
                           onClick={submitClickHandler}
                >저장
                </button>
            }
            {
                isWriter
                && isLogin
                && <button className={"w-16 rounded h-full border-2 border-blue-200 text-blue-400 hover:bg-blue-200 hover:text-white py-1 px-3 text-sm duration-300"}
                           onClick={editClickHandler}
                >{isView ? "수정" : "취소"}
                </button>
            }
            {
                !isView
                && <button
                    className={"w-16 rounded h-full border-2 border-red-200 text-red-400 hover:bg-red-200 hover:text-white py-1 px-3 text-sm duration-300"}
                    onClick={deleteClickHandler}
                >삭제
                </button>
            }
            {
                isView
                && <button
                    className={"w-16 rounded border-2 border-blue-200 text-blue-400 hover:bg-blue-200 hover:text-white py-1 px-3 text-sm duration-300"}
                >공유
                </button>
            }
            {
                isView
                && isPublic
                && isLogin
                && roles.includes(System.Role.ADMIN)
                && <button className={[
                    "rounded h-full border-2 border-red-200 text-red-400 whitespace-pre hover:bg-red-200 hover:text-white py-1 px-3 text-sm duration-300",
                    isBlocked ? 'w-20' : 'w-16'
                ].join(' ')}
                           onClick={blockClickHandler}
                           disabled={isBlocked}
                >
                    {
                        isBlocked
                        ? '제한된\n게시글'
                        : '열람\n제한'
                    }
                </button>
            }
        </div>
    </>
    );
}

export default React.memo(HeaderBtn, (prev, next) => {
    return prev.board === next.board
});