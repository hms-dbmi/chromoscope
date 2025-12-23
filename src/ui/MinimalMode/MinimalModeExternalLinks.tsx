import React from 'react';
import { ExportDropdown } from '../ExportDropdown';
import { ICONS } from '../../icon';
import { FEEDBACK_EMAIL_ADDRESS } from '../../constants';
import { SampleType } from '../../data/samples';

type MinimalModeExternalLinksProps = {
    gosRef: React.MutableRefObject<any>;
    demo: SampleType;
    demoIndex: React.MutableRefObject<number>;
    externalDemoUrl: React.MutableRefObject<string>;
    externalUrl?: string;
    currentSpec: any;
};

export const MinimalModeExternalLinks = ({
    gosRef,
    demo,
    demoIndex,
    externalDemoUrl,
    externalUrl,
    currentSpec
}: MinimalModeExternalLinksProps) => {
    return (
        <div className="external-links">
            <nav className="external-links-nav">
                <button
                    className="open-in-chromoscope-link link-button"
                    // tabIndex={2}
                    onClick={e => {
                        e.preventDefault();
                        const { xDomain } = gosRef.current.hgApi.api.getLocation(`${demo.id}-mid-ideogram`);
                        if (xDomain) {
                            // urlParams.set('demoIndex', demoIndex.current + '');
                            // urlParams.set('domain', xDomain.join('-'));
                            let newUrl = window.location.origin + window.location.pathname + '?';
                            newUrl += `demoIndex=${demoIndex.current}`;
                            newUrl += `&domain=${xDomain.join('-')}`;
                            if (externalDemoUrl.current) {
                                newUrl += `&external=${externalDemoUrl.current}`;
                            } else if (externalUrl) {
                                newUrl += `&external=${externalUrl}`;
                            }
                            window.open(newUrl, '_blank');
                        }
                    }}
                >
                    <div className="link-group">
                        <span>Open in Chromoscope</span>
                        <svg
                            className="external-link-icon"
                            width="12"
                            height="11"
                            viewBox="0 0 12 11"
                            fill="none"
                            xmlns="http://www.w3.org/2000/svg"
                        >
                            <path
                                d="M9.8212 1.73104L10.6894 0.875H9.47015H7.66727C7.55064 0.875 7.46966 0.784774 7.46966 0.6875C7.46966 0.590226 7.55064 0.5 7.66727 0.5H11.1553C11.2719 0.5 11.3529 0.590226 11.3529 0.6875V4.125C11.3529 4.22227 11.2719 4.3125 11.1553 4.3125C11.0387 4.3125 10.9577 4.22228 10.9577 4.125V2.34824V1.15307L10.1067 1.9922L5.71834 6.31907C5.71831 6.3191 5.71828 6.31913 5.71825 6.31916C5.64039 6.39579 5.51053 6.39576 5.43271 6.31907C5.35892 6.24635 5.35892 6.1308 5.43271 6.05808L5.4328 6.05799L9.8212 1.73104ZM1.19116 2.40625C1.19116 1.73964 1.74085 1.1875 2.43519 1.1875H4.87682C4.99345 1.1875 5.07443 1.27773 5.07443 1.375C5.07443 1.47227 4.99345 1.5625 4.87682 1.5625H2.43519C1.97411 1.5625 1.58638 1.93419 1.58638 2.40625V9.28125C1.58638 9.75331 1.97411 10.125 2.43519 10.125H9.41129C9.87237 10.125 10.2601 9.75331 10.2601 9.28125V6.875C10.2601 6.77773 10.3411 6.6875 10.4577 6.6875C10.5743 6.6875 10.6553 6.77773 10.6553 6.875V9.28125C10.6553 9.94786 10.1056 10.5 9.41129 10.5H2.43519C1.74085 10.5 1.19116 9.94786 1.19116 9.28125V2.40625Z"
                                fill="black"
                                stroke="black"
                            />
                        </svg>
                    </div>
                </button>
                <div className="button-group">
                    <div className="export-links">
                        <ExportDropdown gosRef={gosRef} currentSpec={currentSpec} />
                    </div>
                    <div className="feedback">
                        <a
                            href={`mailto:${FEEDBACK_EMAIL_ADDRESS}?subject=Chromoscope%20Feedback&body=Feedback%20Type%3A%20General%20Feedback%0D%0A%0D%0AComments%3A%0D%0A%0D%0A%0D%0A`}
                            className="link-button"
                        >
                            <svg className="button" viewBox={ICONS.MAIL.viewBox}>
                                <title>Mail</title>
                                <path fill="currentColor" d={ICONS.MAIL.path[0]} />
                            </svg>
                            <span>Feedback</span>
                        </a>
                    </div>
                </div>
            </nav>
        </div>
    );
};
