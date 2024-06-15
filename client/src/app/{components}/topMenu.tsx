import {Category} from "@/app/board/{services}/types";
import Link from "next/link";
import {BoardListParams} from "@/app/page";
import {useEffect, useState} from "react";

const TopMenu = ({
    select,
    searchParams,
}:{
    searchParams: BoardListParams,
    select: (categoryPk: string) => void
}) => {
    const [categoryPk, setCategoryPk] = useState('');

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
        <div className={'w-full flex flex-wrap gap-2 justify-center text-gray-700'}>
            {
                Category.list.map((item, index) => {
                    return (
                        <button key={'category-write' + index}
                                className={[
                                    'py-3 w-[31.5%] text-sm text-center border border-solid border-gray-100 shadow hover:bg-gray-100 duration-300',
                                    categoryPk === item.id ? 'bg-gray-100' : ''
                                ].join(' ')}
                                onClick={() => onSelectCategoryHandler(item.id)}
                                disabled={categoryPk === item.id}
                        >
                            {item.name}
                        </button>
                    )
                })
            }
        </div>
    );
}

export default TopMenu;