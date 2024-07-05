import Link from "next/link";

export default function NotFound() {
    return (
        <div className={'w-full h-svh flex flex-col gap-5 justify-center items-center'}>
            <h2 className={'text-3xl font-bold'}>Not Found</h2>
            <p>요청한 페이지를 찾을 수 없습니다.</p>
            <Link className={'text-blue-700t'}
                  href={'/'}
            >메인으로 돌아가기
            </Link>
        </div>
    )
}