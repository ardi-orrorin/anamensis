'use client';
import {useEffect, useMemo, useState} from "react";
import axios, {AxiosResponse} from "axios";
import LoadingSpinner from "@/app/{commons}/LoadingSpinner";
import PageNavigator from "@/app/{commons}/PageNavigator";
import {PageI, PageResponse} from "@/app/{commons}/types/commons";
import {useRouter, useSearchParams} from "next/navigation";
import Row from "@/app/user/smtp-history/{components}/Row";

export interface SmtpHistoryI {
    id: number;
    subject: string;
    status: string;
    message: string;
    createAt: string;
}

export default function Page() {
    const search = useSearchParams();
    const router = useRouter();

    const [smtpHistory, setSmtpHistory] = useState<SmtpHistoryI[]>([]);
    const [loading, setLoading] = useState<boolean>(false);
    const [page, setPage] = useState<PageI>({} as PageI);

    useEffect(() => {
        setLoading(true);
        axios.get('/api/user/smtp-history', {
            params: {
                page: search.get('page') || 1,
                size: search.get('size') || 10,
            }
        })
            .then((res: AxiosResponse<PageResponse<SmtpHistoryI>>) => {
                setPage(res.data.page);
                setSmtpHistory(res.data.content);
            })
            .finally(() => {
                setLoading(false);
            });
    },[search]);

    const onChangeHandler = (e: React.ChangeEvent<HTMLSelectElement>) => {
        const searchParams = new URLSearchParams(search);
        searchParams.set('size', e.target.value);
        searchParams.set('page', '1');
        router.push(`?${searchParams}`);
    };

    return (
        <div className={'flex flex-col gap-3'}>
            <div className={'flex justify-between'}>
                <div></div>
                <div className={'flex justify-end'}>
                    <select value={search.get('size') || 10} onChange={onChangeHandler}>
                        <option value={'10'}>10</option>
                        <option value={'30'}>30</option>
                        <option value={'100'}>100</option>
                    </select>
                </div>
            </div>
            <table className={'w-full'}>
                <colgroup>
                    <col style={{width: '5%'}} />
                    <col style={{width: '20%'}} />
                    <col style={{width: '40%'}} />
                    <col style={{width: '10%'}} />
                    <col style={{width: '15%'}} />
                </colgroup>
                <thead className={'bg-blue-300 text-white h-8 align-middle'}>
                    <tr className={'text-sm border-x border-white border-solid'}>
                        <th className={'border-x border-white border-solid'}>#</th>
                        <th className={'border-x border-white border-solid'}>제목</th>
                        <th className={'border-x border-white border-solid'}>상태메시지</th>
                        <th className={'border-x border-white border-solid'}>전송상태</th>
                        <th className={'border-x border-white border-solid'}>전송일시</th>
                    </tr>
                </thead>
                <tbody className={''}>
                {
                    loading
                    ? <LoadingSpinner size={20} />
                    : smtpHistory.map((item, index) => {
                        return (
                            <Row key={index}
                                 index={index}
                                 rowNum={page.total - ((page.page - 1) * page.size) - index}
                                 {...item}
                            />
                        )
                    })
                }
                {
                    smtpHistory.length === 0 &&
                    <tr>
                      <td className={'text-center py-5'}
                          colSpan={5}
                      >조회할 내용이 없습니다.</td>
                    </tr>
                }
                </tbody>
            </table>
            <PageNavigator {...page} />
        </div>
    );
}

