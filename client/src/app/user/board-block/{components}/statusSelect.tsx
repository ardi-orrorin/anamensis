import {useSearchParams} from "next/navigation";
import React from "react";
import {BoardBlockStatus} from "@/app/user/board-block/{services}/objects";

const StatusSelect = ({
    onFilterHandler
}:{
    onFilterHandler: (e: React.ChangeEvent<HTMLSelectElement>) => void
}) => {
    const searchParams = useSearchParams();

    return (
        <select className={'w-28 border border-solid border-gray-300 rounded-md text-sm px-3 py-1 outline-0'}
                name={'status'}
                defaultValue={searchParams.get('filterKeyword') || ''}
                onChange={onFilterHandler}
        >
            <option value={''}>전체</option>
            {
                BoardBlockStatus.list.map((status, index) => {
                    return <option key={'index' + status.getStatus()}
                                   value={status.getStatus()}
                    >{status.getKorName()}
                    </option>
                })
            }
        </select>
    );
}


export default React.memo(StatusSelect);