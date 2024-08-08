import {BoardBlockStatusEnum} from "@/app/user/board-block/{services}/boardBlockProvider";
import React, {useMemo} from "react";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {faArrowDown, faCaretRight} from "@fortawesome/free-solid-svg-icons";

const TextBox = ({
    name, text, date, onChange, title, status
}:{
    name     : string;
    text     : string;
    date     : string;
    title    : string;
    status  : BoardBlockStatusEnum;
    onChange : (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => void;
}) => {
    const viewMode = useMemo(()=> {
        return name === 'answer' && (status === BoardBlockStatusEnum.ANSWERED || status === BoardBlockStatusEnum.RESULTED)
            || name === 'result' && status === BoardBlockStatusEnum.RESULTED
    },[name]);

    return (
        <div className={'w-full min-h-40 flex flex-col gap-2 justify-center'}>
            <FontAwesomeIcon icon={faArrowDown} size={'lg'} className={'font-extrabold'} />
            {
                viewMode
                    ? <div className={'text-sm flex flex-col gap-1'}>
                    <span className={'text-sm flex gap-2 items-center'}>
                        <FontAwesomeIcon icon={faCaretRight} />
                        답변일자 : {date}
                    </span>
                        <span>
                        내용 : {text}
                    </span>
                    </div>
                    : <div className={'relative w-full flex flex-col gap-1'}>
                        <label className={'text-sm flex gap-2 items-center'}>
                            <FontAwesomeIcon icon={faCaretRight} />
                            {title}
                        </label>
                        <textarea className={'w-full border border-gray-300 border-solid rounded p-2 outline-0 text-sm resize-none'}
                                  name={name}
                                  value={text}
                                  maxLength={500}
                                  onChange={onChange}
                                  rows={5}
                                  autoFocus={true}
                        />
                        <span className={'absolute right-3 bottom-3'}>
                        {text.length} / 500
                    </span>
                    </div>
            }
        </div>
    )
}

export default React.memo(TextBox, (prev, next) => {
    return prev.text === next.text
        && prev.date === next.date
        && prev.status === next.status
        && prev.title === next.title;
});