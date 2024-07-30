import HeaderComponent from "@/app/{components}/headerComponent";
import FooterComponent from "@/app/{components}/footerComponent";
import {BoardListI} from "@/app/{components}/boardComponent";

const Blocked = (props: BoardListI) => {
    return (
        <>
            <HeaderComponent {...props} />
            <div className={'p-3 flex flex-col h-full'}>
                <p className={'line-clamp-[3] text-xs break-all whitespace-pre-line'}>
                    차단된 게시글입니다.
                </p>
            </div>
            <FooterComponent {...props} />
        </>
    )
}

export default Blocked;