'use client';
import {ReactNode, useCallback, useEffect, useMemo, useState} from "react";
import BoardProvider, {BoardService} from "@/app/board/{services}/BoardProvider";
import BlockProvider, {BlockService, CommentService} from "@/app/board/{services}/BlockProvider";
import {BlockI, BoardI, CommentI, DeleteCommentI} from "@/app/board/{services}/types";
import {SaveComment} from "@/app/board/[id]/{components}/comment";
import {RateInfoI} from "@/app/board/[id]/page";
import TempFileProvider, {TempFileI} from "@/app/board/{services}/TempFileProvider";
import apiCall from "@/app/{commons}/func/api";
import {useSearchParams} from "next/navigation";
import LoadingProvider from "@/app/board/{services}/LoadingProvider";
import useSWR, {preload} from "swr";
import {deleteImage, initBlock} from "@/app/board/{services}/funcs";
import {BoardSummaryI} from "@/app/user/{components}/BoardSummary";



export default function Page({children, params} : {children: ReactNode, params: {id: string}}) {

    const [board, setBoard] = useState<BoardService>({} as BoardService);

    const [myPoint, setMyPoint] = useState<number>(0);

    const [summary, setSummary] = useState<BoardSummaryI[]>([]);

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
        if(!isNewBoard && !board?.isView || board.isView) return;

        const beforeunload = (e: BeforeUnloadEvent) => {
            e.preventDefault();
            deleteDummyFiles(waitUploadFiles);
        }

        window.addEventListener('beforeunload', beforeunload)

        return () => {
            window.removeEventListener('beforeunload', beforeunload);
        }
    },[waitUploadFiles])

    const deleteDummyFiles = useCallback((waitUploadFiles: TempFileI[]) =>  {
        waitUploadFiles.forEach(file => {
            const fileUri = file.filePath + file.fileName;
            apiCall({
                path: '/api/file/delete/filename',
                method: 'PUT',
                body: {fileUri},
                isReturnData: true
            });
        })
    },[]);

    useEffect(() => {
        if(!isNewBoard) return ;
        if(!searchParams?.get('categoryPk') || searchParams.get('categoryPk') === 'undefined') {
            alert('잘못된 접근입니다.');
            location.href = '/board/';
        }

        const categoryPk = Number(searchParams.get('categoryPk') || 0);

        const blockCode = (): {code: string, addBlock : boolean} => {
            switch(categoryPk) {
                case 3  : return {code: '00303', addBlock: true};
                case 4  : return {code: '00301', addBlock: true};
                case 5  : return {code: '00302', addBlock: true};
                default : return {code: '00005', addBlock: false};
            }
        }

        const list: BlockI[] = [
            initBlock({seq: 0, code: blockCode().code})
        ];

        blockCode().addBlock
        && list.push(initBlock({seq: 1}));

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

        fetchBoard();

        fetchRate();
    },[params.id]);


    useEffect(()=> {
        if(searchParams.get('categoryPk') !== '3') return;
        if(!isNewBoard || board?.isView) return ;

        preload(`/api/user/get-point`, async () => {
            return await apiCall({
                path: '/api/user/get-point',
                method: 'GET',
                isReturnData: true
            })
        })
        .then(res => {
            setMyPoint(res.point);
        })
    },[])


    const fetchBoard = async () => {
        try {
            const res = await preload(`/api/board/${params.id}`, async () => {
                return await apiCall<BoardI & {isLogin : boolean}>({
                    path: '/api/board/' + params.id,
                    method: 'GET',
                    call: 'Proxy'
                })
            })

            setBoard({
                ...board,
                data: res.data,
                isView: true
            });

            const summaryRes = await preload(`/api/board/summary/${params.id}`, async () => {
                return await apiCall<BoardSummaryI[]>({
                    path: '/api/board/user/summary/' + res.data.writer,
                    method: 'GET',
                    call: 'Proxy',
                    isReturnData: true
                })
            })

            setSummary(summaryRes);

        } catch (e: any) {
            alert(e.response.data);
            location.href = '/';
        } finally {
            setLoading(false);
        }
    }

    const fetchComment = useSWR(`/api/board/comment/${params.id}`, async () => {
        if(isNewBoard) return;
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
    })

    const fetchRate = () => {
        preload(`/api/board/rate/${params.id}`, async () => {
            return await apiCall<RateInfoI>({
                path: '/api/board/rate/' + params.id,
                method: 'GET',
                call: 'Proxy'
            })
        })
        .then(res => {
            setRateInfo(res.data);
        });
    }

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
                deleteComment, setDeleteComment,
                summary, setSummary,
                myPoint, setMyPoint
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