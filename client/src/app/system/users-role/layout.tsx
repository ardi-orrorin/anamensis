import SystemContainer from "@/app/system/{components}/systemContainer";

export default function Layout({children}: {children: React.ReactNode}) {
    return (
        <SystemContainer headline={'유저 권한 관리'}>
            {children}
        </SystemContainer>
    )
}