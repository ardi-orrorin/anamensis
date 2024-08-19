import {BoardService} from "@/app/board/{services}/BoardProvider";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {faHeart} from "@fortawesome/free-solid-svg-icons/faHeart";
import React, {useMemo} from "react";
import {RateInfoI} from "@/app/board/[id]/page";

const Rate = (props: {
    newBoard: boolean,
    onClick: () => void,
    board: BoardService,
    rateInfo: RateInfoI
}) => {

    const {newBoard, onClick, board, rateInfo} = props;

    const rateCount = useMemo(() => {
        return rateInfo?.count !== undefined
            ? rateInfo.count
            : board?.data?.rate;
    },[rateInfo?.count, board.data?.rate]);

    if(!board.data?.isLogin) return <></>

    return (
        <div className={"flex justify-center"}>
            {
                !newBoard && board.isView
                && board.data?.categoryPk !== 1
                && <button
                    className={"px-6 py-3 flex gap-2 justify-center items-center border border-blue-400 text-xl rounded hover:bg-blue-400 hover:text-white duration-300"}
                    onClick={onClick}
                >
                    <FontAwesomeIcon icon={faHeart} className={`${rateInfo.status ? "text-blue-600" : ""}`}/>
                    <span>
                      {rateCount}
                    </span>
              </button>
            }
        </div>
    )
}

export default React.memo(Rate, (prev, next) => {
    return prev.newBoard === next.newBoard
        && prev.rateInfo === next.rateInfo
        && prev.board    === next.board;
});
