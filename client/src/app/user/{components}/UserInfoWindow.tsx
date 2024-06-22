import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {faXmark} from "@fortawesome/free-solid-svg-icons/faXmark";
import React from "react";


export type UserInfoWindowProps = {
    winKey    : string,
    title     : string,
    children? : React.ReactNode,
    open      : boolean,
    onClick?  : (key: string, open:boolean) => void,
}

const UserInfoWindow = (props: UserInfoWindowProps) => {

    const {winKey, title, children, open, onClick} = props;

    return (
        <div className={['flex flex-col w-[400px] h-80 border border-solid border-blue-300 shadow-blue-100 shadow-md rounded duration-300',
                        open ? '' : 'hidden',
                        ].join(' ')}
        >
            <div className={['flex justify-between w-full h-10 p-3 text-sm text-white',
                            open ? 'bg-blue-300' : 'bg-gray-400  rounded'
                            ].join(' ')}
            >
                <button onClick={()=> onClick!(winKey, false)}>
                    {title}
                </button>
                <button onClick={()=>onClick!(winKey, false)}>
                    <FontAwesomeIcon icon={faXmark} />
                </button>
            </div>
            <div className={['duration-300', open ? 'h-80 max-h-80' : 'max-h-0 h-0'].join(' ')}>
                <div className={[open ? 'h-full w-full flex flex-col p-4' : 'hidden', 'duration-500'].join(' ')}>
                    {children}
                </div>
            </div>
        </div>
    );
}

export default UserInfoWindow;