import React, { useEffect, useState } from 'react';
import * as bootstrap from 'bootstrap/dist/js/bootstrap.bundle.min';

import { ICONS } from '../icon';

type NavigationButtonsProps = {
    isMinimalMode: boolean;
    selectedSvId: string;
};

export const NavigationButtons = ({ isMinimalMode, selectedSvId = '' }: NavigationButtonsProps) => {
    const [activeSection, setActiveSection] = useState('genome');

    // Enable tooltip for when no Structural Variant is selected
    useEffect(() => {
        if (!isMinimalMode) {
            const tooltipTrigger = document.querySelectorAll('.navigation-button-read > button.navigation-button')[0];
            const tooltip = new bootstrap.Tooltip(tooltipTrigger);
            tooltip.disable();
            if (selectedSvId === '') {
                tooltip.enable();
            }
        }
    }, [selectedSvId]);

    // Set up intersection observer for sections
    useEffect(() => {
        // Set up intersection observer for legend element and variant controls
        const legendElement = document.querySelector<HTMLElement>('.genome-view-legend');
        const variantViewControlsElement = document.querySelector<HTMLElement>('.variant-view-controls');

        const options = {
            root: document.querySelector('.gosling-panel'),
            rootMargin: '0px 0px 0px 0px',
            threshold: [0.25]
        };

        /**
         * Create an IntersectionObserver to update state when a user passes
         * a particular landmark on the page
         */
        const observer = new IntersectionObserver(entry => {
            // Ignore when multiple landmarks visible
            if (entry.length < 2) {
                //
                if (entry[0].target.id === 'genome-view-legend') {
                    if (entry[0].intersectionRatio > 0.25) {
                        setActiveSection('genome');
                    } else {
                        setActiveSection('variant');
                    }
                }
                if (entry[0].target.id === 'variant-view-controls') {
                    if (entry[0].intersectionRatio > 0.25) {
                        setActiveSection('variant');
                    } else {
                        setActiveSection('read');
                    }
                }
            }
        }, options);

        observer.observe(legendElement);
        observer.observe(variantViewControlsElement);

        // Unobserve on unmount
        return () => {
            // observer.unobserve(legendElement);
            // observer.unobserve(variantViewControlsElement);
        };
    }, []);

    if (isMinimalMode) {
        return (
            <div className="navigation-buttons">
                <div className="navigation-button-container split navigation-button-genome">
                    <button
                        className="navigation-button split-left"
                        tabIndex={1}
                        onClick={() => {
                            setTimeout(
                                () =>
                                    document.getElementById('gosling-panel')?.scrollTo({ top: 0, behavior: 'smooth' }),
                                0
                            );
                        }}
                    >
                        Genome View
                    </button>
                    <button
                        className="navigation-button split-right"
                        tabIndex={1}
                        data-bs-toggle="modal"
                        data-bs-target="#genome-view-modal"
                    >
                        <svg className="button question-mark" viewBox={ICONS.QUESTION_CIRCLE_FILL.viewBox}>
                            <title>Question Mark</title>
                            {ICONS.QUESTION_CIRCLE_FILL.path.map(p => (
                                <path fill="currentColor" key={p} d={p} />
                            ))}
                        </svg>
                    </button>
                </div>
                <div className="navigation-button-container split navigation-button-variant">
                    <button
                        className="navigation-button split-left"
                        tabIndex={1}
                        onClick={() => {
                            setTimeout(() => {
                                document.getElementById('variant-view')?.scrollIntoView({
                                    block: 'start',
                                    inline: 'nearest',
                                    behavior: 'smooth'
                                }),
                                    0;
                            });
                        }}
                    >
                        Variant View
                    </button>
                    <button
                        className="navigation-button split-right"
                        tabIndex={1}
                        data-bs-toggle="modal"
                        data-bs-target="#variant-view-modal"
                    >
                        <svg className="button question-mark" viewBox={ICONS.QUESTION_CIRCLE_FILL.viewBox}>
                            <title>Question Mark</title>
                            {ICONS.QUESTION_CIRCLE_FILL.path.map(p => (
                                <path fill="currentColor" key={p} d={p} />
                            ))}
                        </svg>
                    </button>
                </div>
            </div>
        );
    }
    return (
        <div className="navigation-panel">
            <div className="navigation-buttons">
                <div className={`active-backdrop ${activeSection}`}></div>
                <div className="navigation-button-container split navigation-button-genome">
                    <button
                        className={`navigation-button split-left ${activeSection === 'genome' ? 'active' : ''}`}
                        tabIndex={1}
                        onClick={() => {
                            setTimeout(
                                () =>
                                    document.getElementById('gosling-panel')?.scrollTo({ top: 0, behavior: 'smooth' }),
                                0
                            );
                        }}
                    >
                        <div className="navigation-button-content">
                            <svg className="section-icon" viewBox={ICONS.GENOME_VIEW.viewBox}>
                                {ICONS.GENOME_VIEW.path.map(p => (
                                    <path fill="currentColor" fillRule="evenodd" key={p} d={p} />
                                ))}
                            </svg>
                            <span>Genome</span>
                        </div>
                    </button>
                </div>
                <div className="navigation-button-container split navigation-button-variant">
                    <button
                        className={`navigation-button split-left ${activeSection === 'variant' ? 'active' : ''}`}
                        tabIndex={1}
                        onClick={() => {
                            setTimeout(() => {
                                document.getElementById('variant-view')?.scrollIntoView({
                                    block: 'start',
                                    inline: 'nearest',
                                    behavior: 'smooth'
                                }),
                                    0;
                            });
                        }}
                    >
                        <div className="navigation-button-content">
                            <svg className="section-icon" viewBox={ICONS.VARIANT_VIEW.viewBox}>
                                {ICONS.VARIANT_VIEW.path.map(p => (
                                    <path fill="currentColor" fillRule="evenodd" key={p} d={p} />
                                ))}
                            </svg>
                            <span>Variant</span>
                        </div>
                    </button>
                </div>
                <div className="navigation-button-container split navigation-button-read">
                    <button
                        className={`navigation-button split-left${activeSection === 'read' ? ' active' : ''}${
                            selectedSvId === '' ? '' : ' svSelected'
                        }`}
                        disabled={selectedSvId === ''}
                        data-bs-toggle={selectedSvId === '' ? 'tooltip' : ''}
                        data-bs-placement="right"
                        data-bs-title="Select a Structural Variant in the Genome or Variant Views to activate the Read View"
                        tabIndex={1}
                        onClick={() => {
                            setTimeout(() => {
                                document.getElementById('track-tooltip-coverage')?.scrollIntoView({
                                    block: 'start',
                                    inline: 'nearest',
                                    behavior: 'smooth'
                                }),
                                    0;
                            });
                        }}
                    >
                        <div className="navigation-button-content">
                            <svg className="section-icon" viewBox={ICONS.READ_VIEW.viewBox}>
                                {ICONS.READ_VIEW.path.map(p => (
                                    <path fill="currentColor" fillRule="evenodd" key={p} d={p} />
                                ))}
                            </svg>
                            <span>Read</span>
                        </div>
                    </button>
                </div>
            </div>
            <div className="help-button-container">
                <button
                    className="help-button"
                    tabIndex={1}
                    data-bs-toggle="modal"
                    data-bs-target="#instructions-modal"
                >
                    <svg className="help-button-icon" viewBox={ICONS.QUESTION_MARK.viewBox}>
                        {ICONS.QUESTION_MARK.path.map(p => (
                            <path fill="currentColor" fillRule="evenodd" key={p} d={p} />
                        ))}
                    </svg>
                </button>
            </div>
        </div>
    );
};
