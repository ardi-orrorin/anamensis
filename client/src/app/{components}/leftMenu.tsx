import React, {useCallback, useMemo, useState} from "react";
import {Category} from "@/app/board/{services}/types";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {faBars, faKeyboard} from "@fortawesome/free-solid-svg-icons";
import {useHotkeys} from "react-hotkeys-hook";
import {useRouter} from "next/navigation";
import {Options} from "react-hotkeys-hook/src/types";
import HotKeybtn from "@/app/{components}/hotKeybtn";
import {useRootLeftMenuHotKey} from "@/app/{hooks}/hotKey";
import {System} from "@/app/system/message/{services}/types";
import dynamic from "next/dynamic";
import LoadingSpinner from "@/app/{commons}/LoadingSpinner";
import {useCusSearchParams} from "@/app/{hooks}/searchParamsHook";

const DynamicProfileInfo = dynamic(() => import('@/app/{components}/profileInfo'), {
    loading: () => <div className={'h-[140px] flex items-center'}><LoadingSpinner size={30}/></div>,
    ssr: false});
const DynamicWriteMenu = dynamic(() => import('@/app/{components}/writeMenu'), {
    loading: () => <div className={'h-[300px] flex items-center'}><LoadingSpinner size={30}/></div>,
    ssr: false});

const LeftMenu = ({
    roles,
}:{
    roles : System.Role[];
}) => {

    const {onChangeParamsHandler} = useCusSearchParams();
    const router = useRouter();

    const boardBaseUrl = '/board/new?categoryPk=';

    const confirmRole = useCallback((item: { roles: System.Role[] }) => {
        return item.roles?.find(r =>
            roles?.find(roles => roles === r)
        );
    },[roles]);

    useRootLeftMenuHotKey({
        onChangeParamsHandler,
        router,
        roles,
        boardBaseUrl,
        confirmRole,
    })

    return (
        <div className={'sticky z-30 top-0 left-[5%] xl:left-[13%] min-h-screen px-2 border-r border-solid border-r-gray-200 bg-gray-100'}>
            <div className={'sticky z-30 top-2 py-3 px-2 flex flex-col gap-5 items-center xl:items-start'}>
                {
                    roles?.length > 0
                    && <DynamicProfileInfo />
                }
                <div className={'pb-4 flex flex-col w-full gap-2 duration-500 border-b border-solid border-b-gray-200'}
                     data-testid={'left-menu'}
                >
                    <div className={'flex gap-2 items-center text-sm font-bold'}>
                        <FontAwesomeIcon icon={faBars} height={'16'} />
                        <span> 카테고리 </span>
                    </div>
                    <div className={'w-full'}>
                        {
                            roles?.length > 0
                            && <button className={'flex p-2 w-full justify-between items-center text-xs hover:bg-gray-200 duration-500'}
                                       onClick={() => onChangeParamsHandler({type: 'isSelf', value: true})}
                            >
                                <span>
                                    내 글 보기
                                </span>
                                <HotKeybtn hotkey={['0']} />
                            </button>
                        }
                        {
                            roles?.length > 0
                            && <button className={'flex p-2 w-full justify-between items-center text-xs text-amber-600 hover:bg-amber-50 duration-500 outline-0'}
                                       onClick={() => onChangeParamsHandler({type: 'isFavorite', value: true})}
                            >
                                <span>
                                     즐겨 찾기
                                </span>
                                <HotKeybtn hotkey={['9']} />
                            </button>
                        }
                    </div>
                    <div className={'w-auto text-sm'}>
                        <CategorySelect onClick={onChangeParamsHandler}/>
                    </div>
                </div>
                {
                    roles?.length > 0
                    && <DynamicWriteMenu {...{boardBaseUrl, confirmRole}} />
                }
                <div className={'pb-4 w-full flex flex-col gap-2 border-b border-solid border-b-gray-200'}>
                    <div className={'flex gap-2 items-center text-sm font-bold'}>
                        <FontAwesomeIcon icon={faKeyboard} height={'16'} />
                        <span>
                            단축키
                        </span>
                    </div>
                    <ul className={'flex px-2 flex-col w-full gap-3 text-xs'}>
                        <li className={'flex justify-between items-center gap-2'}>
                            <span>검색</span>
                            <HotKeybtn hotkey={['SHIFT', 'F']} />
                        </li>
                        {
                            roles?.length > 0
                            ? <>
                                <li className={'flex justify-between items-center gap-2'}>
                                    <span>로그아웃</span>
                                    <HotKeybtn hotkey={['SHIFT', 'O']} />
                                </li>
                                <li className={'flex justify-between items-center gap-2'}>
                                    <span>사용자 정보</span>
                                    <HotKeybtn hotkey={['SHIFT', 'I']} />
                                </li>
                            </>
                            : <li className={'flex justify-between items-center gap-2'}>
                                <span>로그인</span>
                                <HotKeybtn hotkey={['SHIFT', 'L']} />
                            </li>
                        }
                    </ul>
                </div>
            </div>
        </div>
    )
}

const CategorySelect = ({
    onClick,
}: {
    onClick: ({type, value}: {type: string, value: string}) => void;
}) => {
    
    const [selectToggle, setSelectToggle] = useState(false);
    const {searchParams} = useCusSearchParams();

    const onToggleHandler = () => {
        setSelectToggle(!selectToggle);
    }

    const selectHandler = (pk: string) => {
        if(searchParams.categoryPk === pk) return;

        onClick({type: 'categoryPk', value: pk});
        setSelectToggle(false);
    }

    const hotkeysOption: Options = {
        preventDefault: true,
    }

    useHotkeys(['`, 1', '2', '3', '4', '5'], (e, handler)=> {
        if(handler.keys?.join('') === 'backquote') {
            const selCategoryPk = Category.findById('0')!.id;
            selectHandler(selCategoryPk);
            return
        }
        const selCategoryPk = Category.findById(handler.keys?.join('')!)!.id;
        selectHandler(selCategoryPk);

    }, hotkeysOption,[searchParams]);

    const CategoryList = useMemo(() => Category.list.map((item, index) => {
        return (
            <button key={'category-menu-selectbox' + index}
                    className={'py-2 px-6 flex justify-between bg-gray-100 items-center border-solid border border-gray-200 hover:bg-gray-200 focus:outline-none'}
                    onClick={() => selectHandler(item.id)}
            >
                <span>{item.name}</span>
                <HotKeybtn hotkey={[item.id === '0' ? '`' : item.id]} />
            </button>
        )
    }),[selectToggle]);

    const CategoryName = useMemo(()=>
        Category.findById(searchParams.categoryPk || '0')?.name ?? '카테고리'
    ,[searchParams]);

    return (
        <div className={[
            'relative w-auto text-xs bg-gray-100 hover:border-gray-500 duration-500',
            selectToggle ? 'rounded-t-sm' : 'rounded-sm'
        ].join(' ')}
             data-testid={'category-select'}
        >
            <button className={['flex gap-3 w-full justify-between p-2 bg-gray-200 focus:outline-none'].join(' ')}
                    onClick={onToggleHandler}
            >
                <div />
                <span>{ CategoryName }</span>
                <div>
                    <div className={['duration-300', selectToggle ? '-rotate-180' : '-rotate-90'].join(' ')}>
                        ▲
                    </div>
                </div>
            </button>
            <div className={[
                'absolute z-10 flex flex-col w-full bg-gray-50 overflow-y-hidden duration-500',
                selectToggle ? 'max-h-80 rounded-b-sm shadow-md' : 'max-h-0',
            ].join(' ')}
            >
                { CategoryList }
            </div>
        </div>
    )
}


export default React.memo(LeftMenu, (prev, next) => {
    return prev.roles === next.roles
});