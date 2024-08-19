import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {
    faAngleDown, faAnglesDown,
    faAnglesUp,
    faAngleUp,
    faPenToSquare,
    faRightFromBracket,
    faUser, faUserPlus, faWindowMaximize
} from "@fortawesome/free-solid-svg-icons";
import Link from "next/link";
import {faWindowMinimize} from "@fortawesome/free-solid-svg-icons/faWindowMinimize";
import React, {useState} from "react";
import {useRouter} from "next/navigation";
import {faRightToBracket} from "@fortawesome/free-solid-svg-icons/faRightToBracket";

const RightSubMenu = ({
    isLogin
}:{
    isLogin: boolean
}) => {
    const [rightMenu, setRightMenu] = useState(true);

    return (
        <div className={[
            'fixed z-30 bottom-1/4 right-5 flex flex-col bg-green-600 border-y-4 border-solid border-green-600 rounded-md shadow-md ',
            rightMenu && 'gap-2'
        ].join(' ')}>
            <div className={['duration-500 overflow-y-hidden', rightMenu ? 'max-h-72' : 'max-h-0'].join(' ')}
                 data-testid={'right-menu'}
            >
                <TopMenu />

                <MiddleMenu isLogin={isLogin} />

                <BottomMenu />
            </div>
            <button className={'p-3 flex justify-center items-center bg-white text-black hover:bg-green-600 hover:text-white active:bg-green-800 duration-300 outline-0'}
                    onClick={() => setRightMenu(!rightMenu)}
                    data-testid={'right-menu-toggle'}
            >
                <FontAwesomeIcon icon={rightMenu ? faWindowMinimize : faWindowMaximize} className={'w-5 h-3 outline-0'} />
            </button>
        </div>
    )
}

const TopMenu = () => {
    return (
        <div className={'w-full flex flex-col justify-center bg-white shadow'}>
            <button className={'p-3 flex justify-center items-center hover:bg-green-600 hover:text-white active:bg-green-800 duration-300 outline-0'}
                    onClick={() => window.scrollTo({top: 0, behavior: 'smooth'})}
                    title={'맨 위로'}
            >
                <FontAwesomeIcon icon={faAnglesUp} className={'w-5 h-3'} />
            </button>
            <button className={'p-3 flex justify-center items-center border-y border-solid border-gray-200 hover:bg-green-600 hover:text-white active:bg-green-800 duration-300 outline-0'}
                    onClick={() => window.scrollTo({top: window.scrollY - window.innerHeight, behavior: 'smooth'})}
                    title={'위로'}
            >
                <FontAwesomeIcon icon={faAngleUp} className={'w-5 h-3'} />
            </button>
        </div>
    )
}

const BottomMenu = () => {
    return (
        <div className={'w-full flex flex-col justify-center bg-white shadow'}>
            <button className={'p-3 flex justify-center items-center border-y border-solid border-gray-200 hover:bg-green-600 hover:text-white active:bg-green-800 duration-300 outline-0'}
                    onClick={() => window.scrollTo({top: window.scrollY + window.innerHeight, behavior: 'smooth'})}
                    title={'아래로'}
            >
                <FontAwesomeIcon icon={faAngleDown} className={'w-5 h-3'} />
            </button>
            <button className={'p-3 flex justify-center items-center hover:bg-green-600 hover:text-white active:bg-green-800 duration-300 outline-0'}
                    onClick={() => window.scrollTo({top: document.body.scrollHeight, behavior: 'smooth'})}
                    title={'맨 아래로'}
            >
                <FontAwesomeIcon icon={faAnglesDown} className={'w-5 h-3'} />
            </button>
        </div>
    )

}


const MiddleMenu = ({
    isLogin
}:{
    isLogin: boolean
}) => {
    const router = useRouter();

    return (
        <>
            {
                isLogin
                    ? <div className={'w-full flex flex-col justify-center bg-white shadow'}>
                        <Link className={'p-3 flex justify-center items-center border-t border-solid border-gray-200 hover:bg-green-600 hover:text-white active:bg-green-800 duration-300 outline-0'}
                              href={'/board/new?categoryPk=2'}
                              title={'글쓰기'}
                        >
                            <FontAwesomeIcon className={'w-4'} icon={faPenToSquare} />
                        </Link>
                        <Link className={'p-3 flex justify-center items-center border-y border-solid border-gray-200 hover:bg-green-600 hover:text-white active:bg-green-800 duration-300 outline-0'}
                              href={'/user'}
                              title={'프로필'}
                        >
                            <FontAwesomeIcon className={'w-4'} icon={faUser} />
                        </Link>
                        <button className={'p-3 flex justify-center items-center border-y border-solid border-gray-200 hover:bg-green-600 hover:text-white active:bg-green-800 duration-300 outline-0'}
                                onClick={() => {
                                    if(!confirm('로그아웃 하시겠습니까?')) return;
                                    router.push('/api/logout')
                                }}
                                title={'로그아웃'}
                        >
                            <FontAwesomeIcon className={'w-4'} icon={faRightFromBracket} />
                        </button>
                    </div>
                    : <div className={'w-full flex flex-col justify-center bg-white shadow'}>
                        <Link className={'p-3 flex justify-center items-center border-t border-solid border-gray-200 hover:bg-green-600 hover:text-white active:bg-green-800 duration-300 outline-0'}
                              href={'/signup'}
                              title={'회원가입'}
                        >
                            <FontAwesomeIcon className={'w-4'} icon={faUserPlus} />
                        </Link>
                        <Link className={'p-3 flex justify-center items-center border-t border-solid border-gray-200 hover:bg-green-600 hover:text-white active:bg-green-800 duration-300 outline-0'}
                              href={'/login'}
                              title={'로그인'}
                        >
                            <FontAwesomeIcon className={'w-4'} icon={faRightToBracket} />
                        </Link>
                    </div>
            }
        </>
    )
}



export default React.memo(RightSubMenu, (prev, next) => {
    return prev.isLogin === next.isLogin;
});