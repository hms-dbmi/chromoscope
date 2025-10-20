import React, { MutableRefObject } from 'react';

import { ICONS } from '../icon';
import { ExportButton } from './ExportDropdown';
import { SampleType } from '../data/samples';

type NavigationBarProps = {
    demo: SampleType;
    demoIndex: MutableRefObject<number>;
    showSmallMultiples: boolean;
    gosRef: React.RefObject<any>;
    currentSpec: MutableRefObject<string>;
    externalUrl: string;
    externalDemoUrl: MutableRefObject<string>;
    FEEDBACK_EMAIL_ADDRESS: string;
    showSamples: boolean;
    isChrome: () => boolean;
    setShowAbout: (show: boolean) => void;
    setShowSamples: (show: boolean) => void;
    getHtmlTemplate: (spec: string) => string;
};

export const NavigationBar = ({
    demo,
    demoIndex,
    showSmallMultiples,
    gosRef,
    currentSpec,
    externalUrl,
    externalDemoUrl,
    FEEDBACK_EMAIL_ADDRESS,
    showSamples,
    isChrome,
    setShowAbout,
    setShowSamples,
    getHtmlTemplate
}: NavigationBarProps) => {
    return (
        <div className="navigation-container">
            <div className="title links-left">
                <button
                    className="config-button"
                    tabIndex={showSamples ? -1 : 0}
                    onClick={() => {
                        setShowSamples(true);
                    }}
                >
                    <svg viewBox={ICONS.MENU.viewBox} visibility={showSmallMultiples ? 'visible' : 'collapse'}>
                        <title>Menu</title>
                        <path fill="currentColor" d={ICONS.MENU.path[0]} />
                    </svg>
                </button>
                <div className="sample-information">
                    <a className="chromoscope-title" href="./" tabIndex={showSamples ? -1 : 0}>
                        CHROMOSCOPE
                    </a>
                    <a
                        tabIndex={showSamples ? -1 : 0}
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
                    <span className="dimed">{' | '}</span>
                    {/* {demo.cancer.charAt(0).toUpperCase() + demo.cancer.slice(1) + ' • ' + demo.id} */}
                    <span>{demo.cancer.charAt(0).toUpperCase() + demo.cancer.slice(1)}</span>
                    <small>{demo.id}</small>

                    <ul className="nav-list">
                        <li className="nav-list-item">
                            <button
                                tabIndex={showSamples ? -1 : 0}
                                className="title-btn png"
                                onClick={e => {
                                    e.stopPropagation();
                                    gosRef.current?.api.exportPng();
                                }}
                            >
                                <ExportButton title="Export PNG" icon="PNG" />
                            </button>
                        </li>

                        <li className="nav-list-item">
                            <a
                                className="title-btn"
                                tabIndex={showSamples ? -1 : 0}
                                href={`data:text/plain;charset=utf-8,${encodeURIComponent(
                                    getHtmlTemplate(currentSpec.current)
                                )}`}
                                download="visualization.html"
                                onClick={e => {
                                    e.stopPropagation();
                                }}
                            >
                                <ExportButton title="Export HTML" icon="HTML" />
                            </a>
                        </li>
                        <li className="nav-list-item">
                            <a
                                className="title-btn"
                                tabIndex={showSamples ? -1 : 0}
                                href={`data:text/plain;charset=utf-8,${encodeURIComponent(currentSpec.current)}`}
                                download="visualization.json"
                                onClick={e => {
                                    e.stopPropagation();
                                }}
                            >
                                <ExportButton title="Export JSON" icon="JSON" />
                            </a>
                        </li>
                        <li className="nav-list-item">
                            <button
                                className="title-btn clipboard"
                                tabIndex={showSamples ? -1 : 0}
                                onClick={() => {
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
                                        navigator.clipboard
                                            .writeText(newUrl)
                                            .then(() =>
                                                alert(
                                                    'The URL of the current session has been copied to your clipboard.'
                                                )
                                            );
                                    }
                                }}
                            >
                                <svg className="button" viewBox="0 0 16 16">
                                    <title>Export Link</title>
                                    <path d="M4.715 6.542 3.343 7.914a3 3 0 1 0 4.243 4.243l1.828-1.829A3 3 0 0 0 8.586 5.5L8 6.086a1.002 1.002 0 0 0-.154.199 2 2 0 0 1 .861 3.337L6.88 11.45a2 2 0 1 1-2.83-2.83l.793-.792a4.018 4.018 0 0 1-.128-1.287z" />
                                    <path d="M6.586 4.672A3 3 0 0 0 7.414 9.5l.775-.776a2 2 0 0 1-.896-3.346L9.12 3.55a2 2 0 1 1 2.83 2.83l-.793.792c.112.42.155.855.128 1.287l1.372-1.372a3 3 0 1 0-4.243-4.243L6.586 4.672z" />
                                </svg>
                            </button>
                        </li>
                    </ul>
                </div>
                {!isChrome() ? (
                    <a
                        style={{
                            marginLeft: '200px',
                            color: '#E6A01B',
                            fontWeight: 'bold',
                            textDecoration: 'none'
                        }}
                        href="https://www.google.com/chrome/downloads/"
                    >
                        ⚠️ Chromoscope is optimized for Google Chrome
                    </a>
                ) : null}
            </div>
            <div className="navigation-links-container links-right">
                <a
                    className="title-github-link"
                    href="https://github.com/hms-dbmi/chromoscope"
                    target="_blank"
                    rel="noreferrer"
                    tabIndex={showSamples ? -1 : 0}
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
                    tabIndex={showSamples ? -1 : 0}
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
                        tabIndex={showSamples ? -1 : 0}
                    >
                        <svg className="button" viewBox={ICONS.MAIL.viewBox}>
                            <title>Mail</title>
                            <path fill="currentColor" d={ICONS.MAIL.path[0]} />
                        </svg>
                        <span>Feedback</span>
                    </a>
                </div>
            </div>
        </div>
    );
};
