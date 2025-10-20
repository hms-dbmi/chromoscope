import React from 'react';

import { ICONS } from '../../icon';
import { OverviewPanel } from './OverviewPanel';
import { FEEDBACK_EMAIL_ADDRESS } from '../../constants';
import { Cohorts } from '../../App';
import { SampleType } from '../../data/samples';

type VisOverviewPanelProps = {
    showSamples: boolean;
    generateThumbnails: boolean;
    demo: SampleType;
    demoIndex: React.MutableRefObject<number>;
    externalDemoUrl: React.MutableRefObject<string>;
    filteredSamples: Array<any>;
    doneGeneratingThumbnails: boolean;
    selectedCohort: string;
    cohorts: Cohorts;
    setCohorts: (cohorts: Cohorts) => void;
    setSelectedCohort: (cohort: string) => void;
    setShowSamples: (showSamples: boolean) => void;
    setShowAbout: (showAbout: boolean) => void;
    setFilterSampleBy: (filter: string) => void;
    setFilteredSamples: (samples: Array<any>) => void;
    setGenerateThumbnails: (generate: boolean) => void;
    setDemo: (demo: SampleType) => void;
};

export const VisOverviewPanel = ({
    showSamples,
    setShowSamples,
    setShowAbout,
    setFilterSampleBy,
    generateThumbnails,
    demo,
    demoIndex,
    externalDemoUrl,
    filteredSamples,
    selectedCohort,
    cohorts,
    setCohorts,
    setSelectedCohort,
    setFilteredSamples,
    setGenerateThumbnails,
    setDemo,
    doneGeneratingThumbnails
}: VisOverviewPanelProps) => {
    return (
        <div className={'vis-overview-panel ' + (!showSamples ? 'hide' : '')}>
            <div className="navigation-container">
                <div
                    className="links-left"
                    onClick={e => {
                        if (e.target === e.currentTarget) setShowSamples(false);
                    }}
                >
                    <button
                        className="config-button"
                        tabIndex={0}
                        onClick={() => {
                            setShowSamples(false);
                        }}
                    >
                        <svg viewBox="0 0 16 16">
                            <title>Close</title>
                            <path
                                d="M4.646 4.646a.5.5 0 0 1 .708 0L8 7.293l2.646-2.647a.5.5 0 0 1 .708.708L8.707 8l2.647 2.646a.5.5 0 0 1-.708.708L8 8.707l-2.646 2.647a.5.5 0 0 1-.708-.708L7.293 8 4.646 5.354a.5.5 0 0 1 0-.708z"
                                fill="currentColor"
                            ></path>
                        </svg>
                    </button>

                    <div className="sample-information">
                        <a className="chromoscope-title" href="./" tabIndex={0}>
                            CHROMOSCOPE
                        </a>
                        <a
                            tabIndex={0}
                            className="title-about-link"
                            onClick={() => {
                                setShowAbout(true);
                            }}
                        >
                            <svg
                                xmlns="http://www.w3.org/2000/svg"
                                width="20"
                                height="20"
                                fill="currentColor"
                                viewBox="0 0 16 16"
                            >
                                <path d="M5.933.87a2.89 2.89 0 0 1 4.134 0l.622.638.89-.011a2.89 2.89 0 0 1 2.924 2.924l-.01.89.636.622a2.89 2.89 0 0 1 0 4.134l-.637.622.011.89a2.89 2.89 0 0 1-2.924 2.924l-.89-.01-.622.636a2.89 2.89 0 0 1-4.134 0l-.622-.637-.89.011a2.89 2.89 0 0 1-2.924-2.924l.01-.89-.636-.622a2.89 2.89 0 0 1 0-4.134l.637-.622-.011-.89a2.89 2.89 0 0 1 2.924-2.924l.89.01.622-.636zM7.002 11a1 1 0 1 0 2 0 1 1 0 0 0-2 0zm1.602-2.027c.04-.534.198-.815.846-1.26.674-.475 1.05-1.09 1.05-1.986 0-1.325-.92-2.227-2.262-2.227-1.02 0-1.792.492-2.1 1.29A1.71 1.71 0 0 0 6 5.48c0 .393.203.64.545.64.272 0 .455-.147.564-.51.158-.592.525-.915 1.074-.915.61 0 1.03.446 1.03 1.084 0 .563-.208.885-.822 1.325-.619.433-.926.914-.926 1.64v.111c0 .428.208.745.585.745.336 0 .504-.24.554-.627z" />
                            </svg>
                            <span>About</span>
                        </a>
                        <span className="dimed">{' | '}</span> Samples
                        <input
                            type="text"
                            className="sample-text-box"
                            placeholder="Search samples by ID"
                            onChange={e => setFilterSampleBy(e.target.value)}
                            hidden
                        />
                    </div>
                </div>
                <div className="navigation-links-container links-right">
                    <a
                        className="title-github-link"
                        href="https://github.com/hms-dbmi/chromoscope"
                        target="_blank"
                        rel="noreferrer"
                        tabIndex={showSamples ? 0 : -1}
                    >
                        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
                            <title>GitHub</title>
                            <path
                                fill="currentColor"
                                d="M12 .297c-6.63 0-12 5.373-12 12 0 5.303 3.438 9.8 8.205 11.385.6.113.82-.258.82-.577 0-.285-.01-1.04-.015-2.04-3.338.724-4.042-1.61-4.042-1.61C4.422 18.07 3.633 17.7 3.633 17.7c-1.087-.744.084-.729.084-.729 1.205.084 1.838 1.236 1.838 1.236 1.07 1.835 2.809 1.305 3.495.998.108-.776.417-1.305.76-1.605-2.665-.3-5.466-1.332-5.466-5.93 0-1.31.465-2.38 1.235-3.22-.135-.303-.54-1.523.105-3.176 0 0 1.005-.322 3.3 1.23.96-.267 1.98-.399 3-.405 1.02.006 2.04.138 3 .405 2.28-1.552 3.285-1.23 3.285-1.23.645 1.653.24 2.873.12 3.176.765.84 1.23 1.91 1.23 3.22 0 4.61-2.805 5.625-5.475 5.92.42.36.81 1.096.81 2.22 0 1.606-.015 2.896-.015 3.286 0 .315.21.69.825.57C20.565 22.092 24 17.592 24 12.297c0-6.627-5.373-12-12-12"
                            ></path>
                        </svg>
                        <span>GitHub</span>
                    </a>
                    <a
                        className="title-doc-link"
                        href="https://chromoscope.bio/"
                        target="_blank"
                        rel="noreferrer"
                        tabIndex={showSamples ? 0 : -1}
                    >
                        <svg
                            xmlns="http://www.w3.org/2000/svg"
                            width="20"
                            height="20"
                            fill="currentColor"
                            viewBox="0 0 16 16"
                        >
                            <path d="M12 0H4a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2h8a2 2 0 0 0 2-2V2a2 2 0 0 0-2-2zM5 4h6a.5.5 0 0 1 0 1H5a.5.5 0 0 1 0-1zm-.5 2.5A.5.5 0 0 1 5 6h6a.5.5 0 0 1 0 1H5a.5.5 0 0 1-.5-.5zM5 8h6a.5.5 0 0 1 0 1H5a.5.5 0 0 1 0-1zm0 2h3a.5.5 0 0 1 0 1H5a.5.5 0 0 1 0-1z" />
                        </svg>
                        <span>Docs</span>
                    </a>
                    <div className="feedback">
                        <a
                            href={`mailto:${FEEDBACK_EMAIL_ADDRESS}?subject=Chromoscope%20Feedback&body=Feedback%20Type%3A%20General%20Feedback%0D%0A%0D%0AComments%3A%0D%0A%0D%0A%0D%0A`}
                            className="link-button"
                            tabIndex={showSamples ? 0 : -1}
                        >
                            <svg className="button" viewBox={ICONS.MAIL.viewBox}>
                                <title>Mail</title>
                                <path fill="currentColor" d={ICONS.MAIL.path[0]} />
                            </svg>
                            <span>Feedback</span>
                        </a>
                    </div>
                    <button
                        className="thumbnail-generate-button"
                        onClick={() => setGenerateThumbnails(!generateThumbnails)}
                        style={{ display: doneGeneratingThumbnails ? 'none' : 'flex' }}
                    >
                        {generateThumbnails ? 'Stop Generating Thumbnails' : 'Generate Missing Thumbnails'}
                    </button>
                </div>
            </div>
            <OverviewPanel
                cohorts={cohorts}
                setCohorts={setCohorts}
                demo={demo}
                demoIndex={demoIndex}
                externalDemoUrl={externalDemoUrl}
                filteredSamples={filteredSamples}
                setShowSamples={setShowSamples}
                setFilteredSamples={setFilteredSamples}
                setDemo={setDemo}
                selectedCohort={selectedCohort}
                setSelectedCohort={setSelectedCohort}
            />
        </div>
    );
};
