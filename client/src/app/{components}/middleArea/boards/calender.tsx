import FooterComponent from "@/app/{components}/middleArea/footerComponent";
import React from "react";
import HeaderComponent from "@/app/{components}/middleArea/headerComponent";
import {BlockI} from "@/app/board/{services}/types";
import {EventExtraValue} from "@/app/board/{components}/block/extra/eventBlock";
import moment from "moment/moment";
import {Root} from "@/app/{services}/types";

const CalenderComponent = (props: Root.BoardListI) => {
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
                                        className={'w-full flex h-6'}
                                    >
                                        <td className={'flex gap-1 items-center'}>
                                            <span className={'flex w-20 h-full items-center'}>{start}</span>
                                            <span className={'flex w-5 h-full justify-start items-center'}>~</span>
                                            <span className={'flex w-20 h-full items-center'}>{end}</span>
                                        </td>
                                        <td className={'flex min-w-full font-bold items-center'}>
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