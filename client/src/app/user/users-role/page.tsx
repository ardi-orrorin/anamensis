'use client'

import {useCallback, useMemo, useState} from "react";
import apiCall from "@/app/{commons}/func/api";
import {PageI, PageResponse} from "@/app/{commons}/types/commons";
import {AxiosError} from "axios";
import {useSearchParams} from "next/navigation";
import PageNavigator from "@/app/{commons}/PageNavigator";
import {RoleType} from "@/app/user/system/{services}/types";
import useSWR, {mutate, preload} from "swr";

export type UsersRole = {
    id       : number
    userId   : string
    email    : string
    name     : string
    createAt : string
    isUse    : boolean
    roles    : string[]
}

export default function Page() {

    const searchParams = useSearchParams();

    const [users, setUsers] = useState<UsersRole[]>([]);
    const [page, setPage] = useState<PageI>({} as PageI);

    const maxIndex = useMemo(()=> page.total - ((page.page - 1) * page.size), [page]);

    const {mutate} = useSWR(['/api/user/users-role', searchParams], async () => {
        return await apiCall<PageResponse<UsersRole>>({
            path : '/api/user/users-role',
            method : 'GET',
            params : {
                page: searchParams.get('page') || 1,
                size: searchParams.get('size') || 20
            },
            isReturnData: true
        })
        .then(res => {
            setUsers(res.content);
            setPage(res.page);
        })
        .catch(e => {
            const err = e as AxiosError
            if(Number(err?.response?.status) === 403){
                alert('접근 권한이 없습니다.')
                return window.location.href = '/user';
            }
        });
    })


    const onChangeRole = async (mode: 'add' | 'delete', user: UsersRole, selRole : RoleType) => {
        if(selRole as string === '') return;
        if(mode === 'delete' && user.roles.length === 1) {
            return alert('최소 한 개 이상의 권한은 보유해야 합니다.')
        }

        const body = {
            id: user.id,
            role: selRole,
            mode,
        }

        try {
            const res = await apiCall({
                path : '/api/user/users-role',
                method : 'PUT',
                body,
                isReturnData: true
            });

            if(!res) return;
            await mutate();
        } catch (e) {
            const err = e as AxiosError
        }
    }


    return (
        <div className={'flex w-full h-full flex-col'}>
            <table className={'w-full'}>
                <colgroup>
                    <col style={{width: '3%'}}/>
                    <col style={{width: '10%'}}/>
                    <col style={{width: '10%'}}/>
                    <col style={{width: '10%'}}/>
                    <col style={{width: '25%'}}/>
                    <col style={{width: '15%'}}/>
                    <col style={{width: '7%'}}/>
                    <col style={{width: '10%'}}/>
                    <col style={{width: '10%'}}/>
                </colgroup>
                <thead className={'bg-blue-300 text-white h-8 align-middle'}>
                    <tr className={'text-sm border-x border-white border-solid'}>
                        <th className={'border-x border-white border-solid'}>#</th>
                        <th className={'border-x border-white border-solid'}>아이디</th>
                        <th className={'border-x border-white border-solid'}>이름</th>
                        <th className={'border-x border-white border-solid'}>이메일</th>
                        <th className={'border-x border-white border-solid'}>권한 목록</th>
                        <th className={'border-x border-white border-solid'}>생성일</th>
                        <th className={'border-x border-white border-solid'}>사용</th>
                        <th className={'border-x border-white border-solid'}>권한추가</th>
                        <th className={'border-x border-white border-solid'}>권한삭제</th>
                    </tr>
                </thead>
            <tbody className={'text-sm'}>
            {
                users.map((user, index) => {
                    return (
                        <tr key={'user-role' + user.id} className={['border-b border-gray-200 border-solid', index % 2 === 1 ? 'bg-blue-50': ''].join(' ')}>
                            <td className={'py-2 px-3'}>
                                { maxIndex - index }
                            </td>
                            <td className={'py-4 px-3'}>
                                { user.userId }
                            </td>
                            <td className={'py-2 px-3'}>
                                { user.name }
                            </td>
                            <td className={'py-2 px-3'}>
                                { user.email }
                            </td>
                            <td className={'py-2 px-3'}>
                                {
                                    user.roles.map(role =>
                                        <span key={'user-role-roles' + role}
                                             className={'text-sm px-1'}
                                        >{ role }
                                        </span>
                                    )
                                }
                            </td>
                            <td className={'py-2 px-3'}>
                                { user.createAt }
                            </td>
                            <td className={'py-2 px-3'}>
                                { user.isUse ? '사용' : '비사용' }
                            </td>
                            <td className={'py-2 px-3'}>
                                <select onChange={e => onChangeRole('add', user, e.target.value as RoleType)}>
                                    <option value={''}>선택</option>
                                    {
                                        !user.roles.includes('ADMIN')
                                        && <option value={'ADMIN'}>ADMIN</option>
                                    }
                                    {
                                        !user.roles.includes('GUEST')
                                        && <option value={'GUEST'}>GUEST</option>
                                    }
                                </select>
                            </td>
                            <td className={'py-2 px-3'}>
                                <select onChange={e => onChangeRole('delete', user, e.target.value as RoleType)}>
                                    <option value={''}>선택</option>
                                    {
                                        user.roles.map(role => {
                                            if(role === 'MASTER') return;
                                            return (
                                                <option key={'user-role-roles-option' + role}
                                                        value={role}
                                                >{ role }
                                                </option>
                                            )
                                        })
                                    }
                                </select>
                            </td>
                        </tr>
                    )
                })
            }
            </tbody>
        </table>
            {
                page.total
                && <PageNavigator {...page} />
            }
        </div>
    )
}