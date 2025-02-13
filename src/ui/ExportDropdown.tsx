import React, { useState } from 'react';
import { ICONS } from '../icon';
import { getHtmlTemplate } from '../html-template';

type ExportButtonProps = {
    title: string;
    icon: string;
};

export const ExportButton = ({ title, icon }: ExportButtonProps) => {
    return (
        <svg className="button" viewBox="0 0 16 16">
            <title>{title}</title>
            {ICONS[icon].path.map(p => (
                <path fill="currentColor" key={p} d={p} />
            ))}
        </svg>
    );
};

type ExportDropdownProps = {
    gosRef: React.RefObject<any>;
    currentSpec: React.MutableRefObject<string>;
};

export const ExportDropdown = ({ gosRef, currentSpec }: ExportDropdownProps) => {
    const [isOpen, setIsOpen] = useState(false);

    return (
        <div
            className={'export-dropdown' + (isOpen ? ' open' : ' closed')}
            onClick={() => setIsOpen(!isOpen)}
            aria-expanded={isOpen}
        >
            <button className="export-button">
                <span className="export-title">Export</span>
                <svg className="button triangle-down" viewBox={ICONS.TRIANGLE_DOWN.viewBox}>
                    <title>Triangle Down</title>
                    {ICONS.TRIANGLE_DOWN.path.map(p => (
                        <path fill="currentColor" key={p} d={p} />
                    ))}
                </svg>
            </button>
            {isOpen ? (
                <nav className="export-options">
                    <ul className="nav-list">
                        <li className="nav-list-item">
                            <button
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
                                href={`data:text/plain;charset=utf-8,${encodeURIComponent(currentSpec.current)}`}
                                download="visualization.json"
                                onClick={e => {
                                    e.stopPropagation();
                                }}
                            >
                                <ExportButton title="Export JSON" icon="JSON" />
                            </a>
                        </li>
                    </ul>
                </nav>
            ) : null}
        </div>
    );
};
