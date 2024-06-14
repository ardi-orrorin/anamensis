import React, {useEffect, useState} from "react";
import {BoardListParams} from "@/app/page";
import {Category} from "@/app/board/{services}/types";
import Link from "next/link";
import {faPen} from "@fortawesome/free-solid-svg-icons/faPen";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {faBars} from "@fortawesome/free-solid-svg-icons";
import {RoleType} from "@/app/user/system/{services}/types";

const LeftMenu = ({
    select,
    searchParams,
}:{
    searchParams: BoardListParams,
    select: (categoryPk: string) => void
}) => {
    const [categoryPk, setCategoryPk] = useState('');
    const [roles, setRoles] = useState<RoleType[]>([]);

    useEffect(() => {
        if(typeof window === 'undefined') return;
        const roles = JSON.parse(localStorage.getItem('roles') ?? '[]') as RoleType[];
        setRoles(roles);
    }, [roles]);
    useEffect(() => {
        if(searchParams.type !== 'categoryPk') {
            setCategoryPk('');
            return;
        }
        setCategoryPk(searchParams.value);
    }, [searchParams.value]);

    const onSelectCategoryHandler = (categoryPk: string) => {
        select(categoryPk);
    }

    return (
        <div className={'fixed left-[5%] xl:left-[13%]'}>
            <div className={'flex flex-col gap-20'}>
                <div className={'flex flex-col w-60 gap-3 shadow rounded p-3'}>
                    <div className={'flex gap-2 justify-center items-center text-sm py-2 font-bold'}>
                        <FontAwesomeIcon icon={faBars} />
                        <span>
                            메뉴
                        </span>
                    </div>
                    <div className={'w-auto text-sm'}>
                        <CategorySelect onClick={onSelectCategoryHandler} categoryPk={categoryPk} />
                    </div>
                </div>

                {
                    roles.length > 0
                    && <div className={'flex flex-col w-60 shadow rounded p-3 gap-3'}>
                      <div className={'flex gap-2 justify-center items-center text-sm font-bold'}>
                        <FontAwesomeIcon icon={faPen} />
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
                                      return <></>
                                  }

                                  return (
                                      <Link key={'category-write' + index}
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
    categoryPk,
    onClick
}: {
    categoryPk: string,
    onClick: (categoryPk: string) => void
}) => {
    
    const [selectToggle, setSelectToggle] = useState(false);

    const onToggleHandler = () => {
        setSelectToggle(!selectToggle);
    }

    const selectHandler = (pk: string) => {
        if(categoryPk === pk) return;

        onClick(pk);
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
                <span>{Category.findById(categoryPk)?.name ?? '카테고리'}</span>
                <div>
                    <div className={['duration-700', selectToggle ? 'rotate-180' : 'rotate-0'].join(' ')}>
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
                            <button key={'category' + index}
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