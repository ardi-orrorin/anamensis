import {BoardService} from "@/app/board/{services}/BoardProvider";
import Image from "next/image";

const BoardInfo = (props: { board: BoardService }) => {
    const {board} = props;
    return (
        <div className={"flex gap-2 justify-between"}>
            <div className={"flex flex-col justify-between text-sm"}>
                <p>
                    작성일: {board.data.createdAt}
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
                           width={50}
                           height={50}
                           alt={""}
                    />
                }
                <p className={"font-bold"}
                >{board.data.writer}</p>
            </div>
        </div>
    );
}

export default BoardInfo;