import React from 'react';

import CancerSelector from '../cancer-selector';
import SampleConfigForm from '../sample-config-form';

type OverviewPanelProps = {
    smallOverviewWrapper: React.ReactNode;
    demoIndex: React.MutableRefObject<number>;
    externalDemoUrl: React.MutableRefObject<string>;
    filteredSamples: Array<any>;
    setFilteredSamples: (samples: Array<any>) => void;
    setDemo: (demo: any) => void;
};

export const OverviewPanel = ({
    smallOverviewWrapper,
    demoIndex,
    externalDemoUrl,
    filteredSamples,
    setFilteredSamples,
    setDemo
}: OverviewPanelProps) => {
    return (
        <div>
            <div className="overview-root">
                <div className="overview-header">
                    <CancerSelector
                        onChange={url => {
                            fetch(url).then(response =>
                                response.text().then(d => {
                                    let externalDemo = JSON.parse(d);
                                    if (Array.isArray(externalDemo) && externalDemo.length >= 0) {
                                        setFilteredSamples(externalDemo);
                                        externalDemo =
                                            externalDemo[
                                                demoIndex.current < externalDemo.length ? demoIndex.current : 0
                                            ];
                                    }
                                    if (externalDemo) {
                                        externalDemoUrl.current = url;
                                        setDemo(externalDemo);
                                    }
                                })
                            );
                        }}
                    />
                    <SampleConfigForm
                        onAdd={config => {
                            setFilteredSamples([
                                {
                                    ...config,
                                    group: 'default'
                                },
                                ...filteredSamples
                            ]);
                        }}
                    />
                </div>
                <div className="overview-status">{`Total of ${filteredSamples.length} samples loaded`}</div>
                <div className="overview-container">{smallOverviewWrapper}</div>
            </div>
        </div>
    );
};
