import {BoardService} from "@/app/board/{services}/BoardProvider";
import Image from "next/image";

const BoardInfo = (props: { board: BoardService }) => {
    const {board} = props;

    console.log(board.data)
    return (
        <div className={"flex gap-2 justify-between px-2"}>
            <div className={"flex flex-col justify-between text-sm"}>
                <p>
                    마지막 수정일: {board.data.updatedAt}
                </p>
                <p>
                    조회수: {board.data.viewCount}
                </p>
            </div>
            <div className={"flex gap-2 items-center"}>
                {
                    board?.data?.profileImage &&
                    <Image src={process.env.NEXT_PUBLIC_CDN_SERVER + board.data.profileImage}
                           className={"rounded-full border-2 border-solid border-blue-300"}
                           width={35}
                           height={35}
                           alt={""}
                    />
                }
                <p className={"font-bold text-sm"}
                >{board.data.writer}</p>
            </div>
        </div>
    );
}

export default BoardInfo;