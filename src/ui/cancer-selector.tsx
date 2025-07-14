import React from 'react';
import { PCAWG_SAMPLES } from './VisOverviewPanel/OverviewPanel';

type CancerSelectorProps = {
    selectedSample: string;
    setSelectedSample: (sample: string) => void;
    onChange: (url: string) => void;
};

export const CancerSelector = ({ selectedSample, setSelectedSample, onChange }: CancerSelectorProps) => {
    return (
        <div className="filter">
            <div className="cancer-selector">
                <select
                    className="dropdown"
                    onChange={e => {
                        const selectedValue = e.currentTarget.value;
                        if (selectedValue) {
                            onChange(e.currentTarget.value);
                        }
                    }}
                >
                    <option key={'Curated Sample Sets'} value={null}>
                        Curated Sample Sets
                    </option>
                    {PCAWG_SAMPLES.sort((a, b) => (a.name > b.name ? 1 : -1)).map(sample => {
                        const str = `${sample.name.split('] ')[1]} (${sample.count} samples)`;
                        const configUrl = sample.url.replace(
                            'https://chromoscope.bio/app/?showSamples=true&external=',
                            ''
                        );
                        return (
                            <option key={str} value={configUrl}>
                                <span>{str}</span>
                            </option>
                        );
                    })}
                </select>
            </div>
        </div>
    );
};
