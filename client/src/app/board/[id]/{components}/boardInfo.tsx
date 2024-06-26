import {BoardService} from "@/app/board/{services}/BoardProvider";
import Image from "next/image";
import {defaultProfile} from "@/app/{commons}/func/image";
import {BoardI} from "@/app/board/{services}/types";

const data = (props: BoardService) => {
    const {
        updatedAt, viewCount,
        isPublic, membersOnly,
        writer, profileImage
    }: BoardI = props.data;

    return (
        <div className={"flex gap-2 justify-between px-2"}>
            <div className={"flex flex-col justify-between text-sm"}>
                <p>
                    마지막 수정일: {updatedAt}
                </p>
                <p>
                    조회수: {viewCount}
                </p>
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
            <div className={"flex flex-col gap-2 justify-between"}>
                <Image src={defaultProfile(profileImage)}
                       className={"rounded-full border-2 border-solid border-blue-300"}
                       width={50}
                       height={50}
                       alt={""}
                />
                <p className={"font-bold"}
                >{writer}</p>
            </div>
        </div>
    );
}

export default data;