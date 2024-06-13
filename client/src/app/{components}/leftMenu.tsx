import {useEffect, useState} from "react";
import {BoardListParams} from "@/app/page";
import {Category} from "@/app/board/{services}/types";

const LeftMenu = ({
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
        <div className={'fixed left-[5%] xl:left-[13%]'}>
            <div className={'flex flex-col gap-20'}>
                <div className={'flex flex-col w-60 gap-3 shadow rounded p-3'}>
                    <div className={'w-auto text-sm'}>
                        <CategorySelect onClick={onSelectCategoryHandler} categoryPk={categoryPk} />
                    </div>
                </div>

                {/*<div className={'w-60 h-40 shadow rounded'}>*/}
                {/*    두번째*/}
                {/*</div>*/}
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
        <div className={['relative w-auto text-xs bg-gray-50', selectToggle ? 'rounded-t-sm' : 'rounded-sm'].join(' ')}>
            <button className={['flex gap-3 w-full justify-between py-2 px-3 border-solid border border-white focus:outline-none'].join(' ')} onClick={onToggleHandler}
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
                selectToggle ? 'max-h-80 rounded-b-sm' : 'max-h-0'].join(' ')
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