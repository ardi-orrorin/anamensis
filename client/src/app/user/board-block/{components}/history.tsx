import {usePathname, useRouter, useSearchParams} from "next/navigation";
import {useCallback, useContext, useMemo, useState} from "react";
import BoardBlockProvider from "@/app/user/board-block/{services}/boardBlockProvider";
import apiCall from "@/app/{commons}/func/api";
import ModalProvider from "@/app/user/board-block/{services}/modalProvider";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {faArrowDown91} from "@fortawesome/free-solid-svg-icons";
import SizeSelect from "@/app/{commons}/sizeSelect";
import StatusSelect from "@/app/user/board-block/{components}/statusSelect";
import {BoardBlockStatus} from "@/app/user/board-block/{services}/objects";
import {BoardBlocking} from "@/app/user/board-block/{services}/types";

const History = () => {
    const searchParams = useSearchParams();
    const {boardBlockHistories, page, boardBlock, setBoardBlock} = useContext(BoardBlockProvider);
    const {modal, setModal} = useContext(ModalProvider);
    const [keyword, setKeyword] = useState('');

    const maxIndex = useMemo(() => page.total - ((page.page - 1) * page.size),[page]);

    const router = useRouter();
    const pathname = usePathname();

    const onClickHandler = useCallback(async (id: number) => {
        return await apiCall<BoardBlocking.BoardBlock>({
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
    },[]);

    const onSearchHandler = useCallback(() => {
        const params = new URLSearchParams(searchParams.toString());
        params.set('search', 'title');
        params.set('keyword', keyword);
        router.push(pathname + '?' + params.toString());
    },[searchParams, keyword]);

    const onFilterHandler = useCallback((e: React.ChangeEvent<HTMLSelectElement>) => {
        const {name, value} = e.target;
        const params = new URLSearchParams(searchParams.toString());
        params.set('filterType', name);
        params.set('filterKeyword', value);

        if(value === '') {
            params.delete('filterType');
            params.delete('filterKeyword');
        }

        router.push(pathname + '?' + params.toString());
    },[searchParams]);

    const list = useMemo(() =>
        boardBlockHistories.map((history, index) => {
            return (
                <tr key={history.id} className={['border-b border-gray-200 border-solid hover:bg-blue-300 hover:text-white active:bg-blue-700 duration-300', index % 2 === 1 ? 'bg-blue-50': ''].join(' ')}
                    onClick={() => onClickHandler(history.id)}
                >
                    <td className={'py-2 px-3'}>{ maxIndex - index }</td>
                    <td className={'py-4 px-3'}>{ history.title }</td>
                    <td className={'py-4 px-3'}>{ BoardBlockStatus.find(history.status)?.getKorName() }</td>
                    <td className={'py-2 px-3'}>{ history.createdAt }</td>
                </tr>
            )
        })
    ,[boardBlockHistories]);

    return (
        <div className={'w-full'}>
            <div className={'flex justify-end h-12 py-2 gap-2'}>
                <StatusSelect {...{onFilterHandler}} />
                <SizeSelect />
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
                { list }
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
        </div>
    )
}

export default History;