import {PageI} from "@/app/{commons}/types/commons";
import Link from "next/link";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {redirect} from "next/navigation";
import {faAnglesLeft, faAnglesRight} from "@fortawesome/free-solid-svg-icons";

const PageNavigator = ({
    page, size, total
}: PageI) => {

    const lastPage = Math.ceil(total / size);

    const startPAge = Math.max(1, page - 3);

    const curEndPage = Math.min(lastPage, page + 3);

    const pages = Array.from({length: curEndPage - startPAge + 1}, (_, i) => startPAge + i);

    const skipNextPage = page + 5 > lastPage ? lastPage : page + 5;
    const skipPrevPage = page - 5 < 1 ? 1 : page - 5;

    if(total !== 0 && lastPage < page) {
        redirect(`?page=${lastPage}&size=${size}`);
    } else if(total !== 0 && page < 1) {
        redirect(`?page=1&size=${size}`);
    }

    return (
        <div className={'w-full flex justify-center gap-x-2 mt-6'}>
            {
                page !== 1 &&
                  <Link className={['border border-solid border-gray-300 rounded-md text-sm px-4 py-2'].join(' ')}
                        href={`?page=${skipPrevPage}&size=${size}`}
                  >
                    <FontAwesomeIcon icon={faAnglesLeft} />
                  </Link>
            }
            {
                pages.map((item, index) => {
                    return (
                        <Link className={['border border-solid border-gray-300 rounded-md text-sm px-4 py-2', page === item ? 'bg-blue-500 text-white' : ''].join(' ')}
                              href={`?page=${item}&size=${size}`}
                              key={`navi-${index}`}
                              prefetch={true}
                        >
                            {item}
                        </Link>
                    )
                })
            }
            {
                page !== lastPage && lastPage !== 0 && total !== 0 &&
                  <Link className={'border border-solid border-gray-300 rounded-md text-sm px-4 py-2'}
                        href={`?page=${skipNextPage}&size=${size}`}
                  >
                    <FontAwesomeIcon icon={faAnglesRight} />
                  </Link>
            }
        </div>
    )
}

export default PageNavigator;