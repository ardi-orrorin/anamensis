'use client';

import PageNavigator from "@/app/{commons}/PageNavigator";
import apiCall from "@/app/{commons}/func/api";
import {useState} from "react";
import {useSearchParams} from "next/navigation";
import {preload} from "swr";
import BoardBlockProvider from "@/app/user/board-block/{services}/boardBlockProvider";
import History from "@/app/user/board-block/{components}/history";
import Detail from "@/app/user/board-block/{components}/detail";
import ModalProvider, {ModalI} from "@/app/user/board-block/{services}/modalProvider";
import {Common} from "@/app/{commons}/types/commons";
import {BoardBlocking} from "@/app/user/board-block/{services}/types";

export default function Page() {

    const searchParams = useSearchParams();
    const [boardBlockHistories, setBoardBlockHistories] = useState<BoardBlocking.BoardBlockHistories[]>([]);
    const [boardBlock, setBoardBlock] = useState({} as BoardBlocking.BoardBlock);
    const [page, setPage] = useState({} as Common.PageI);
    const [modal, setModal] = useState({} as ModalI);

    preload(['/api/board-block-history', searchParams], async () => {
        return await apiCall<Common.PageResponse<BoardBlocking.BoardBlockHistories>, any>({
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
    })
    .then(res => {
        setBoardBlockHistories(res.content);
        setPage(res.page);
    });

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