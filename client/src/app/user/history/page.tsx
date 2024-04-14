import axios, {AxiosResponse} from "axios";
import {cookies} from "next/headers";
import {InferGetServerSidePropsType} from "next";
import {getServerSideProps} from "next/dist/build/templates/pages";

interface PageLoginHistories {
    page: Page;
    content: LoginHistories[];
}

export interface Page {
    page?: number;
    size?: number;
    total?: number;
    criteria?: string;
    order?: string;
    endPage?: boolean;
    getOffset?: number;
}

interface LoginHistories {
    id: string;
    ip: string;
    device: string;
    location: string;
    createAt: string;
}

export default async function Page(page: InferGetServerSidePropsType<typeof getServerSideProps>) {
    const {params, searchParams} = page;

    const url = process.env.NEXT_PUBLIC_SERVER + `/user/histories`;

    const data: PageLoginHistories = await axios.get(url,{
        params: {...searchParams},
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${cookies().get('accessToken')?.value}`
    }})
    .then((res: AxiosResponse) => {
        return res.data;
    });

    return (
        <div>
            <div className={'flex justify-between h-10'}>
                <div>

                </div>
                <div>
                    <select className={'w-32 border border-solid border-gray-300 rounded-md text-sm px-3 py-1'}
                            defaultValue={searchParams.size} >
                        <option value={10}>10</option>
                        <option value={20}>20</option>
                        <option value={30}>30</option>
                        <option value={50}>50</option>
                        <option value={100}>100</option>
                        <option value={200}>200</option>
                    </select>
                </div>
            </div>
            <table className={'w-full'}>
                <colgroup>
                    <col style={{width: '10%'}}/>
                    <col style={{width: '55%'}}/>
                    <col style={{width: '20%'}}/>
                    <col style={{width: '15%'}}/>
                </colgroup>
               <thead className={'bg-blue-300 text-white h-8 align-middle'}>
                 <tr className={'text-sm border-x border-white border-solid'}>
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
                               <td className={'py-4 ps-3'}>{history.ip}</td>
                               <td className={'ps-3'}>{history.device}</td>
                               <td className={'ps-3'}>{history.location}</td>
                               <td className={'ps-3'}>{history.createAt}</td>
                           </tr>
                       )
                   })
               }
               </tbody>
            </table>

        </div>
    )
}



