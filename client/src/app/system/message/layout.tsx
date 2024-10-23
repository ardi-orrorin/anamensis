import SystemContainer from "@/app/system/{components}/systemContainer";

export default function Layout({children}: {children: React.ReactNode}) {
    return (
        <SystemContainer headline={'시스템 메시지 설정'}>
            {children}
        </SystemContainer>
    )
}