import "./init.css"
import NavMain from "@/app/NavMain";
import {ErrorBoundary} from "next/dist/client/components/error-boundary";
import Error from "@/app/error";
import {Metadata, Viewport} from "next";
import Script from "next/script";
import Footer from "@/app/{components}/mainFooter";
import ProgressBar from "@/app/{components}/progressBar";
import Providers from "@/app/Provider";
import {cookies} from "next/headers";
import LoginState from "@/app/loginState";
import {SearchHistoryContext, SearchHistoryProvider} from "@/app/{hooks}/searchHisotryHook";
import SearchHistory from "@/app/{components}/searchHistory";

export const metadata: Metadata = {
    title: 'anamensis',
    description: 'anamensis',
    twitter: {},
    icons: {
        icon: 'https://cdn.anamensis.site/favicon.ico',
    },
    openGraph: {
        title: 'anamensis',
        description: 'anamensis',
        type: 'website',
        locale: 'ko_KR',
        siteName: 'anamensis',
        images: [
            {
                url: 'https://cdn.anamensis.site/ms-icon-310x310.png',
                width: 310,
                height: 310,
                alt: 'anamensis',
            },
        ],
        url: 'https://anamensis.site',
    },
}

export const viewport: Viewport = {
    width: 'device-width',
    initialScale: 1.0,
    userScalable: false,
    maximumScale: 1,
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {

    const gId = process.env.NEXT_PUBLIC_GID;

    const isLogin = (cookies()?.get('next.access.token')  || cookies()?.get('next.refresh.token')) !== undefined;

    return (
        <html lang="ko">
            <Script id={'google-analytics'} async
                    src={`https://www.googletagmanager.com/gtag/js?id=G-${gId}`}
            />
            <Script id={'google-analytics'} dangerouslySetInnerHTML={{
                __html: `
                window.dataLayer = window.dataLayer || [];
                function gtag(){dataLayer.push(arguments);}
                gtag('js', new Date());
        
                gtag('config', 'G-${gId}');
                `
            }} />
            <body className={'flex flex-col'}>
            <Providers>
                { isLogin && <LoginState /> }
                <ProgressBar />
                <NavMain />
                <ErrorBoundary errorComponent={Error}>
                    <SearchHistoryProvider>
                        <main className={'w-full min-h-screen'}>
                            {children}
                        </main>
                    </SearchHistoryProvider>
                </ErrorBoundary>
                <Footer />
            </Providers>
            </body>
        </html>
    )
}
