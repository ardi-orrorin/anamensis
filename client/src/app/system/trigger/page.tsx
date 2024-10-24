'use client';

import {TriggerProvider} from "@/app/system/trigger/hooks/useTrigger";
import TriggerTemplate from "@/app/system/trigger/{components}/triggerTemplate";

export default function Page() {

    const triggerJobs = [
        {jobName: 'dummy-file-delete-job-trigger', headline: '더미 데이터 삭제', description: '사용되지 않은 데이터를 삭제합니다.'},
    ]

    return (
        <div className={'flex flex-col gap-3'}>
            <TriggerProvider>
                {
                    triggerJobs.map((job, idx) => {
                        const {jobName, headline, description} = job;

                        return <TriggerTemplate
                            key={idx}
                            {...{jobName, headline, description}}
                        />
                    })
                }
            </TriggerProvider>
        </div>
    )
}
