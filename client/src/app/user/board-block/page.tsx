'use client';

import PageNavigator from "@/app/{commons}/PageNavigator";
import {PageI, PageResponse} from "@/app/{commons}/types/commons";
import apiCall from "@/app/{commons}/func/api";
import {useMemo, useState} from "react";
import {useSearchParams} from "next/navigation";
import useSWR from "swr";
import BoardBlockProvider, {
    BoardBlock,
    BoardBlockHistoriesI
} from "@/app/user/board-block/{services}/boardBlockProvider";
import History from "@/app/user/board-block/{components}/history";
import Detail from "@/app/user/board-block/{components}/detail";
import ModalProvider, {ModalI} from "@/app/user/board-block/{services}/modalProvider";

export default function Page() {

    const searchParams = useSearchParams();
    const [boardBlockHistories, setBoardBlockHistories] = useState<BoardBlockHistoriesI[]>([]);
    const [boardBlock, setBoardBlock] = useState({} as BoardBlock);
    const [page, setPage] = useState({} as PageI);
    const [modal, setModal] = useState({} as ModalI);

    const {mutate} = useSWR(['/api/board-block-history', searchParams], async () => {
        return await apiCall<PageResponse<BoardBlockHistoriesI>, any>({
            path: '/api/user/board-block-history',
            method: 'GET',
            params: {
                size: searchParams.get('size') || '20',
                page: searchParams.get('page') || '1',
                keyword: searchParams.get('keyword') || '',
                search: searchParams.get('search') || '',
                filterType: searchParams.get('filterType') || '',
                filterKeyword: searchParams.get('filterKeyword') || '',
            },
            isReturnData: true,
        })
        .then(res => {
            setBoardBlockHistories(res.content);
            setPage(res.page);
        });
    }, {});

    return (
        <BoardBlockProvider.Provider value={{
            boardBlockHistories, setBoardBlockHistories,
            boardBlock, setBoardBlock,
            page, setPage,
        }}>
            <ModalProvider.Provider value={{
                modal, setModal
            }}>
                <div className={'flex flex-col gap-2'}>
                    <History />
                    <PageNavigator {...page} />
                    {
                        modal.toggle
                        && <Detail />
                    }
                </div>
            </ModalProvider.Provider>
        </BoardBlockProvider.Provider>
    )
}