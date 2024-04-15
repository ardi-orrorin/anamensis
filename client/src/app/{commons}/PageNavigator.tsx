import {PageI} from "@/app/{commons}/types/commons";
import Link from "next/link";

const PageNavigator = ({
    page, size, total
}: PageI) => {

    const lastPage = Math.ceil(total / size);

    const startPAge = Math.max(1, page - 3);

    const curEndPage = Math.min(lastPage, page + 3);

    const pages = Array.from({length: curEndPage - startPAge + 1}, (_, i) => startPAge + i);

    return (
        <div className={'w-full flex justify-center gap-2 my-6'}>
            {
                pages.map((item, index) => {
                    return (
                        <div key={`'navigator-'${index}`}>
                            <Link className={['border border-solid border-gray-300 rounded-md text-sm px-3 py-1', page === item ? 'bg-blue-500 text-white' : ''].join(' ')}
                                  href={`?page=${item}&size=${size}`}
                            >
                                {item}
                            </Link>
                        </div>
                    )
                })
            }
        </div>
    )
}

export default PageNavigator;