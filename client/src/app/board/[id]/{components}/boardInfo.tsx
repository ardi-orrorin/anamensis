import {BoardI} from "@/app/board/{services}/types";
import React from "react";

const BoardInfo = ({
    updatedAt, viewCount,
    isPublic, membersOnly,
    writer
}: BoardI) => {

    return (
        <div className={"flex justify-between px-2"}>
            <div className={"flex flex-col justify-between text-sm"}>
                <p className={'flex flex-col sm:flex-row'}>
                    <span>
                        마지막 수정일: &nbsp;
                    </span>
                    <span>
                        {updatedAt}
                    </span>
                </p>
                <p>
                    조회수: {viewCount}
                </p>
                <p className={"font-bold"}>
                    작성자: {writer}
                </p>
            </div>
            <div className={"flex flex-col items-end text-sm"}>
                <p>
                    공개 여부 : &nbsp;
                    <span className={`font-bold ${isPublic ? "text-blue-500" : "text-red-500"}`}
                    >{isPublic ? "공개" : "비공개"}
                    </span>
                </p>
                <p>
                    회원 전용 여부 : &nbsp;
                    <span className={`font-bold ${membersOnly ? "text-yellow-600" : "text-blue-500"}`}
                    >{membersOnly ? "회원 전용" : "모두"}
                    </span>
                </p>
            </div>
        </div>
    );
}

export default React.memo(BoardInfo, (prev, next) => {
    return prev.updatedAt   === next.updatedAt
        && prev.viewCount   === next.viewCount
        && prev.isPublic    === next.isPublic
        && prev.membersOnly === next.membersOnly
        && prev.writer      === next.writer
});