import {SmtpHistoryI} from "@/app/user/smtp-history/page";

const Row = ({
    ...props
}: SmtpHistoryI & {rowNum: number, index: number}
) => {
    const tdStyle = 'p-2';
    return (
        <tr className={['border-b border-gray-200 border-solid text-sm', props.index % 2 === 1 ? 'bg-blue-50': ''].join(' ')}>
            <td className={tdStyle}
            >{props.rowNum.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',')}</td>
            <td className={tdStyle}
            >{props.subject}</td>
            <td className={tdStyle}
            >{props.message}</td>
            <td className={tdStyle}
            >{props.status}</td>
            <td className={tdStyle}
            >{props.createAt}</td>
        </tr>
    );
}

export default Row;