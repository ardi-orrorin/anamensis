import {BoardListI} from "@/app/{components}/boardComponent";
import FooterComponent from "@/app/{components}/footerComponent";
import React from "react";
import HeaderComponent from "@/app/{components}/headerComponent";
import {BlockI} from "@/app/board/{services}/types";
import {EventExtraValue} from "@/app/board/{components}/block/extra/eventBlock";
import moment from "moment/moment";

const CalenderComponent = (props: BoardListI) => {
    const { body } = props;

    const eventBlocks = body?.filter((block) => {
        return block.code === '00411'
    }) as BlockI[];

    return (
        <>
            <HeaderComponent {...props} />
            <div className={'w-full flex flex-col gap-3 justify-start items-start px-3 text-xs'}>
                <table className={'w-full'}>
                    <colgroup>
                        <col className={'min-w-44'} />
                        <col className={'w-full'} />
                    </colgroup>
                    <tbody>
                        {
                            eventBlocks.map((eventBlock, index) => {
                                if(index > 3) return ;

                                const start = moment((eventBlock.extraValue as EventExtraValue).start).format('YYYY-MM-DD');
                                const end = moment((eventBlock.extraValue as EventExtraValue).end).format('YYYY-MM-DD');

                                return (
                                    <tr key={'event' + eventBlock.hash + index}
                                        className={'w-full h-6'}
                                    >
                                        <td className={'flex gap-1'}>
                                            <span className={'flex w-20'}>{start}</span>
                                            <span className={'flex w-5 justify-start'}>~</span>
                                            <span className={'flex w-20'}>{end}</span>
                                        </td>
                                        <td className={'font-bold'}>
                                            {eventBlock.value}
                                        </td>
                                    </tr>
                                )
                            })
                        }
                    </tbody>


                </table>

            </div>
            <FooterComponent {...props} />
        </>
    )
}

export default CalenderComponent;