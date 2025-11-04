import React, { useState } from 'react';
import { SampleType } from '../data/samples';
import { UploadModal } from './UploadModal';
import { Cohorts } from '../App';

export type SampleConfig = Partial<
    Omit<SampleType, 'group' | 'cnFields' | 'note' | 'drivers' | 'assembly' | 'thumbnail'>
> & {
    drivers?: string;
    assembly?: 'hg19' | 'hg38';
};

export type ValidSampleConfig = Required<Pick<SampleConfig, 'id' | 'cancer' | 'sv' | 'cnv' | 'assembly'>> &
    Omit<SampleConfig, 'id' | 'cancer' | 'sv' | 'cnv' | 'assembly'>;

export type ValidCohort = {
    name?: string;
    samples: ValidSampleConfig[];
};

type SampleConfigFormProps = {
    cohorts: Cohorts;
    demoIndex: React.MutableRefObject<number>;
    setCohorts: (cohorts: Cohorts) => void;
    selectedCohort: string;
    setSelectedCohort: (cohortId: string) => void;
    setDemo: (demo: SampleConfig) => void;
};

export default function SampleConfigForm({
    cohorts,
    selectedCohort,
    demoIndex,
    setSelectedCohort,
    setCohorts,
    setDemo
}: SampleConfigFormProps) {
    const [uploadedCohort, setUploadedCohort] = useState<ValidCohort>(null);
    const [sampleConfig, setSampleConfig] = useState<SampleConfig>({});
    const [showNewSampleConfig, setShowNewSampleConfig] = useState(false);

    return (
        <div className="upload-button-container">
            <UploadModal
                demoIndex={demoIndex}
                setDemo={setDemo}
                cohorts={cohorts}
                setCohorts={setCohorts}
                sampleConfig={sampleConfig}
                setSampleConfig={setSampleConfig}
                uploadedCohort={uploadedCohort}
                setUploadedCohort={setUploadedCohort}
                showNewSampleConfig={showNewSampleConfig}
                setShowNewSampleConfig={setShowNewSampleConfig}
                selectedCohort={selectedCohort}
                setSelectedCohort={setSelectedCohort}
            />
        </div>
    );
}
