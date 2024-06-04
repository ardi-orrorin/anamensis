type HeaderBtnProps = {
    isView: boolean;
    submitClickHandler: () => void;
    editClickHandler: () => void;
    deleteClickHandler: () => void;
}

const HeaderBtn = (props: HeaderBtnProps) => {
    const {isView
        , submitClickHandler, editClickHandler
        , deleteClickHandler
    } = props;

    return (
        <>
        <div className={"w-auto flex gap-1 justify-end"}>
            {
                !isView &&
              <button
                className={"w-16 rounded h-full border-2 border-blue-200 text-blue-400 hover:bg-blue-200 hover:text-white py-1 px-3 text-sm duration-300"}
                onClick={submitClickHandler}
              >저장
              </button>
            }
            <button
                className={"w-16 rounded h-full border-2 border-blue-200 text-blue-400 hover:bg-blue-200 hover:text-white py-1 px-3 text-sm duration-300"}
                onClick={editClickHandler}
            >{isView ? "수정" : "취소"}
            </button>
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
        </div>
    </>
    );
}

export default HeaderBtn;