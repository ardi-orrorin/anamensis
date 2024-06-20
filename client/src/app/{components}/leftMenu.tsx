import React, {useContext, useEffect, useState} from "react";
import {Category} from "@/app/board/{services}/types";
import Link from "next/link";
import {faPen} from "@fortawesome/free-solid-svg-icons/faPen";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {faBars} from "@fortawesome/free-solid-svg-icons";
import {RoleType} from "@/app/user/system/{services}/types";
import SearchParamsProvider, {BoardListParamsI} from "@/app/{services}/SearchParamsProvider";

const LeftMenu = ({
    roles,
}:{
    roles: RoleType[],
}) => {
    const {setSearchParams} = useContext(SearchParamsProvider);
    const onChangeParamsHandler = ({type, value}: {type: string, value: string | number | boolean}) => {
        const search =
            type === 'categoryPk'
                ? {[type]: Number(value)}
                : type === 'isSelf'
                    ? {[type]: value === value}
                    : {type: value};

        const params = {
            ...search,
            page: 1, size: 20,
            add: false
        } as BoardListParamsI;

        setSearchParams(params);
        scrollTo(0, 0);
    }

    return (
        <div className={'fixed left-[5%] xl:left-[13%]'}>
            <div className={'flex flex-col gap-20'}>
                <div className={'flex flex-col w-60 gap-3 shadow rounded p-3 bg-white border border-solid border-gray-100'}>
                    <div className={'flex gap-2 justify-center items-center text-sm py-2 font-bold'}>
                        <FontAwesomeIcon icon={faBars} height={'16'}/>
                        <span>
                            메뉴
                        </span>
                    </div>
                    <div>
                        {
                            roles.length > 0
                            && <button className={'flex w-full justify-center text-xs'}
                                       onClick={() => onChangeParamsHandler({type: 'isSelf', value: true})}
                          >내 글 보기
                          </button>
                        }
                    </div>
                    <div className={'w-auto text-sm'}>
                        <CategorySelect onClick={onChangeParamsHandler} />
                    </div>

                </div>
                {
                    roles.length > 0
                    && <div className={'flex flex-col w-60 shadow rounded p-3 bg-white gap-3 border border-solid border-gray-100'}>
                      <div className={'flex gap-2 justify-center items-center text-sm font-bold py-2'}>
                        <FontAwesomeIcon icon={faPen} height={'16'} />
                        <span>
                              글쓰기
                          </span>
                      </div>
                      <div className={'w-full flex flex-col items-center text-xs'}>
                          {
                              Category.list.map((item, index) => {
                                  const hasRoleCategory = item.roles.find(r =>
                                      roles.find(userRole =>
                                          userRole === r
                                      )
                                  )

                                  if(item.id === '0' || !hasRoleCategory) {
                                      return null
                                  }

                                  return (
                                      <Link key={'category-write-menu' + index}
                                            href={`/board/new?categoryPk=${item.id}`}
                                            className={'py-2 w-full text-center hover:bg-gray-100 duration-300'}
                                      >
                                          {item.name}
                                      </Link>
                                  )
                              })
                          }
                      </div>
                  </div>
                }

            </div>
        </div>
    )
}

const CategorySelect = ({
    onClick
}: {
    onClick: ({type, value}: {type: string, value: string}) => void
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

    return (
        <div className={[
            'relative w-auto text-xs bg-gray-50',
            selectToggle ? 'rounded-t-sm' : 'rounded-sm'
        ].join(' ')}>
            <button className={['flex gap-3 w-full justify-between py-2 px-3 border-solid border border-white focus:outline-none'].join(' ')}
                    onClick={onToggleHandler}
            >
                <div />
                <span>{Category.findById(searchParams.categoryPk || '0')?.name ?? '카테고리'}</span>
                <div>
                    <div className={['duration-300', selectToggle ? '-rotate-180' : '-rotate-90'].join(' ')}>
                        ▲
                    </div>
                </div>
            </button>
            <div className={[
                'absolute z-10 flex flex-col w-full bg-gray-50 overflow-y-hidden duration-500',
                selectToggle ? 'max-h-80 rounded-b-sm shadow-md' : 'max-h-0'].join(' ')
            }>
                {
                    Category.list.map((item, index) => {
                        return (
                            <button key={'category-menu-selectbox' + index}
                                    className={'p-2 border-solid border border-white focus:outline-none'}
                                    onClick={()=>selectHandler(item.id)}
                            >
                                <span>{item.name}</span>
                            </button>
                        )
                    })
                }
            </div>
        </div>
    )
}


export default LeftMenu;