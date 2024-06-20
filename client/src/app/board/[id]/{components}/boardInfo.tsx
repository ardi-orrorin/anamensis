import {BoardService} from "@/app/board/{services}/BoardProvider";
import Image from "next/image";
import {useEffect, useMemo} from "react";
import {defaultProfile} from "@/app/{commons}/func/image";

const BoardInfo = (props: { board: BoardService }) => {
    const {board} = props;
    const boardInfo = useMemo(() => {
        return board.data
    }, [board.data]);

    return (
        <div className={"flex gap-2 justify-between px-2"}>
            <div className={"flex flex-col justify-between text-sm"}>
                <p>
                    마지막 수정일: {boardInfo.updatedAt}
                </p>
                <p>
                    조회수: {boardInfo.viewCount}
                </p>

                <p>
                    공개 여부 : &nbsp;
                    <span className={`font-bold ${boardInfo.isPublic ? "text-blue-500" : "text-red-500"}`}
                    >{boardInfo.isPublic ? "공개" : "비공개"}
                    </span>
                </p>
            </div>
            <div className={"flex gap-2 items-center"}>
                <Image src={defaultProfile(board.data.profileImage)}
                       className={"rounded-full border-2 border-solid border-blue-300"}
                       width={35}
                       height={35}
                       alt={""}
                />
                <p className={"font-bold text-sm"}
                >{board.data.writer}</p>
            </div>

        </div>
    );
}

export default BoardInfo;