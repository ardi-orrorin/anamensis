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
            <table>
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
                   data.content.map((history) => {
                       return (
                           <tr key={history.id} className={'border-b border-gray-200 border-solid'}>
                               <td className={'py-4 ps-2'}>{history.ip}</td>
                               <td className={'ps-2'}>{history.device}</td>
                               <td className={'ps-2'}>{history.location}</td>
                               <td className={'text-center'}>{history.createAt}</td>
                           </tr>
                       )
                   })
               }
               </tbody>
            </table>

        </div>
    )
}



