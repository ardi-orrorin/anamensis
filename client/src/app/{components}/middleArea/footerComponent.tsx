import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {faComment, faEye} from "@fortawesome/free-solid-svg-icons";
import {RateColor} from "@/app/{commons}/types/rate";
import {faHeart} from "@fortawesome/free-solid-svg-icons/faHeart";
import moment from "moment";
import {useMemo} from "react";
import {Root} from "@/app/{services}/types";

const FooterComponent = (props: Root.BoardListI) => {
    const {
        rate , commentCount
        , createdAt, viewCount
        , isBlocked
    } = props;


    const createAt = useMemo(() =>
        moment().isSame(createdAt, 'day')
        ? moment(createdAt).format('HH:mm')
        : moment(createdAt).format('YYYY-MM-DD HH:mm')
    , [createdAt])

    const commentCountColor = useMemo(() =>
        RateColor.findColor(commentCount)?.getColor
    ,[commentCount])

    if(isBlocked) return <></>

    return (
        <div className={'px-3 pb-2 h-[30px] min-h[30px] max-h-[30px] flex justify-between items-center text-xs text-gray-500'}>
            <div className={'flex gap-3 items-center'}>
                <span className={'flex gap-1 items-center'}>
                    <FontAwesomeIcon icon={faEye} />
                    {viewCount}
                </span>
                <span className={`flex gap-1 items-center`}
                      style={{color: commentCountColor}}
                >
                    <FontAwesomeIcon icon={faComment} />
                    {commentCount}
                </span>
            </div>
            <span>
                {createAt}
            </span>
        </div>
    )
}
export default FooterComponent;