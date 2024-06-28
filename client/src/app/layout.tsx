import "./init.css"
import NavMain from "@/app/NavMain";
import {ErrorBoundary} from "next/dist/client/components/error-boundary";
import Error from "@/app/error";
import {Metadata, Viewport} from "next";
import Head from "next/head";
import Script from "next/script";

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
        <body>
            <NavMain />
            <div>
                <ErrorBoundary errorComponent={Error}>
                    {children}
                </ErrorBoundary>
            </div>
        </body>
	</html>
  )
}
