import PageNavigator from "@/app/{commons}/PageNavigator";
import Row from "@/app/system/smtp/{components}/Row";
import {GetServerSideProps, InferGetServerSidePropsType} from "next";
import {GetProps} from "@/app/user/history/page";
import apiCall from "@/app/{commons}/func/api";
import SizeSelect from "@/app/{commons}/sizeSelect";
import {Common} from "@/app/{commons}/types/commons";
import {SystemSMTP} from "@/app/system/smtp/{services}/types";
import SmtpInfo from "@/app/system/smtp/{components}/smtpInfo";
import smtpApiServices from "@/app/system/smtp/{services}/apiServices";

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

    const {page, content} = await smtpApiServices.getSmtpHistory({req: searchParams});

    return (
        <div className={'min-h-full flex flex-col gap-3'}>
            <div className={'flex justify-end'}>
                <SizeSelect/>
            </div>
            <table className={'w-full'}>
                <colgroup>
                    <col style={{width: '5%'}}/>
                    <col style={{width: '5%'}}/>
                    <col style={{width: '5%'}}/>
                    <col style={{width: '20%'}}/>
                    <col style={{width: '40%'}}/>
                    <col style={{width: '10%'}}/>
                    <col style={{width: '15%'}}/>
                </colgroup>
                <thead className={'bg-main text-white h-9 align-middle'}>
                <tr className={'text-sm border-x border-white border-solid'}>
                    <th className={'border-x border-white border-solid'}>#</th>
                    <th className={'border-x border-white border-solid'}>From</th>
                    <th className={'border-x border-white border-solid'}>To</th>
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
                        colSpan={7}
                    >조회할 내용이 없습니다.
                    </td>
                  </tr>
                }
                </tbody>
            </table>
            <PageNavigator {...page} />
        </div>
    );
}