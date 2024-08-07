import React from 'react';
import { ICONS } from '../icon';

export const NavigationButtons = () => {
    return (
        <div className="navigation-buttons">
            <div className="navigation-button-container split navigation-button-genome">
                <button
                    className="navigation-button split-left"
                    tabIndex={1}
                    onClick={() => {
                        setTimeout(
                            () => document.getElementById('gosling-panel')?.scrollTo({ top: 0, behavior: 'smooth' }),
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
};
