'use client';
import {PageI} from "@/app/{commons}/types/commons";
import Link from "next/link";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {redirect, usePathname, useRouter, useSearchParams} from "next/navigation";
import {faAnglesLeft, faAnglesRight} from "@fortawesome/free-solid-svg-icons";
import {useCallback, useMemo} from "react";

const PageNavigator = ({
    page, size, total
}: PageI) => {

    const searchParams = useSearchParams();
    const pathname = usePathname();

    const lastPage = useMemo(() => Math.ceil(total / size), [total, size]);

    const startPAge = useMemo(() => Math.max(1, page - 3), [page]);

    const curEndPage = useMemo(() => Math.min(lastPage, page + 3), [lastPage, page]);

    const pageNumbers = useMemo(()=>
        Array.from({length: curEndPage - startPAge + 1}, (_, i) => startPAge + i)
    ,[curEndPage, startPAge, page])

    const skipNextPage = useMemo(() => page + 5 > lastPage ? lastPage : page + 5,[page, lastPage]);
    const skipPrevPage = useMemo(() => page - 5 < 1 ? 1 : page - 5,[page]);

    const createQueryStr = (page: number) => {
        const params = new URLSearchParams(searchParams.toString());
        params.set('page', page.toString());
        return params.toString();
    }

    const pages = useMemo(() =>
        pageNumbers.map((item, index) => {
            return (
                <Link className={['border border-solid border-gray-300 rounded-md text-sm px-4 py-2', page === item ? 'bg-main text-white' : 'hover:bg-main hover:text-white duration-500'].join(' ')}
                      href={pathname + '?' + createQueryStr(item)}
                      key={`navi-${index}`}
                      prefetch={true}
                >
                    {item}
                </Link>
            )
        })
    ,[searchParams, pageNumbers])

    return (
        <div className={'w-full flex justify-center gap-x-2 mt-6'}>
            {
                page !== 1 &&
                  <Link className={['border border-solid border-gray-300 rounded-md text-sm px-4 py-2 hover:bg-main hover:text-white duration-500'].join(' ')}
                        href={`?page=${skipPrevPage}&size=${size}`}
                  >
                    <FontAwesomeIcon icon={faAnglesLeft} />
                  </Link>
            }
            { pages }
            {
                page !== lastPage && lastPage !== 0 && total !== 0 &&
                  <Link className={'border border-solid border-gray-300 rounded-md text-sm px-4 py-2 hover:bg-main hover:text-white duration-500'}
                        href={`?page=${skipNextPage}&size=${size}`}
                  >
                    <FontAwesomeIcon icon={faAnglesRight} />
                  </Link>
            }
        </div>
    )
}

export default PageNavigator;