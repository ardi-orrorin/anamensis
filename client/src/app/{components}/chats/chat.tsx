import {faCommentDots} from "@fortawesome/free-solid-svg-icons";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";

const Chat = () => {

    return (
        <div>
            <button
                className={'fixed z-[400] left-2 bottom-2 w-14 h-14 flex justify-center items-center drop-shadow-md shadow-black bg-white rounded-full'}>
                <FontAwesomeIcon icon={faCommentDots} size={'xl'} />
            </button>
        </div>
    )
}

export default Chat;