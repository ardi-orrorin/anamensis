'use client';

import PageNavigator from "@/app/{commons}/PageNavigator";
import apiCall from "@/app/{commons}/func/api";
import {useEffect, useState} from "react";
import {useSearchParams} from "next/navigation";
import {preload} from "swr";
import BoardBlockProvider from "@/app/user/board-block/{services}/boardBlockProvider";
import History from "@/app/user/board-block/{components}/history";
import Detail from "@/app/user/board-block/{components}/detail";
import ModalProvider, {ModalI} from "@/app/user/board-block/{services}/modalProvider";
import {Common} from "@/app/{commons}/types/commons";
import {BoardBlocking} from "@/app/user/board-block/{services}/types";
import {usePrefetchInfiniteQuery, useQuery} from "@tanstack/react-query";
import boardBlockApiService from "@/app/user/board-block/{services}/boardBlockApiService";
import GlobalLoadingSpinner from "@/app/{commons}/GlobalLoadingSpinner";

export default function Page() {

    const searchParams = useSearchParams();
    const [boardBlock, setBoardBlock] = useState({} as BoardBlocking.BoardBlock);
    const [modal, setModal] = useState({} as ModalI);

    const {data, isLoading} = useQuery(boardBlockApiService.boardBlock(searchParams))
    const {content: boardBlockHistories, page} = data || {content: [], page: {} as Common.PageI};

    if(isLoading) return <GlobalLoadingSpinner />

    return (
        <BoardBlockProvider.Provider value={{
            boardBlockHistories,
            boardBlock, setBoardBlock,
            page,
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