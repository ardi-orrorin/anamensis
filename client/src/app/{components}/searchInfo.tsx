import {useCallback, useContext, useMemo} from "react";
import SearchParamsProvider from "@/app/{services}/SearchParamsProvider";
import {Category} from "@/app/board/{services}/types";

const SearchInfo = () => {
    const {searchParams, setSearchParams} = useContext(SearchParamsProvider);

    const onChangeSearchHandler = useCallback((type:string) => {
        const isCategory = type === 'categoryPk';

        const params = {
            ...searchParams,
            page: 1, size: 20,
            [type]: isCategory ? 0 : false,
        }

        setSearchParams(params);
    },[searchParams]);

    const CategoryName = useMemo(() =>
        Category.findById(searchParams?.categoryPk!)?.name!
    ,[searchParams.categoryPk])

    return (
        <div className={'flex gap-2'}>
            {
                searchParams.isSelf
                && <DisabledBtn {...{name: '내 글 보기', type: 'isSelf', onChangeSearchHandler}} />
            }
            {
                searchParams.isFavorite
                && <DisabledBtn {...{name: '즐겨 찾기', type: 'isFavorite', onChangeSearchHandler}} />
            }
            {
                searchParams?.categoryPk?.toString() !== '0'
                && searchParams?.categoryPk
                && <DisabledBtn {...{name: CategoryName, type: 'categoryPk', onChangeSearchHandler}} />
            }
        </div>
    )
}

const DisabledBtn =  ({
    name,
    type,
    onChangeSearchHandler
}: {
    name: string
    type: string
    onChangeSearchHandler: (type:string) => void
}) => {
    return (
        <button className={'px-3 py-1.5 rounded text-xs2 border border-solid border-blue-600 text-blue-600 hover:bg-blue-600 hover:text-white'}
                onClick={()=> onChangeSearchHandler(type)}
        >
            {name} X
        </button>
    )
}

export default SearchInfo;