import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {faXmark} from "@fortawesome/free-solid-svg-icons/faXmark";


export interface SmtpCardProps {
    id: number;
    host: string;
    port: number;
    username: string;
    fromEmail: string;
    fromName: string;
    useSSL: boolean;
    isUse: boolean;
}
const SmtpCard = () => {
    const smtpCardProps: SmtpCardProps = {
        id: 1,
        host: 'smtp.gmail.com',
        port: 587,
        username: 'test@gmadf',
        fromEmail: 'sdfsdfs@df',
        fromName: 'sdfsdf',
        useSSL: true,
        isUse: true,
    }

    return (
        <div>
            <button className={'w-full flex flex-col justify-start min-h-36 border-solid border border-blue-300 text-sm text-blue-700 rounded p-3 hover:bg-blue-400 hover:text-white duration-500'}>
                <div className={'w-full flex justify-between'}>
                    <span className={'text-start'}>
                        {smtpCardProps.host}
                    </span>
                    <div className={'flex gap-3'}>
                        <button className={'bg-blue-300 w-20 h-5 text-sm text-white rounded'} disabled={true}>
                            DEFAULT
                        </button>
                        <button className={'bg-blue-300 w-20 h-5 text-sm text-white rounded'} disabled={true}>
                            SSL
                        </button>
                    </div>
                    <button>
                        <FontAwesomeIcon icon={faXmark} className={'text-blue-700'} />
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
            </button>
        </div>
    );
}

export default SmtpCard;