import Link from "next/link";

export default function Layout({children}: {children: React.ReactNode}) {
    const menuItems = [
        {name: 'History', href:'./user/history'},
    ]
    return (
        <main className={'flex min-h-screen'}>
            <nav className={'w-40 shadow-outset-lg p-4'}>
                <ul>
                    {
                        menuItems.map((item, index) => {
                            return (
                                <li key={index}>
                                    <Link href={item.href}>{item.name}</Link>
                                </li>
                            )
                        })
                    }
                </ul>
            </nav>
            <section className={'w-full flex justify-center border-s border-solid border-gray-200 p-4'}>
                {children}
            </section>
        </main>
    )
}