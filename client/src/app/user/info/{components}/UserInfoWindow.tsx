import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {faXmark} from "@fortawesome/free-solid-svg-icons/faXmark";
import React, {Dispatch, SetStateAction, useEffect} from "react";
import {OpenType} from "@/app/user/page";


type UserInfoWindowProps = {
    title: string,
    children: React.ReactNode,
    open: OpenType,
    setOpen: Dispatch<SetStateAction<OpenType>>,
    openKey: string
}

const UserInfoWindow = ({
    title, children, open, setOpen, openKey
}: UserInfoWindowProps) => {
    const sethandler = () => {
        setOpen({
            ...open,
            [openKey]: !open[openKey]
        });
    }

    return (
        <div className={['flex flex-col duration-300',
                            open[openKey] ? 'w-[500px] h-80 border border-solid border-blue-300 shadow-blue-100 shadow-md rounded' : 'w-[100px] h-10 border-gray-400  rounded'
                        ].join(' ')}
        >
            <div className={['flex justify-between w-full h-10 p-3 text-white', open[openKey] ? 'bg-blue-300' : 'bg-gray-400  rounded'].join(' ')}>
                <button onClick={sethandler}>
                    {title}
                </button>
                <button onClick={sethandler}>
                    <FontAwesomeIcon icon={faXmark} />
                </button>
            </div>
            <div className={['duration-300', open[openKey] ? 'h-80 max-h-80' : 'max-h-0 h-0'].join(' ')}>
                <div className={[open[openKey] ? 'h-full w-full flex flex-col p-4 items-center justify-center ' : 'hidden', 'duration-500'].join(' ')}>
                    {children}
                </div>
            </div>
        </div>
    );
}

export default UserInfoWindow;