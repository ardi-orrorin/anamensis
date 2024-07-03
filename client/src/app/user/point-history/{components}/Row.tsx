import {PointHistoryI} from "@/app/user/point-history/page";
import {Table} from "@/app/user/point-history/{services}/types";

const Row = ({
    ...props
}: PointHistoryI & {rowNum: number, index: number}
) => {
    const tdStyle = 'p-2';
    return (
        <tr className={['border-b border-gray-200 border-solid text-sm', props.index % 2 === 1 ? 'bg-blue-50': '',  props.point >= 0 ? 'text-blue-500' : 'text-red-500'].join(' ')}>
            <td className={tdStyle}
            >{props.rowNum.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',')}</td>
            <td className={tdStyle}
            >{Table.fromString(props.tableName).useWith}</td>
            <td className={tdStyle}
            >{props.pointCodeName}</td>
            <td className={tdStyle}
            >{props.point}</td>
            <td className={tdStyle}
            >{props.createdAt}</td>
        </tr>
    );
}

export default Row;