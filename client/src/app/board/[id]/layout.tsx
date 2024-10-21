'use client';

import {ReactNode, useCallback, useEffect, useMemo, useState} from "react";
import BoardProvider, {BoardService, BoardTemplateService} from "@/app/board/{services}/BoardProvider";
import {BlockI, BoardI, CommentI, DeleteCommentI} from "@/app/board/{services}/types";
import {SaveComment} from "@/app/board/[id]/{components}/comment";
import {RateInfoI} from "@/app/board/[id]/page";
import apiCall from "@/app/{commons}/func/api";
import {useSearchParams} from "next/navigation";
import {preload} from "swr";
import {initBlock} from "@/app/board/{services}/funcs";
import {BoardSummaryI} from "@/app/user/{services}/userProvider";
import {System} from "@/app/system/message/{services}/types";
import {useQueryClient} from "@tanstack/react-query";
import {TempFileProvider} from "@/app/board/[id]/{hooks}/usePendingFiles";
import boardApiService from "@/app/board/{services}/boardApiService";
import {BlockEventProvider} from "@/app/board/[id]/{hooks}/useBlockEvent";
import {User} from "@/app/login/{services}/types";


export default function Page({children, params} : {children: ReactNode, params: {id: string}}) {

    const profile = useQueryClient().getQueryData<User.UserInfo>(['userProfile']);

    const roles = useQueryClient().getQueryData<System.Role[]>(['userRoles']) || [];

    const [board, setBoard] = useState<BoardService>({} as BoardService);

    const [myPoint, setMyPoint] = useState<number>(0);

    const [summary, setSummary] = useState<BoardSummaryI[]>([]);

    const [deleteComment, setDeleteComment] = useState<DeleteCommentI>({} as DeleteCommentI);

    const [newComment, setNewComment] = useState<SaveComment>({} as SaveComment);

    const [comment, setComment] = useState<CommentI[]>([]);

    const [rateInfo, setRateInfo] = useState<RateInfoI>({} as RateInfoI);

    const [boardTemplate, setBoardTemplate] = useState<BoardTemplateService>({
        isApply: false,
        templateId: 0,
        list: [],
        templates: []
    });

    const isNewBoard = useMemo(() => !params.id || params.id === 'new',[params.id]);
    const isTemplate = useMemo(() => !params.id || params.id === 'temp',[params.id]);

    const searchParams = useSearchParams();

    useEffect(() => {
        if(!isNewBoard && !isTemplate) return ;
        if(isNewBoard && !searchParams?.get('categoryPk') || isNewBoard && searchParams.get('categoryPk') === 'undefined') {
            alert('잘못된 접근입니다.');
            location.href = '/';
            return;
        }

        const categoryPk = Number(searchParams.get('categoryPk') || 0);

        const blockCode = (): {code: string, addBlock : boolean} => {
            switch(categoryPk) {
                case 3  : return {code: '00303', addBlock: true};
                case 4  : return {code: '00301', addBlock: true};
                case 5  : return {code: '00302', addBlock: true};
                case 6  : return {code: '00410', addBlock: true};
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
        if(isNewBoard || isTemplate) return ;

        Promise.allSettled([
            fetchBoard(),
            fetchRate()
        ]);

    },[params.id]);


    useEffect(()=> {
        if(searchParams.get('categoryPk') !== '3') return;
        if(!isNewBoard || board?.isView || isTemplate) return ;

        setMyPoint(profile?.point || 0);

    },[profile])


    const fetchBoard = useCallback( async () => {
        try {
            const res = await preload(`/api/board/${params.id}`, async () => {
                return await apiCall<BoardI & {isLogin : boolean}>({
                    path: '/api/board/' + params.id,
                    method: 'GET',
                    call: 'Proxy'
                })
            })

            if(res.data.isBlocked && !roles?.includes(System.Role.ADMIN)) {
                alert('차단된 게시물입니다.');
                location.href = '/';
                return ;
            }

            setBoard({
                ...board,
                data: res.data,
                isView: true
            });

            const summaryRes = await preload(`/api/board/summary/${params.id}`, async () => {
                return await apiCall<BoardSummaryI[]>({
                    path: '/api/board/user/summary/' + res.data.userId,
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
        }
    },[params.id, board.isView]);

    const fetchRate = useCallback(() => {
        boardApiService.getRateInfo(params.id)
        .then(res => {
            setRateInfo(res.data);
        });
    },[params.id]);

    return (
            <BoardProvider.Provider value={{
                board, setBoard,
                comment, setComment,
                rateInfo, setRateInfo,
                newComment, setNewComment,
                deleteComment, setDeleteComment,
                summary, setSummary,
                myPoint, setMyPoint,
                isTemplate, isNewBoard,
                boardTemplate, setBoardTemplate,
            }}>
                <TempFileProvider>
                    <BlockEventProvider>
                        {children}
                    </BlockEventProvider>
                </TempFileProvider>
            </BoardProvider.Provider>
    )
}