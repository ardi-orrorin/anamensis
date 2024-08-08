import PageNavigator from "@/app/{commons}/PageNavigator";
import {GetServerSideProps, InferGetServerSidePropsType} from "next";
import apiCall from "@/app/{commons}/func/api";
import Row from "@/app/user/point-history/{components}/Row";
import {GetProps} from "@/app/user/history/page";
import SizeSelect from "@/app/{commons}/sizeSelect";
import {Common} from "@/app/{commons}/types/commons";

export interface PointHistoryI {
    id: number
    tableName: string
    pointCodeName: string
    point: number
    createdAt: string
}

const getServerSideProps: GetServerSideProps<GetProps> = async (context) => {
    const searchParams = new URLSearchParams(context.query as any);
    return {
        props: {
            searchParams,
        }
    }
}

export default async function Page(props: InferGetServerSidePropsType<typeof getServerSideProps>) {
    const {searchParams} = props;
    const {page,content} = await getData(searchParams);

    return (
        <div className={'flex flex-col gap-3'}>
            <div className={'flex justify-end'}>
                <SizeSelect />
            </div>
            <table className={'w-full'}>
                <colgroup>
                    <col style={{width: '5%'}} />
                    <col style={{width: '20%'}} />
                    <col style={{width: '40%'}} />
                    <col style={{width: '10%'}} />
                    <col style={{width: '15%'}} />
                </colgroup>
                <thead className={'bg-main text-white h-9 align-middle'}>
                    <tr className={'text-sm border-x border-white border-solid'}>
                        <th className={'border-x border-white border-solid'}>#</th>
                        <th className={'border-x border-white border-solid'}>테이블명</th>
                        <th className={'border-x border-white border-solid'}>포인트코드 이름</th>
                        <th className={'border-x border-white border-solid'}>포인트</th>
                        <th className={'border-x border-white border-solid'}>적립일시</th>
                    </tr>
                </thead>
                <tbody className={''}>
                {
                    content.map((item, index) => {
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
                    content.length === 0 &&
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


const getData = async (req: URLSearchParams) => {
    return await apiCall<Common.PageResponse<PointHistoryI>, URLSearchParams>({
        path: '/api/point-histories',
        method: 'GET',
        call: 'Server',
        setAuthorization: true,
        params: req
    }).then(res => {
        return res.data;
    });
}
