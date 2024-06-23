'use client';
import {ReactNode, useEffect, useMemo, useState} from "react";
import BoardProvider, {BoardService} from "@/app/board/{services}/BoardProvider";
import BlockProvider, {BlockService, CommentService} from "@/app/board/{services}/BlockProvider";
import {BoardI, CommentI, DeleteCommentI} from "@/app/board/{services}/types";
import {SaveComment} from "@/app/board/[id]/{components}/comment";
import {RateInfoI} from "@/app/board/[id]/page";
import TempFileProvider, {TempFileI} from "@/app/board/{services}/TempFileProvider";
import apiCall from "@/app/{commons}/func/api";
import {useSearchParams} from "next/navigation";
import LoadingProvider from "@/app/board/{services}/LoadingProvider";
import useSWR from "swr";

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

        const categoryPk = Number(searchParams.get('categoryPk') || 0);

        const blockCode = (): {code: string, addBlock : boolean} => {
            switch(categoryPk) {
                case 4  : return {code: '00301', addBlock: true};
                case 5  : return {code: '00302', addBlock: true};
                default : return {code: '00005', addBlock: false};
            }
        }

        const list = [{seq: 0, value: '', code: blockCode().code, textStyle: {}, hash: Date.now().toString() + '-0'}];
        blockCode().addBlock && list.push({seq: 1, value: '', code: '00005', textStyle: {}, hash: Date.now().toString() + '-1'});

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

    const initBoard = useSWR(`/api/board/${params.id}`, async () => {
        if(isNewBoard) return ;
        if(params.id === 'new') return ;
        await fetchRate();
    },{
        keepPreviousData: true,
        revalidateOnMount: true,
    });

    const initComment = useSWR(`/api/board/comment/${params.id}`, async () => {
        if(isNewBoard) return ;

        fetchComment();
    },{
        keepPreviousData: true,
        revalidateOnMount: true,
    });

    useEffect(()=> {
        if(isNewBoard) return ;

        setLoading(true);

        fetchBoard();


        // if(params.id === 'new') return ;
        // fetchRate();

    },[params.id])



    const fetchBoard = async () => {
        return await apiCall<BoardI & {isLogin : boolean}>({
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
        }).catch(e => {
            alert(e.response.data);
            location.href = '/';
        })
        .finally(() => {
        setLoading(false);
        });
    }

    const fetchComment = async () => {
        return await apiCall<CommentI[]>({
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

    const fetchRate = async () => {
        await apiCall<RateInfoI>({
            path: '/api/board/rate/' + params.id,
            method: 'GET',
            call: 'Proxy'
        })
        .then(res => {
            setRateInfo(res.data);
        });
    }

    // if(initBoard.isLoading) return <GlobalLoadingSpinner />;

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