'use client';

import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {faXmark} from "@fortawesome/free-solid-svg-icons/faXmark";
import axios from "axios";
import Link from "next/link";
import apiCall from "@/app/{commons}/func/api";
import {useRouter} from "next/navigation";

export interface SmtpCardProps {
    id: number;
    host: string;
    port: number;
    username: string;
    fromEmail: string;
    fromName: string;
    useSSL: boolean;
    isDefault: boolean;
    isUse: boolean;
}
const SmtpCard = (smtpCardProps: SmtpCardProps) => {

    const router = useRouter();

    const disabledHandler = async () => {
        if(!confirm('정말로 삭제하시겠습니까?')) return;
        await apiCall({
            path: '/api/user/smtp/disabled/' + smtpCardProps.id,
            method: 'GET'
        })
        .then(res => {
            router.push('/user/smtp');
            // window.location.replace('/user/smtp');
        });
    }

    return (
        <Link href={'?id=' + smtpCardProps.id}>
            <div className={'w-full flex flex-col justify-start min-h-36 border-solid border border-blue-300 text-sm text-blue-700 rounded p-3 hover:bg-blue-400 hover:text-white duration-500'}>
                <div className={'w-full flex justify-between'}>
                    <span className={'text-start w-1/2'}>
                        {smtpCardProps.host}
                    </span>
                    <div className={'flex w-full gap-3'}>
                        {
                            smtpCardProps.isDefault &&
                            <button className={'bg-blue-300 w-20 h-5 text-sm text-white rounded'} disabled={true}>
                              DEFAULT
                            </button>
                        }
                        {
                            smtpCardProps.useSSL &&
                            <button className={'bg-blue-300 w-20 h-5 text-sm text-white rounded'} disabled={true}>
                              SSL
                            </button>
                        }
                    </div>
                    <button onClick={disabledHandler}>
                        <FontAwesomeIcon icon={faXmark} width={12} className={'text-blue-700'} />
                    </button>
                </div>
                <table className={'w-full text-sm mt-4'}>
                    <colgroup>
                        <col className={'w-2/6'} />
                        <col className={'w-4/6'} />
                    </colgroup>
                    <tbody>
                        <tr>
                            <td className={'text-start'}>PORT</td>
                            <td className={'text-start'}>{smtpCardProps.port}</td>
                        </tr>
                        <tr>
                            <td className={'text-start'}>ACCOUNT</td>
                            <td className={'text-start'}>{smtpCardProps.username}</td>
                        </tr>
                        <tr>
                            <td className={'text-start'}>FROM EMAIL</td>
                            <td className={'text-start'}>{smtpCardProps.fromEmail}</td>
                        </tr>
                        <tr>
                            <td className={'text-start'}>FROM NAME</td>
                            <td className={'text-start'}>{smtpCardProps.fromName}</td>
                        </tr>
                    </tbody>
                </table>
            </div>
        </Link>
    );
}

export default SmtpCard;