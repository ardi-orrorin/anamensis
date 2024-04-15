import {PageI} from "@/app/{commons}/types/commons";
import Link from "next/link";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {faAnglesLeft} from "@fortawesome/free-solid-svg-icons/faAnglesLeft";
import {faAnglesRight} from "@fortawesome/free-solid-svg-icons";

const PageNavigator = ({
    page, size, total
}: PageI) => {

    const lastPage = Math.ceil(total / size);

    const startPAge = Math.max(1, page - 3);

    const curEndPage = Math.min(lastPage, page + 3);

    const pages = Array.from({length: curEndPage - startPAge + 1}, (_, i) => startPAge + i);

    return (
        <div className={'w-full flex justify-center gap-x-2 mt-6'}>
            {
                page !== 1 &&
                  <Link className={['border border-solid border-gray-300 rounded-md text-sm px-4 py-2'].join(' ')}
                        href={`?page=1&size=${size}`}
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
                        >
                            {item}
                        </Link>
                    )
                })
            }
            {
                page !== lastPage &&
                  <Link className={['border border-solid border-gray-300 rounded-md text-sm px-4 py-2'].join(' ')}
                        href={`?page=${lastPage}&size=${size}`}
                  >
                    <FontAwesomeIcon icon={faAnglesRight} />
                  </Link>
            }
        </div>
    )
}

export default PageNavigator;