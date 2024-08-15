import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {faPen} from "@fortawesome/free-solid-svg-icons/faPen";
import Link from "next/link";
import HotKeybtn from "@/app/{components}/hotKeybtn";
import React from "react";
import {Category} from "@/app/board/{services}/types";
import {System} from "@/app/user/system/{services}/types";

const WriteMenu = ({
    boardBaseUrl,
    confirmRole
}: {
    boardBaseUrl: string;
    confirmRole: (item: { roles: System.Role[] }) => System.Role | undefined;

}) => {

    return (
        <div className={'pb-4 flex flex-col w-full border-b border-solid border-b-gray-200'}>
            <div className={'flex gap-2 items-center text-sm font-bold py-2'}>
                <FontAwesomeIcon icon={faPen} height={'16'} />
                <span>
                              글쓰기
                        </span>
            </div>
            <div className={'w-full flex flex-col items-center text-xs'}
                 data-testid={'write-menu'}
            >
                {
                    Category.list.map((item, index) => {
                        const hasRoleCategory = confirmRole(item);

                        if(item.id === '0' || !hasRoleCategory) {
                            return null
                        }
                        return (
                            <CategoryItem key={'category' + index} {...{item, index, boardBaseUrl}} />
                        )
                    })
                }
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

export default React.memo(WriteMenu);