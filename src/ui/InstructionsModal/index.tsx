import React, { useState } from 'react';

import { GettingStartedModalContent } from '../GettingStartedModal';
import { GenomeViewModalContent } from '../GenomeViewModal';
import { VariantViewModalContent } from '../VariantViewModal';
import { ReadViewModalContent } from '../ReadViewModal';

import { ICONS } from '../../icon';

// Helper for rendering the instruction body based on the active tab
const renderInstructionBody = (activeTab: string) => {
    switch (activeTab) {
        case 'getting-started':
            return <GettingStartedModalContent />;
        case 'genome-view':
            return <GenomeViewModalContent />;
        case 'variant-view':
            return <VariantViewModalContent />;
        case 'read-view':
            return <ReadViewModalContent />;
        default:
            return null;
    }
};

type InstructionsModalBodyProps = {
    activeTab: string;
};
export const InstructionsModalBody = ({ activeTab }: InstructionsModalBodyProps) => {
    return (
        <div className="instructions-modal-body">
            <div className="header">
                <h1 className="modal-title fs-5" id="exampleModalLabel">
                    User Guide
                </h1>
                <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
            </div>
            {renderInstructionBody(activeTab)}
        </div>
    );
};

type InstructionsModalNavigationLinkProps = {
    activeTab: string;
    setActiveTab: (tab: string) => void;
    icon: string;
    link: string;
    title: string;
};

const InstructionsModalNavigationLink = ({
    icon,
    link,
    title,
    activeTab,
    setActiveTab
}: InstructionsModalNavigationLinkProps) => {
    return (
        <a className={`modal-navigation-link ${activeTab === link ? 'active' : ''}`} onClick={() => setActiveTab(link)}>
            <svg className="button" viewBox={ICONS[icon].viewBox} tabIndex={2}>
                <title>{title}</title>
                {ICONS[icon].path.map(p => (
                    <path fill="currentColor" fillRule="evenodd" key={p} d={p} />
                ))}
            </svg>
            <span>{title}</span>
        </a>
    );
};

type InstructrionsModalNavigationPanelProps = {
    activeTab: string;
    setActiveTab: (tab: string) => void;
};

const InstructrionsModalNavigationPanel = ({ activeTab, setActiveTab }: InstructrionsModalNavigationPanelProps) => {
    return (
        <div className="modal-navigation-panel">
            <div className="navigation-panel-icon">
                <svg className="help-button-icon" viewBox={ICONS.QUESTION_MARK.viewBox}>
                    {ICONS.QUESTION_MARK.path.map(p => (
                        <path fill="currentColor" fillRule="evenodd" key={p} d={p} />
                    ))}
                </svg>
            </div>
            <span className="modal-navigation-panel-title">USER GUIDES</span>
            <div className="modal-navigation-panel-links">
                <InstructionsModalNavigationLink
                    icon={'LOCATION_PIN'}
                    link={'getting-started'}
                    title={'Getting Started'}
                    activeTab={activeTab}
                    setActiveTab={setActiveTab}
                />
                <InstructionsModalNavigationLink
                    icon={'GENOME_VIEW'}
                    link={'genome-view'}
                    title={'Genome View'}
                    activeTab={activeTab}
                    setActiveTab={setActiveTab}
                />
                <InstructionsModalNavigationLink
                    icon={'VARIANT_VIEW'}
                    link={'variant-view'}
                    title={'Variant View'}
                    activeTab={activeTab}
                    setActiveTab={setActiveTab}
                />
                <InstructionsModalNavigationLink
                    icon={'READ_VIEW'}
                    link={'read-view'}
                    title={'Read View'}
                    activeTab={activeTab}
                    setActiveTab={setActiveTab}
                />
            </div>
        </div>
    );
};

export const InstructionsModal = () => {
    const [activeTab, setActiveTab] = useState('getting-started');

    return (
        <div
            className="modal fade"
            id="instructions-modal"
            tabIndex={-1}
            aria-labelledby="Instructions Modal"
            aria-hidden="true"
        >
            <div className="modal-dialog modal-xl">
                <div className="modal-content">
                    <div className="modal-body">
                        <InstructrionsModalNavigationPanel activeTab={activeTab} setActiveTab={setActiveTab} />
                        <InstructionsModalBody activeTab={activeTab} />
                    </div>
                </div>
            </div>
        </div>
    );
};
