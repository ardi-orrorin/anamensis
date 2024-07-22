import {GetServerSideProps, InferGetServerSidePropsType} from "next";
import PageNavigator from "@/app/{commons}/PageNavigator";
import {PageResponse} from "@/app/{commons}/types/commons";
import apiCall from "@/app/{commons}/func/api";

interface LoginHistoriesI {
    id: string;
    ip: string;
    device: string;
    location: string;
    createAt: string;
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

    return (
        <div>
            <div className={'flex justify-between h-10'}
            >
                <div />
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
                    <col style={{width: '5%'}}/>
                    <col style={{width: '10%'}}/>
                    <col style={{width: '50%'}}/>
                    <col style={{width: '20%'}}/>
                    <col style={{width: '15%'}}/>
                </colgroup>
               <thead className={'bg-main text-white h-9 align-middle'}>
                 <tr className={'text-sm border-x border-white border-solid'}>
                  <th className={'border-x border-white border-solid'}>#</th>
                  <th className={'border-x border-white border-solid'}>IP</th>
                  <th className={'border-x border-white border-solid'}>Device</th>
                  <th className={'border-x border-white border-solid'}>Location</th>
                  <th className={'border-x border-white border-solid'}>Create At</th>
                 </tr>
               </thead>
               <tbody className={'text-sm'}>
               {
                   data.content.map((history, index) => {
                       return (
                           <tr key={history.id} className={['border-b border-gray-200 border-solid', index % 2 === 1 ? 'bg-blue-50': ''].join(' ')}>
                               <td className={'py-2 px-3'}>{ maxIndex - index }</td>
                               <td className={'py-4 px-3'}>{ history.ip }</td>
                               <td className={'py-2 px-3'}>{ history.device }</td>
                               <td className={'py-2 px-3'}>{ history.location }</td>
                               <td className={'py-2 px-3'}>{ history.createAt }</td>
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
    return apiCall<PageResponse<LoginHistoriesI>, any>({
        path: '/api/user/histories',
        method: 'GET',
        params: req,
        call: 'Server',
        setAuthorization: true,
    })
    .then(res => {
        return res.data;
    });
}
