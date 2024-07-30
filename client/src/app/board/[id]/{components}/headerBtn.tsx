import {RoleType} from "@/app/user/system/{services}/types";
import {useContext} from "react";
import BoardProvider from "@/app/board/{services}/BoardProvider";

type HeaderBtnProps = {
    roles    : RoleType[];
    submitClickHandler: () => void;
    editClickHandler: () => void;
    deleteClickHandler: () => void;
    blockClickHandler: () => void;
}

const HeaderBtn = (props: HeaderBtnProps) => {
    const {
        roles
        , submitClickHandler, editClickHandler
        , deleteClickHandler, blockClickHandler
    } = props;

    const {board} = useContext(BoardProvider);
    const isView = board.isView;
    const {isWriter, isPublic, isBlocked, isLogin} = board.data;

    return (
        <>
        <div className={"w-auto flex gap-1 justify-end"}>
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
                && roles.includes(RoleType.ADMIN)
                && <button className={"w-16 rounded h-full border-2 border-red-200 text-red-400 hover:bg-red-200 hover:text-white py-1 px-3 text-sm duration-300"}
                           onClick={blockClickHandler}
                           disabled={isBlocked}
                >
                    {
                        isBlocked
                        ? '제한 됨'
                        : '제한 하기'
                    }
                </button>
            }
        </div>
    </>
    );
}

export default HeaderBtn;