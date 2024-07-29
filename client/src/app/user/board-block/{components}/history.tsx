import {useSearchParams} from "next/navigation";
import {useContext, useMemo} from "react";
import BoardBlockProvider, {BoardBlock} from "@/app/user/board-block/{services}/boardBlockProvider";
import apiCall from "@/app/{commons}/func/api";
import ModalProvider from "@/app/user/board-block/{services}/modalProvider";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {faArrowDown19, faArrowDown91} from "@fortawesome/free-solid-svg-icons";

const History = () => {
    const searchParams = useSearchParams();
    const {boardBlockHistories, page, boardBlock, setBoardBlock} = useContext(BoardBlockProvider);
    const {modal, setModal} = useContext(ModalProvider);
    const maxIndex = useMemo(() => page.total - ((page.page - 1) * page.size),[page]);

    const onClickHandler = async (id: number) => {
        return await apiCall<BoardBlock>({
            path: '/api/user/board-block-history/' + id,
            method: 'GET',
            isReturnData: true,
        })
        .then(res => {
            setBoardBlock(res);
            setModal({
                id, toggle: true
            });
        });
    }

    return (
        <>
            <div className={'flex justify-between h-10'}>
                <div />
                <form className={'flex gap-3'}
                      method={'get'}
                >
                    <div>
                        <select className={'w-32 border border-solid border-gray-300 rounded-md text-sm px-3 py-1 outline-0'}
                                defaultValue={searchParams.size || '20'}
                                name={'size'}
                        >
                            <option value={'10'}>10</option>
                            <option value={'20'}>20</option>
                            <option value={'30'}>30</option>
                            <option value={'50'}>50</option>
                            <option value={'100'}>100</option>
                            <option value={'200'}>200</option>
                        </select>
                    </div>
                    <div>
                        <button className={'w-20 border border-solid border-gray-300 rounded-md text-sm px-3 py-1'}
                                type={'submit'}
                        >
                            조회
                        </button>
                    </div>
                </form>
            </div>
            <table className={'w-full'}>
                <colgroup>
                    <col style={{width: '5%'}}/>
                    <col style={{width: '50%'}}/>
                    <col style={{width: '15%'}}/>
                    <col style={{width: '15%'}}/>
                    <col style={{width: '15%'}}/>
                </colgroup>
                <thead className={'bg-main text-white h-9 align-middle'}>
                <tr className={'text-sm border-x border-white border-solid'}>
                    <th className={'border-x border-white border-solid'}>
                        <FontAwesomeIcon icon={faArrowDown91} />
                    </th>
                    <th className={'border-x border-white border-solid'}>제목</th>
                    <th className={'border-x border-white border-solid'}>제한일</th>
                    <th className={'border-x border-white border-solid'}>답변일</th>
                    <th className={'border-x border-white border-solid'}>결과 확정일</th>
                </tr>
                </thead>
                <tbody className={'text-sm'}>
                {
                    boardBlockHistories.map((history, index) => {
                        return (
                            <tr key={history.id} className={['border-b border-gray-200 border-solid hover:bg-blue-300 hover:text-white duration-300', index % 2 === 1 ? 'bg-blue-50': ''].join(' ')}
                                onClick={() => onClickHandler(history.id)}
                            >
                                <td className={'py-2 px-3'}>{ maxIndex - index }</td>
                                <td className={'py-4 px-3'}>{ history.title }</td>
                                <td className={'py-2 px-3'}>{ history.createdAt }</td>
                                <td className={'py-2 px-3'}>{ history.answerAt }</td>
                                <td className={'py-2 px-3'}>{ history.resultAt }</td>
                            </tr>
                        )
                    })
                }
                </tbody>
            </table>
        </>
    )
}

export default History;