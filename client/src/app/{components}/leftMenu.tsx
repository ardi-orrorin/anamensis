import React, {Dispatch, SetStateAction, useCallback, useContext, useMemo, useState} from "react";
import {Category} from "@/app/board/{services}/types";
import Link from "next/link";
import {faPen} from "@fortawesome/free-solid-svg-icons/faPen";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {faBars, faKeyboard} from "@fortawesome/free-solid-svg-icons";
import SearchParamsProvider from "@/app/{services}/SearchParamsProvider";
import {useHotkeys} from "react-hotkeys-hook";
import {useRouter} from "next/navigation";
import {Options} from "react-hotkeys-hook/src/types";
import HotKeybtn from "@/app/{components}/hotKeybtn";
import {useRootLeftMenuHotKey} from "@/app/{hooks}/hotKey";
import {Root} from "@/app/{services}/types";
import {System} from "@/app/user/system/{services}/types";
import userApiService from "@/app/user/{services}/userApiService";
import userInfoApiService from "@/app/user/info/{services}/userInfoApiService";
import LoadingSpinner from "@/app/{commons}/LoadingSpinner";
import Image from "next/image";
import {useQuery} from "@tanstack/react-query";

const LeftMenu = ({
    roles,
    searchParams,
    setSearchParams,
}:{
    roles           : System.Role[];
    searchParams    : Root.BoardListParamsI;
    setSearchParams : Dispatch<SetStateAction<Root.BoardListParamsI>>;
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
        } as Root.BoardListParamsI;

        setSearchParams(params);
        scrollTo(0, 0);
    },[searchParams]);

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
        <div className={'sticky z-30 top-0 left-[5%] xl:left-[13%] min-h-screen px-2 border-r border-solid border-r-gray-200 bg-gray-100'}>
            <div className={'sticky z-30 top-2 py-3 px-2 flex flex-col gap-5 items-center xl:items-start'}>
                {
                    roles?.length > 0
                    && <ProfileInfo />
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
                    && <div className={'pb-4 flex flex-col w-full border-b border-solid border-b-gray-200'}>
                      <div className={'flex gap-2 items-center text-sm font-bold py-2'}>
                        <FontAwesomeIcon icon={faPen} height={'16'} />
                        <span>
                              글쓰기
                        </span>
                      </div>
                      <div className={'w-full flex flex-col items-center text-xs'}
                           data-testid={'write-menu'}
                      >
                          { categoryList }
                          <Link href={'/board/temp'}
                                className={'p-2 w-full items-center gap-1 hover:bg-gray-100 duration-300'}
                          >
                              <div className={'flex justify-between items-center'}>
                                 <span> 새 템플릿 </span>
                                 <HotKeybtn hotkey={['SHIFT','0']} />
                              </div>
                          </Link>
                      </div>
                  </div>
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

const ProfileInfo = () => {
    const router = useRouter()
    const {data: profileImg, isLoading} = useQuery(userApiService.profileImg());

    const {data: userinfo} = useQuery(userInfoApiService.profile())

    return (
        <div className={'pb-4 w-full flex flex-col gap-2 border-b border-solid border-b-gray-200'}>
            <div className={'flex justify-between items-end text-sm'}>
                <span className={'font-bold'}>
                    프로필
                </span>
                <Link className={'flex justify-end text-xs text-blue-500'}
                      href={'/user/info'}
                >
                    수정
                </Link>
            </div>
            <div className={'flex gap-4'}>
                <div className={'flex flex-col gap-2'}>
                    <button className={'w-[95px] h-[95px] p-1.5 flex justify-center items-center border-4 border-solid border-main rounded-full hover:border-amber-500 duration-500'}>
                        {
                            (isLoading || profileImg === '')
                                ? <LoadingSpinner size={20} />
                                : <Image src={process.env.NEXT_PUBLIC_CDN_SERVER + profileImg}
                                         alt={''}
                                         height={90}
                                         width={90}
                                         className={'shadow rounded-full'}
                                         onClick={()=> router.push('/user/info')}
                                />
                        }
                    </button>
                </div>
                <div>
                    <div className={'flex flex-col gap-2'}>
                        <div className={'flex'}>
                            <span className={'text-xs min-w-10 font-bold'}>ID</span>
                            <span className={'text-xs'}>{userinfo?.userId}</span>
                        </div>
                        <div className={'flex'}>
                            <span className={'text-xs min-w-10 font-bold'}>이름</span>
                            <span className={'text-xs'}>{userinfo?.name}</span>
                        </div>
                        <div className={'flex'}>
                            <span className={'text-xs min-w-10 font-bold'}>이메일</span>
                            <span className={'text-xs'}>{userinfo?.email}</span>
                        </div>
                        <div className={'flex'}>
                            <span className={'text-xs min-w-10 font-bold'}>포인트</span>
                            <span className={'text-xs'}>{userinfo?.point}</span>
                        </div>
                    </div>
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
              className={'p-2 w-full items-center gap-1 hover:bg-gray-200 duration-300'}
        >
            <div className={'flex justify-between items-center'}>
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
    && prev.searchParams.isSelf === next.searchParams.isSelf
    && prev.searchParams.isFavorite === next.searchParams.isFavorite
    && prev.searchParams.categoryPk === next.searchParams.categoryPk
});