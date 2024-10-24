import "./init.css"
import NavMain from "@/app/NavMain";
import {ErrorBoundary} from "next/dist/client/components/error-boundary";
import Error from "@/app/error";
import {Metadata, Viewport} from "next";
import Footer from "@/app/{components}/mainFooter";
import ProgressBar from "@/app/{components}/progressBar";
import Providers from "@/app/Provider";
import {cookies} from "next/headers";
import LoginState from "@/app/loginState";
import {SearchHistoryProvider} from "@/app/{hooks}/searchHisotryHook";
import {SearchParamsProvider} from "@/app/{hooks}/searchParamsHook";
import Chat from "@/app/{components}/modal/chats/chat";
import {WebSocketProvider} from "@/app/{components}/modal/chats/hook/useWebSocket";
import {ChatMenuProvider} from "@/app/{components}/modal/chats/hook/useChatMenu";
import {DefaultImageProvider} from "@/app/{hooks}/useDefaultImage";
import GlobalState from "@/app/globalState";


export const metadata: Metadata = {
    title: 'anamensis',
    description: 'anamensis',
    icons: {
        icon: './favicon.ico',
    },
    openGraph: {
        title: 'anamensis',
        description: 'anamensis',
        type: 'website',
        locale: 'ko_KR',
        siteName: 'anamensis',
        images: [
            {
                url: './static/ms-icon-310x310.png',
                width: 310,
                height: 310,
                alt: 'anamensis',
            },
        ],
        url: process.env.NEXT_PUBLIC_BASE_URL,
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

    const isLogin = (cookies()?.get('next.access.token')  || cookies()?.get('next.refresh.token')) !== undefined;

    return (
        <html lang="ko">
            <body className={'flex flex-col'}>
            <Providers>
                <DefaultImageProvider>
                    <GlobalState />
                    {
                        isLogin
                        && <>
                            <LoginState />
                            <WebSocketProvider>
                                <ChatMenuProvider>
                                    <Chat />
                                </ChatMenuProvider>
                            </WebSocketProvider>
                        </>
                    }
                    <ProgressBar />
                    <NavMain />
                    <ErrorBoundary errorComponent={Error}>
                        <SearchHistoryProvider>
                            <SearchParamsProvider>
                                <main className={'w-full min-h-screen'}>
                                    {children}
                                </main>
                            </SearchParamsProvider>
                        </SearchHistoryProvider>
                    </ErrorBoundary>
                    <Footer />
                </DefaultImageProvider>
            </Providers>
            </body>
        </html>
    )
}
