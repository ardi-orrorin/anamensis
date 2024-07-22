import PageNavigator from "@/app/{commons}/PageNavigator";
import {PageResponse} from "@/app/{commons}/types/commons";
import Row from "@/app/user/smtp-history/{components}/Row";
import {GetServerSideProps, InferGetServerSidePropsType} from "next";
import {GetProps} from "@/app/user/history/page";
import apiCall from "@/app/{commons}/func/api";

export interface SmtpHistoryI {
    id: number;
    subject: string;
    status: string;
    message: string;
    createAt: string;
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
            <div className={'flex justify-between'}>
                <div></div>
                <form className={'flex gap-3'}
                      method={'get'}
                >
                    <div>
                        <select className={'w-32 border border-solid border-gray-300 rounded-md text-sm px-3 py-1 outline-0'}
                                defaultValue={searchParams.size || '20'}
                                name={'size'}
                        >
                            <option value={'10'}>10</option>
                            <option value={'20'}>20</option>
                            <option value={'30'}>30</option>
                            <option value={'50'}>50</option>
                            <option value={'100'}>100</option>
                            <option value={'200'}>200</option>
                        </select>
                    </div>
                    <div>
                        <button className={'w-20 border border-solid border-gray-300 rounded-md text-sm px-3 py-1'}
                                type={'submit'}
                        >
                            조회
                        </button>
                    </div>
                </form>
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
                        <th className={'border-x border-white border-solid'}>제목</th>
                        <th className={'border-x border-white border-solid'}>상태메시지</th>
                        <th className={'border-x border-white border-solid'}>전송상태</th>
                        <th className={'border-x border-white border-solid'}>전송일시</th>
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
    return await apiCall<PageResponse<SmtpHistoryI>, URLSearchParams>({
        path: '/api/smtp-push-history',
        method: 'GET',
        call: 'Server',
        setAuthorization: true,
        params: req
    }).then(res => {
        return res.data;
    });
}
