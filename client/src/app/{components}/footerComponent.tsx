import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {faComment, faEye} from "@fortawesome/free-solid-svg-icons";
import {RateColor} from "@/app/{commons}/types/rate";
import {faHeart} from "@fortawesome/free-solid-svg-icons/faHeart";
import {BoardListI} from "@/app/{components}/boardComponent";
import moment from "moment";

const FooterComponent = (props: BoardListI) => {
    const {
        rate , commentCount
        , createdAt, viewCount
    } = props;


    const createAt = moment().isSame(createdAt, 'day')
        ? moment(createdAt).format('HH:mm')
        : moment(createdAt).format('YYYY-MM-DD HH:mm');

    return (
        <div className={'px-3 h-[30px] min-h[30px] max-h-[30px] border-t border-solid border-gray-200 flex justify-between items-center text-xs text-gray-500'}>
            <span>
                {createAt}
            </span>
            <div className={'flex gap-3 items-center'}>
                <span className={'flex gap-1 items-center'}>
                    <FontAwesomeIcon icon={faEye} />
                    {viewCount}
                </span>
                <span className={`flex gap-1 items-center`}
                      style={{color: RateColor.findColor(rate)?.getColor}}
                >
                    <FontAwesomeIcon icon={faHeart} />
                    {rate}
                </span>
                <span className={`flex gap-1 items-center`}
                      style={{color: RateColor.findColor(commentCount)?.getColor}}
                >
                    <FontAwesomeIcon icon={faComment} />
                    {commentCount}
                </span>
            </div>
        </div>
    )
}
export default FooterComponent;