import {Category} from "@/app/board/{services}/types";
import {useContext, useEffect, useState} from "react";
import SearchParamsProvider, {BoardListParamsI} from "@/app/{services}/SearchParamsProvider";

const TopMenu = () => {

    const {searchParams, setSearchParams} = useContext(SearchParamsProvider);

    const onChangeCategory = (value: string) => {
        setSearchParams({page: 1, size: 20, categoryPk: value} as BoardListParamsI);
    }

    return (
        <div className={'w-full flex flex-wrap gap-2 justify-center text-gray-700'}>
            {
                Category.list.map((item, index) => {
                    return (
                        <button key={'category-write' + index}
                                className={[
                                    'py-3 w-[31.5%] text-sm text-center border border-solid border-gray-100 shadow hover:bg-gray-100 duration-300',
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
    );
}

export default TopMenu;