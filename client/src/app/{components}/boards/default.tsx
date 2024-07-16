import FooterComponent from "@/app/{components}/footerComponent";
import HeaderComponent from "@/app/{components}/headerComponent";
import {BoardListI} from "@/app/{components}/boardComponent";

const DefaultBoardComponent = (props: BoardListI) => {
    const { body} = props;

    let text = '';
    try {
        body!.forEach((block) => {
            const regex = '0{4}'
            if(!block.code.match(regex)) return;
            text += block.value + '\n';
        })
    } catch (e) {
        console.log(e)
    }

    return (
        <>
            <HeaderComponent {...props} />
            <div className={'p-3 flex flex-col h-auto'}>
                <p className={'line-clamp-[3] text-xs break-all whitespace-pre-line'}>
                    {text}
                </p>
            </div>
            <FooterComponent {...props} />
        </>
    )
}

export default DefaultBoardComponent;