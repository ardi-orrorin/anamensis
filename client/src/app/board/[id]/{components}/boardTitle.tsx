import {BoardService} from "@/app/board/{services}/BoardProvider";

const BoardTitle = (props: {
    board     : BoardService,
    onChange  : (e: React.ChangeEvent<HTMLInputElement>) => void,
    onKeyDown   : (e: any) => void,
    newBoard  : boolean
}) => {

    const {
        board,
        onChange,
        onKeyDown,
        newBoard
    } = props;

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
            >{props.board.data.title} ㄴㅇ랸 어리ㅑ너 이랴ㅓ 니얄 ㅓ닝ㄹ ㅓ닝러 닝러 니어 린야러ㅣㅑㅓ
            </span>
        }
    </div>;
}

export default BoardTitle;