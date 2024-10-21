import SmtpInfo from "@/app/system/smtp/{components}/smtpInfo";
import SystemContainer from "@/app/system/{components}/systemContainer";

export default function Layout({children}: {children: React.ReactNode}) {
    return (
        <div className={'h-full flex flex-col gap-2'}>
            <SystemContainer headline={'SMTP 설정'}>
                <SmtpInfo/>
            </SystemContainer>
            <SystemContainer headline={'발송 내역'}>
                {children}
            </SystemContainer>
        </div>
    )
}