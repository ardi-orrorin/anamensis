import {QuestionBlockExtraValueType} from "@/app/board/{components}/block/extra/questionBlock";
import HeaderComponent from "@/app/{components}/headerComponent";
import React from "react";
import FooterComponent from "@/app/{components}/footerComponent";
import {Root} from "@/app/{services}/types";

const QuestionBoardComponent = (props: Root.BoardListI) => {
    const { body} = props;

    const alttuelBlock = body?.filter((block) =>
        block.code === '00303'
    )[0];

    const extraValue = alttuelBlock?.extraValue as QuestionBlockExtraValueType;
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
            <div className={'w-full flex flex-col gap-3 justify-start items-start px-3'}>
                <div className={'flex gap-2'}>
                    <label className={['text-xs2 px-2 py-1 text-white', extraValue?. state === 'wait' ? 'bg-green-700' : 'bg-yellow-600'].join(' ')}>
                        {extraValue?.state === 'wait' ? '대기중' : '완료'}
                    </label>
                    <label className={'text-xs2 px-2 py-1 text-white bg-blue-500'}>
                        {extraValue?.point}
                    </label>
                    <label className={'text-xs2 px-2 py-1 text-white bg-gray-600'}>
                        {extraValue?.endDate}
                    </label>
                </div>
                <div className={''}>
                    <p className={'line-clamp-[1] text-xs break-all whitespace-pre-line'}>
                        {text}
                    </p>
                </div>
            </div>
            <FooterComponent {...props} />
        </>
    )
}

export default QuestionBoardComponent;