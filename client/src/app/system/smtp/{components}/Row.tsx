import {SystemSMTP} from "@/app/system/smtp/{services}/types";

const Row = ({
    rowNum,  index,
    to, from,
    subject, message,
    status,  createdAt,
}: SystemSMTP.HistoriesRow) => {
    const tdStyle = 'p-2';
    return (
        <tr className={['border-b border-gray-200 border-solid text-sm', index % 2 === 1 ? 'bg-blue-50' : ''].join(' ')}>
            <td className={tdStyle}
            >{rowNum.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',')}</td>
            <td className={tdStyle}
            >{from}</td>
            <td className={tdStyle}
            >{to}</td>
            <td className={tdStyle}
            >{subject}</td>
            <td className={tdStyle}
            >{message}</td>
            <td className={tdStyle}
            >{status}</td>
            <td className={tdStyle}
            >{createdAt}</td>
        </tr>
    );
}

export default Row;