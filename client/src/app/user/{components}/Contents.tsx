import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {faBars} from "@fortawesome/free-solid-svg-icons";
import React, {Suspense} from "react";
import GlobalLoadingSpinner from "@/app/{commons}/GlobalLoadingSpinner";

const Contents = ({
    isOpen,
    setIsOpen,
    children
}: {
    isOpen: boolean,
    setIsOpen: React.Dispatch<React.SetStateAction<boolean>>,
    children: React.ReactNode
}) => {
    return (
        <section className={'w-full flex flex-col justify-center border-s border-solid border-gray-200 p-4'}>
            <div className={'w-full flex items-start h-12'}>
                <div className={['w-1/3 flex'].join(' ')}>
                    <button className={[isOpen ? 'hidden' : ''].join(' ')} onClick={()=>{setIsOpen(!isOpen)}}>
                        <FontAwesomeIcon icon={faBars} />
                    </button>
                </div>
                <div className={'w-1/3 flex justify-center text-lg'}>
                    <h1>로그인기록</h1>
                </div>
                <div className={'w-1/3 flex justify-end'}>
                    경로
                </div>
            </div>
            <div>
                <Suspense fallback={<GlobalLoadingSpinner />}>
                    {children}
                </Suspense>
            </div>
        </section>
    )
}

export default Contents;