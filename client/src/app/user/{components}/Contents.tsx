import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {faBars} from "@fortawesome/free-solid-svg-icons";
import React, {Suspense, useCallback} from "react";
import GlobalLoadingSpinner from "@/app/{commons}/GlobalLoadingSpinner";
import {bodyScrollToggle} from "@/app/user/{services}/modalSetting";

const Contents = ({
    isOpen,
    isModalMode,
    setIsOpen,
    children,
}: {
    isOpen: boolean,
    isModalMode: boolean,
    setIsOpen: React.Dispatch<React.SetStateAction<boolean>>,
    children: React.ReactNode
}) => {

    const openToggle = useCallback(() => {
        bodyScrollToggle(true);
        setIsOpen(!isOpen);
    },[isOpen]);


    return (
        <section className={'w-full h-screen flex flex-col border-s border-solid border-gray-200 p-4'}>
            <div className={'w-full flex items-start h-12'}>
                {
                    isModalMode
                    && <div className={['w-1/3 flex'].join(' ')}>
                    <button className={[isOpen ? 'hidden' : ''].join(' ')} onClick={openToggle}>
                      <FontAwesomeIcon icon={faBars} />
                    </button>
                  </div>
                }

                {/*<div className={'w-1/3 flex justify-center text-lg'}>*/}
                    {/*<h1>로그인</h1>*/}
                {/*</div>*/}
                {/*<div className={'w-1/3 flex justify-end'}>*/}
                    {/*경로*/}
                {/*</div>*/}
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