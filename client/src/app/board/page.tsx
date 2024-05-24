import {GetServerSideProps, InferGetServerSidePropsType} from "next";
import {PageResponse} from "@/app/{commons}/types/commons";
import PageNavigator from "@/app/{commons}/PageNavigator";
import Link from "next/link";
import {cookies} from "next/headers";
import Image from "next/image";
import apiCall from "@/app/{commons}/func/api";

interface BoardListI {
    id           : string;
    title        : string;
    viewCount    : number;
    rate         : number;
    writer       : string;
    profileImage?: string;
    createdAt    : string;
}

export interface GetProps {
    searchParams: URLSearchParams;
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
    const data = await getData(searchParams);
    const maxIndex = data.page.total - ((data.page.page - 1) * data.page.size);
    const isLogin = cookies().get('next.access.token') || cookies().get('next.refresh.token') !== undefined;

    return (
        <div className={'p-5'}>
            <div className={'flex justify-between h-10'}
            >
                <div>
                    {
                        isLogin &&
                        <Link href={'/board/new'}
                              className={'w-auto'}
                        >
                          <button className={'w-20 border border-solid border-blue-300 rounded-md text-sm px-3 py-1'}>
                            글쓰기
                          </button>
                        </Link>
                    }
                </div>
                <form className={'flex gap-3'}
                      method={'get'}
                >
                    <div>
                        <select className={'w-32 border border-solid border-blue-300 rounded-md text-sm px-3 py-1'}
                                defaultValue={searchParams.size}
                                name={'size'}
                        >
                            <option value={10}>10</option>
                            <option value={20}>20</option>
                            <option value={30}>30</option>
                            <option value={50}>50</option>
                            <option value={100}>100</option>
                            <option value={200}>200</option>
                        </select>
                    </div>
                    <div>
                        <button className={'w-20 border border-solid border-blue-300 rounded-md text-sm px-3 py-1'}
                                type={'submit'}
                        >
                            조회
                        </button>
                    </div>
                </form>
            </div>
            <table className={'w-full'}>
                <colgroup>
                    <col style={{width: '5%'}}/>
                    <col style={{width: '55%'}}/>
                    <col style={{width: '5%'}}/>
                    <col style={{width: '5%'}}/>
                    <col style={{width: '10%'}}/>
                    <col style={{width: '20%'}}/>
                </colgroup>
                <thead className={'bg-blue-300 text-white h-8 align-middle'}>
                    <tr className={'text-sm border-x border-white border-solid'}>
                        <th className={'border-x border-white border-solid'}>#</th>
                        <th className={'border-x border-white border-solid'}>제목</th>
                        <th className={'border-x border-white border-solid'}>View</th>
                        <th className={'border-x border-white border-solid'}>Like</th>
                        <th className={'border-x border-white border-solid'}>작성자</th>
                        <th className={'border-x border-white border-solid'}>작성일자</th>
                    </tr>
                </thead>
                <tbody className={'text-sm'}>
                {
                    data.content.map((history, index) => {
                        return (
                            <tr key={'boards' + history.id}
                                className={[
                                    'w-full border-b border-blue-200 border-solid',
                                    index % 2 === 1 ? 'bg-blue-50': ''
                                ].join(' ')}
                            >
                                <td className={'py-2 px-3 text-center'}>{ maxIndex - index }</td>
                                <td className={'py-2 px-3'}>
                                    <Link href={'/board/' + history.id}
                                          className={'w-auto'}
                                    >
                                        { history.title }
                                    </Link>
                                </td>
                                <td className={'py-2 px-3'}>{ history.viewCount }</td>
                                <td className={'py-2 px-3'}>{ history.rate }</td>
                                <td className={'py-2 px-3 flex gap-2 items-center'}>
                                    {
                                        history.profileImage &&
                                        <Image src={ process.env.NEXT_PUBLIC_CDN_SERVER + history.profileImage}
                                               className={'rounded-full border border-solid border-blue-300 bg-cover bg-center'}
                                               width={20}
                                               height={20}
                                               alt={''}
                                        />
                                    }
                                    { history.writer }
                                </td>
                                <td className={'py-2 px-3'}>{ history.createdAt }</td>
                            </tr>
                        )
                    })
                }
                </tbody>
            </table>
            <PageNavigator {...data!.page} />
        </div>
    )
}

const getData = async (req: URLSearchParams) => {

    return apiCall<PageResponse<BoardListI>, URLSearchParams>({
        path: '/public/api/boards',
        method: 'GET',
        call: 'Server',
        params: req,
    }).then(res => {
        return res.data;
    });
}
