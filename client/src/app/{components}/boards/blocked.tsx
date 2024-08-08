import HeaderComponent from "@/app/{components}/headerComponent";
import FooterComponent from "@/app/{components}/footerComponent";
import {Root} from "@/app/{services}/types";

const Blocked = (props: Root.BoardListI) => {
    return (
        <>
            <HeaderComponent {...props} />
            <div className={'p-3 flex flex-col h-full'}>
                <p className={'line-clamp-[3] text-xs break-all whitespace-pre-line'}>
                    열람이 제한된 게시글입니다.
                </p>
            </div>
            <FooterComponent {...props} />
        </>
    )
}

export default Blocked;