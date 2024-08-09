import {GetServerSideProps, InferGetServerSidePropsType} from "next";
import PageNavigator from "@/app/{commons}/PageNavigator";
import apiCall from "@/app/{commons}/func/api";
import SizeSelect from "@/app/{commons}/sizeSelect";
import {Common} from "@/app/{commons}/types/commons";

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
        <div className={'flex flex-col gap-2'}>
            <div className={'flex justify-end h-8'}
            >
                <SizeSelect />
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
    return apiCall<Common.PageResponse<LoginHistoriesI>, any>({
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
