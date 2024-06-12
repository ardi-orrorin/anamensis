import "./init.css"
import NavMain from "@/app/NavMain";
import {ErrorBoundary} from "next/dist/client/components/error-boundary";
import Error from "@/app/error";
import {Metadata} from "next";


export const metadata: Metadata = {
    title: 'anamensis',
    description: 'anamensis',
    twitter: {},
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

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
	<html lang="ko">
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
