import {usePathname, useRouter, useSearchParams} from "next/navigation";
import {useContext, useMemo, useState} from "react";
import BoardBlockProvider, {BoardBlock} from "@/app/user/board-block/{services}/boardBlockProvider";
import apiCall from "@/app/{commons}/func/api";
import ModalProvider from "@/app/user/board-block/{services}/modalProvider";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {faArrowDown91} from "@fortawesome/free-solid-svg-icons";
import {Types} from "@/app/user/board-block/{services}/types";

const History = () => {
    const searchParams = useSearchParams();
    const {boardBlockHistories, page, boardBlock, setBoardBlock} = useContext(BoardBlockProvider);
    const {modal, setModal} = useContext(ModalProvider);
    const [keyword, setKeyword] = useState('');

    const maxIndex = useMemo(() => page.total - ((page.page - 1) * page.size),[page]);

    const router = useRouter();
    const pathname = usePathname();

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

    const onChangeSearchParams = (e: React.ChangeEvent<HTMLSelectElement>) => {
        const {name, value} = e.target;

        const params = new URLSearchParams(searchParams.toString());
        params.set(name, value);

        router.push(pathname + '?' + params.toString());
    }

    const onSearchHandler = () => {
        const params = new URLSearchParams(searchParams.toString());
        params.set('search', 'title');
        params.set('keyword', keyword);
        router.push(pathname + '?' + params.toString());
    }

    const onFilterHandler = (e: React.ChangeEvent<HTMLSelectElement>) => {
        const {name, value} = e.target;
        const params = new URLSearchParams(searchParams.toString());
        params.set('filterType', name);
        params.set('filterKeyword', value);

        if(value === '') {
            params.delete('filterType');
            params.delete('filterKeyword');
        }

        router.push(pathname + '?' + params.toString());
    }

    return (
        <>
            <div className={'flex justify-end h-12 py-2 gap-2'}>
                <select className={'w-28 border border-solid border-gray-300 rounded-md text-sm px-3 py-1 outline-0'}
                        name={'status'}
                        defaultValue={searchParams.get('filterKeyword') || ''}
                        onChange={onFilterHandler}
                >
                    <option value={''}>전체</option>
                    {
                        Types.list.map((status, index) => {
                            return <option key={'index' + status.getStatus()}
                                           value={status.getStatus()}
                            >{status.getKorName()}
                            </option>
                        })
                    }
                </select>
                <select className={'w-28 border border-solid border-gray-300 rounded-md text-sm px-3 py-1 outline-0'}
                        name={'size'}
                        defaultValue={searchParams.get('size') || '20'}
                        onChange={onChangeSearchParams}
                >
                    <option value={'5'}>5</option>
                    <option value={'10'}>10</option>
                    <option value={'20'}>20</option>
                    <option value={'30'}>30</option>
                    <option value={'50'}>50</option>
                    <option value={'100'}>100</option>
                    <option value={'200'}>200</option>
                </select>
            </div>
            <table className={'w-full'}>
                <colgroup>
                    <col style={{width: '5%'}}/>
                    <col style={{width: '60%'}}/>
                    <col style={{width: '10%'}}/>
                    <col style={{width: '25%'}}/>
                </colgroup>
                <thead className={'bg-main text-white h-9 align-middle'}>
                    <tr className={'text-sm border-x border-white border-solid'}>
                        <th className={'border-x border-white border-solid'}>
                            <FontAwesomeIcon icon={faArrowDown91} size={'sm'} height={10} />
                        </th>
                        <th className={'border-x border-white border-solid'}>제목</th>
                        <th className={'border-x border-white border-solid'}>상태</th>
                        <th className={'border-x border-white border-solid'}>최종답변일</th>
                    </tr>
                </thead>
                <tbody className={'text-sm'}>
                {
                    boardBlockHistories.map((history, index) => {
                        return (
                            <tr key={history.id} className={['border-b border-gray-200 border-solid hover:bg-blue-300 hover:text-white active:bg-blue-700 duration-300', index % 2 === 1 ? 'bg-blue-50': ''].join(' ')}
                                onClick={() => onClickHandler(history.id)}
                            >
                                <td className={'py-2 px-3'}>{ maxIndex - index }</td>
                                <td className={'py-4 px-3'}>{ history.title }</td>
                                <td className={'py-4 px-3'}>{ Types.find(history.status)?.getKorName() }</td>
                                <td className={'py-2 px-3'}>{ history.createdAt }</td>
                            </tr>
                        )
                    })
                }
                </tbody>
            </table>
            <div className={'w-full flex gap-1 justify-center py-3 text-xs'}>
                <input className={'w-60 p-2 border border-solid border-blue-200 outline-0 focus:bg-blue-200 rounded duration-300'}
                      type={'text'}
                      placeholder={'검색어를 입력하세요.'}
                      value={keyword}
                      onChange={(e) => setKeyword(e.target.value)}
                      onKeyDown={(e) => e.key === 'Enter' && onSearchHandler()}
                />
                <button className={'py-2 px-4 bg-main text-white rounded duration-300'}
                        onClick={onSearchHandler}
                >검색
                </button>
            </div>
        </>
    )
}

export default History;