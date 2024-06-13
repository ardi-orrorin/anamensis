'use client';
import {ReactNode, useEffect, useMemo, useState} from "react";
import BoardProvider, {BoardService} from "@/app/board/{services}/BoardProvider";
import BlockProvider, {BlockService, CommentService} from "@/app/board/{services}/BlockProvider";
import {BoardI, CommentI, DeleteCommentI} from "@/app/board/{services}/types";
import {SaveComment} from "@/app/board/[id]/{components}/comment";
import {RateInfoI} from "@/app/board/[id]/page";
import TempFileProvider, {TempFileI} from "@/app/board/{services}/TempFileProvider";
import apiCall from "@/app/{commons}/func/api";
import {createDebounce} from "@/app/{commons}/func/debounce";
import {useSearchParams} from "next/navigation";
import LoadingProvider from "@/app/board/{services}/LoadingProvider";

export default function Page({children, params} : {children: ReactNode, params: {id: string}}) {

    const [board, setBoard] = useState<BoardService>({} as BoardService);

    const [selectedBlock, setSelectedBlock] = useState<String>('');

    const [commentService, setCommentService] = useState<CommentService>({} as CommentService);

    const [deleteComment, setDeleteComment] = useState<DeleteCommentI>({} as DeleteCommentI);

    const [newComment, setNewComment] = useState<SaveComment>({} as SaveComment);

    const [comment, setComment] = useState<CommentI[]>([]);

    const [rateInfo, setRateInfo] = useState<RateInfoI>({} as RateInfoI);

    const [blockService, setBlockService] = useState<BlockService>({} as BlockService);

    const [waitUploadFiles, setWaitUploadFiles] = useState<TempFileI[]>([]);
    const [waitRemoveFiles, setWaitRemoveFiles] = useState<TempFileI[]>([]);

    const isNewBoard = useMemo(() => !params.id || params.id === 'new',[params.id]);

    const searchParams = useSearchParams();

    const [loading, setLoading] = useState<boolean>(false);
    const [commentLoading, setCommentLoading] = useState<boolean>(false);


    useEffect(() => {
        if(!isNewBoard) return ;
        if(!searchParams?.get('categoryPk') || searchParams.get('categoryPk') === 'undefined') {
            alert('잘못된 접근입니다.');
            location.href = '/board/';
        }

        const list = [{seq: 0, value: '', code: '00005', textStyle: {}, hash: Date.now().toString() + '-0'}];

        setBoard({
            ...board,
            data: {
                ...board.data,
                content: {list},
                categoryPk: Number(searchParams.get('categoryPk') || 0),
                title: '', writer: ''
            },
            isView: false
        });
    },[params.id]);


    useEffect(() => {
        setSelectedBlock(window.location.hash.replace('#block-', '') || '');
    },[]);

    useEffect(() => {
        if(isNewBoard) return ;

        setLoading(true);

        const fetch = async () => {
            await apiCall<BoardI & {isLogin : boolean}>({
                path: '/api/board/' + params.id,
                method: 'GET',
                call: 'Proxy'
            })
                .then(res => {
                    setBoard({
                        ...board,
                        data: res.data,
                        isView: true
                    });
                }).finally(() => {
                    setLoading(false);
                });
        }

        const debounce = createDebounce(300);
        debounce(fetch);

    },[params.id]);

    useEffect(() => {
        if(isNewBoard) return ;

        setCommentLoading(true);
        const fetch = async () => {
            await apiCall<CommentI[]>({
                path: '/api/board/comment',
                method: 'GET',
                params: {boardPk: params.id},
                call: 'Proxy'
            })
                .then(res => {
                    setComment(res.data);
                })
                .finally(() => {
                    setCommentLoading(false);
                });
        }

        const debounce = createDebounce(300);
        debounce(fetch);

    },[params.id]);

    useEffect(() => {
        if(params.id === 'new') return ;
        const fetch = async () => {
            await apiCall<RateInfoI>({
                path: '/api/board/rate/' + params.id,
                method: 'GET',
                call: 'Proxy'
            }).then(res => {
                setRateInfo(res.data);
            });
        }

        const debounce = createDebounce(300);
        debounce(fetch);
    },[params.id]);


    return (
        <LoadingProvider.Provider value={{
            loading, setLoading,
            commentLoading, setCommentLoading
        }}>
            <BoardProvider.Provider value={{
                board, setBoard,
                comment, setComment,
                rateInfo, setRateInfo,
                newComment, setNewComment,
                deleteComment, setDeleteComment
            }}>
                <TempFileProvider.Provider value={{
                    waitUploadFiles, setWaitUploadFiles,
                    waitRemoveFiles, setWaitRemoveFiles,
                }}>
                    <BlockProvider.Provider value={{
                        blockService, setBlockService,
                        commentService, setCommentService,
                        selectedBlock, setSelectedBlock,
                    }}>
                        {children}
                    </BlockProvider.Provider>
                </TempFileProvider.Provider>
            </BoardProvider.Provider>
        </LoadingProvider.Provider>
    )
}