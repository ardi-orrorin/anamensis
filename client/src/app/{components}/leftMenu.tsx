import React, {Dispatch, SetStateAction, useCallback, useContext, useMemo, useState} from "react";
import {Category} from "@/app/board/{services}/types";
import Link from "next/link";
import {faPen} from "@fortawesome/free-solid-svg-icons/faPen";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {faBars} from "@fortawesome/free-solid-svg-icons";
import {RoleType} from "@/app/user/system/{services}/types";
import SearchParamsProvider, {BoardListParamsI} from "@/app/{services}/SearchParamsProvider";
import {useHotkeys} from "react-hotkeys-hook";
import {useRouter} from "next/navigation";
import {Options} from "react-hotkeys-hook/src/types";
import HotKeybtn from "@/app/{components}/hotKeybtn";
import {useRootLeftMenuHotKey} from "@/app/{hooks}/hotKey";

const LeftMenu = ({
    roles,
    searchParams,
    setSearchParams,
}:{
    roles: RoleType[];
    searchParams: BoardListParamsI;
    setSearchParams: Dispatch<SetStateAction<BoardListParamsI>>;
}) => {
    const router = useRouter();

    const boardBaseUrl = '/board/new?categoryPk=';

    const onChangeParamsHandler = useCallback(({type, value}: {type: string, value: string | number | boolean}) => {

        const category = type === 'categoryPk'
            && {[type]: searchParams[type]?.toString() === value ? 0 : Number(value)}

        const isSelf = type === 'isSelf'
            && {[type]: !searchParams[type], isFavorite: false};

        const isFavorite = type === 'isFavorite'
            && {[type]: !searchParams[type], isSelf: false};

        const params = {
            ...searchParams,
            ...category,
            ...isSelf,
            ...isFavorite,
            page: 1, size: 20,
            add: false
        } as BoardListParamsI;

        setSearchParams(params);
        scrollTo(0, 0);
    },[searchParams]);

    const confirmRole = useCallback((item: { roles: RoleType[] }) => {
        return item.roles.find(r =>
            roles.find(roles => roles === r)
        );
    },[roles]);

    useRootLeftMenuHotKey({
        onChangeParamsHandler,
        router,
        roles,
        boardBaseUrl,
        confirmRole,
    })

    const categoryList = useMemo(()=>
        Category.list.map((item, index) => {
            const hasRoleCategory = confirmRole(item);

            if(item.id === '0' || !hasRoleCategory) {
                return null
            }

            return (
                <CategoryItem key={'category' + index} {...{item, index, boardBaseUrl}} />
            )
    }),[roles]);

    return (
        <div className={'sticky z-30 top-20 left-[5%] xl:left-[13%]'}>
            <div className={'flex flex-col gap-5 items-center xl:items-start'}>
                <div className={'flex flex-col w-60 gap-2 shadow rounded p-3 bg-white border-t-4 border border-solid border-gray-100 hover:border-gray-500 duration-500'}>
                    <div className={'flex gap-2 justify-center items-center text-sm py-2 font-bold'}>
                        <FontAwesomeIcon icon={faBars} height={'16'} />
                        <span>
                            메뉴
                        </span>
                    </div>
                    <div>
                        {
                            roles.length > 0
                            && <button className={'flex py-2 px-5 w-full justify-between items-center text-xs hover:bg-gray-100 duration-500'}
                                       onClick={() => onChangeParamsHandler({type: 'isSelf', value: true})}
                            >
                                <span>
                                    내 글 보기
                                </span>
                                <HotKeybtn hotkey={['0']} />
                            </button>
                        }
                        {
                            roles.length > 0
                            && <button className={'flex py-2 px-5 w-full justify-between items-center text-xs text-amber-600 hover:bg-amber-50 duration-500 outline-0'}
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
                    roles.length > 0
                    && <div className={'flex flex-col w-60 shadow rounded p-3 bg-white gap-3 border-t-4 border border-solid border-gray-100 hover:border-gray-500 duration-500'}>
                      <div className={'flex gap-2 justify-center items-center text-sm font-bold py-2'}>
                        <FontAwesomeIcon icon={faPen} height={'16'} />
                        <span>
                              글쓰기
                        </span>
                      </div>
                      <div className={'w-full flex flex-col items-center text-xs'}>
                          { categoryList }
                          <Link href={'/board/temp'}
                                className={'py-2 px-5 w-full items-center gap-1 hover:bg-gray-100 duration-300'}
                          >
                              <div className={'flex justify-between items-center b'}>
                                 <span> 새 템플릿 </span>
                                 <HotKeybtn hotkey={['SHIFT','0']} />
                              </div>
                          </Link>
                      </div>
                  </div>
                }
                <div className={'flex flex-col w-60 px-3 py-6 gap-2 justify-center items-center shadow rounded border-t-4 border-solid border border-gray-100 hover:border-gray-500 duration-500'}>
                    <h1 className={'text-sm font-bold'}>단축키</h1>
                    <ul className={'flex flex-col w-full px-5 gap-3 text-xs'}>
                        <li className={'flex justify-between items-center gap-2'}>
                            <span>검색</span>
                            <HotKeybtn hotkey={['SHIFT', 'F']} />
                        </li>
                        {
                            roles.length > 0
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

const CategoryItem = ({
    item, index, boardBaseUrl
}:{
    item: Category, index: number, boardBaseUrl: string
}) => {

    return (
        <Link key={'category-write-menu' + index}
              href={boardBaseUrl + item.id}
              className={'py-2 px-5 w-full items-center gap-1 hover:bg-gray-100 duration-300'}
        >
            <div className={'flex justify-between items-center b'}>
                  <span>
                    {item.name}
                  </span>
                <HotKeybtn hotkey={['SHIFT', item.id]} />
            </div>
        </Link>
    )
}

const CategorySelect = ({
    onClick,
}: {
    onClick: ({type, value}: {type: string, value: string}) => void;
}) => {
    
    const [selectToggle, setSelectToggle] = useState(false);
    const {searchParams} = useContext(SearchParamsProvider);

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
                    className={'py-2 px-6 flex justify-between items-center border-solid border border-white focus:outline-none'}
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
            'relative w-auto text-xs bg-gray-50 hover:border-gray-500 duration-500',
            selectToggle ? 'rounded-t-sm' : 'rounded-sm'
        ].join(' ')}>
            <button className={['flex gap-3 w-full justify-between py-2 px-3 border-solid border border-white focus:outline-none'].join(' ')}
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
            ].join(' ')
            }>
                { CategoryList }
            </div>
        </div>
    )
}


export default React.memo(LeftMenu, (prev, next) => {
    return prev.roles === next.roles
    && prev.searchParams.isSelf === next.searchParams.isSelf
    && prev.searchParams.isFavorite === next.searchParams.isFavorite
    && prev.searchParams.categoryPk === next.searchParams.categoryPk
});