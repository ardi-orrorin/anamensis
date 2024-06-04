import {BoardService} from "@/app/board/{services}/BoardProvider";

const BoardTitle = (props: {
    board: BoardService,
    onChange: (e: React.ChangeEvent<HTMLInputElement>) => void,
    onKeyUp: (e: any) => void,
    newBoard: boolean
}) => {
    return <div className={"font-bold flex items-center w-full"}>
        {
            !props.board.isView
            && props.board.data
            && <input
            className={"w-full text-lg px-3 py-2 bg-gray-50 focus:bg-blue-50 hover:bg-blue-50 outline-0 rounded"}
            name={"title"}
            value={props.board.data?.title}
            onChange={props.onChange}
            onKeyUp={props.onKeyUp}
            placeholder={"제목을 입력하세요"}
          />
        }
        {
            props.board.isView
            && !props.newBoard
            && <span className={"w-full text-lg py-1"}
          >{props.board.data.title}</span>
        }
    </div>;
}

export default BoardTitle;