import {Category} from "@/app/board/{services}/types";
import React, {Dispatch, SetStateAction, useCallback, useContext, useMemo} from "react";
import SearchParamsProvider, {BoardListParamsI} from "@/app/{services}/SearchParamsProvider";
import Link from "next/link";

const MobileMenu = ({
    menuToggle,
    setMenuToggle,
    isLogin
}:{
    isLogin: boolean;
    menuToggle: boolean;
    setMenuToggle: Dispatch<SetStateAction<boolean>>;
}) => {
    const {
        searchParams, setSearchParams,
    } = useContext(SearchParamsProvider);

    const onChangeCategory = useCallback((value: string) => {
        setSearchParams({ categoryPk: value, page: 1, size: 20 } as BoardListParamsI);
        scrollTo(0, 0);
    },[searchParams]);

    const onClickMyMenu = useCallback((type: string) => {
        const isSelf = type === 'isSelf'
            && {[type]: !searchParams[type], isFavorite: false};

        const isFavorite = type === 'isFavorite'
            && {[type]: !searchParams[type], isSelf: false};

        const params = {
            ...searchParams,
            ...isSelf,
            ...isFavorite,
            page: 1, size: 20,
            add: false
        } as BoardListParamsI;

        setSearchParams(params);
        scrollTo(0, 0);
    },[searchParams]);

    const CategoryComponent = useMemo(()=>
        Category.list.map((item, index) => {
            return (
                <button key={'category-write' + index}
                        className={[
                            'py-2 w-full text-sm text-center border border-solid border-gray-100 hover:bg-gray-100 duration-300',
                            searchParams.categoryPk === item.id ? 'bg-gray-100' : ''
                        ].join(' ')}
                        onClick={() => onChangeCategory(item.id)}
                        disabled={searchParams.categoryPk === item.id}
                >
                    {item.name}
                </button>
            )
        }),[searchParams.categoryPk])

    const WriteComponent = useMemo(()=>
        Category.list.map((item, index) => {
            if(Number(item.id) === 0) return ;
            return (
                <Link key={'category-write' + index}
                        href={`/board/new?categoryPk=${item.id}`}
                        className={[
                            'py-2 w-full text-sm text-center border border-solid border-gray-100 hover:bg-gray-100 duration-300',
                            searchParams.categoryPk === item.id ? 'bg-gray-100' : ''
                        ].join(' ')}
                >
                    {item.name}
                </Link>
            )
        }),[searchParams.categoryPk])

    return (
        <div className={'fixed top-0 left-0 z-20 bg-white bg-opacity-0 w-full'}
             onClick={() => {
                 setMenuToggle(false);
             }}
        >
            <div className={[
                'fixed z-30 bottom-24 right-5 min-w-40 bg-white rounded shadow-md duration-500',
                menuToggle ? 'max-h-[400px] p-2 border-y-4 border-solid border-main overflow-y-auto' : 'max-h-0 overflow-y-hidden',
            ].join(' ')}>
                {
                   isLogin
                   && <>
                        <div className={'py-4 flex justify-center items-center'}>
                          <h2 className={'font-bold'}>마이 메뉴</h2>
                        </div>
                        <div className={'w-full flex flex-col gap-1 justify-center text-gray-700'}>
                          <button className={[
                                    'py-2 w-full text-sm text-center border border-solid border-gray-100 hover:bg-gray-100 duration-300',
                                    ].join(' ')}
                                  onClick={() => onClickMyMenu('isSelf')}
                          >
                            내가 쓴 글
                          </button>
                          <button className={[
                                    'py-2 w-full text-sm text-center border border-solid border-gray-100 hover:bg-gray-100 duration-300',
                                    ].join(' ')}
                                  onClick={() => onClickMyMenu('isFavorite')}
                          >
                            즐겨찾기
                          </button>
                        </div>
                    </>
                }

                <div className={'py-4 flex justify-center items-center'}>
                    <h2 className={'font-bold'}>카테고리</h2>
                </div>
                <div className={'w-full flex flex-col gap-1 justify-center text-gray-700'}>
                    { CategoryComponent }
                </div>
                {
                    isLogin
                    && <>
                        <div className={'py-4 flex justify-center items-center'}>
                          <h2 className={'font-bold'}>글쓰기</h2>
                        </div>
                        <div className={'w-full flex flex-col gap-1 justify-center text-gray-700'}>
                            { WriteComponent }
                          <Link href={`/board/temp`}
                                className={[
                                    'py-2 w-full text-sm text-center border border-solid border-gray-100 hover:bg-gray-100 duration-300',
                                ].join(' ')}
                          >
                            새 탬플릿 추가
                          </Link>
                        </div>
                     </>
                }
            </div>
        </div>

    )
}

export default React.memo(MobileMenu);