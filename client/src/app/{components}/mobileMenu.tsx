import {Category} from "@/app/board/{services}/types";
import React, {Dispatch, SetStateAction, useCallback} from "react";
import Link from "next/link";
import {Root} from "@/app/{services}/types";
import {useCusSearchParams} from "@/app/{hooks}/searchParamsHook";

const MobileMenu = ({
    menuToggle,
    setMenuToggle,
    isLogin,
}:{
    isLogin         : boolean;
    menuToggle      : boolean;
    setMenuToggle   : Dispatch<SetStateAction<boolean>>;
}) => {
    const { searchParams, onChangeCategory, onChangeParamsHandler } = useCusSearchParams();

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
                                  onClick={() => onChangeParamsHandler({type: 'isSelf'})}
                          >
                            내가 쓴 글
                          </button>
                          <button className={[
                                    'py-2 w-full text-sm text-center border border-solid border-gray-100 hover:bg-gray-100 duration-300',
                                    ].join(' ')}
                                  onClick={() => onChangeParamsHandler({type: 'isFavorite'})}
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
                    {
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
                        })
                    }
                </div>
                {
                    isLogin
                    && <>
                        <div className={'py-4 flex justify-center items-center'}>
                          <h2 className={'font-bold'}>글쓰기</h2>
                        </div>
                        <div className={'w-full flex flex-col gap-1 justify-center text-gray-700'}>
                            {
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
                                })
                            }
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

export default React.memo(MobileMenu, (prev, next) => {
    return prev.menuToggle === next.menuToggle
        && prev.isLogin    === next.isLogin
});