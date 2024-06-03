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
                url: 'https://www.google.com/url?sa=i&url=https%3A%2F%2Fm.post.naver.com%2Fviewer%2FpostView.nhn%3FvolumeNo%3D9107217%26memberNo%3D38288787%26vType%3DVERTICAL&psig=AOvVaw02Gsl8-KKZvSJvIb-8wNvW&ust=1717482183785000&source=images&cd=vfe&opi=89978449&ved=0CA8QjRxqFwoTCMDRyu7lvoYDFQAAAAAdAAAAABAD',
                width: 800,
                height: 600,
                alt: 'anamensis',
            },
        ],
        url: 'https://anamensis.com',
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
