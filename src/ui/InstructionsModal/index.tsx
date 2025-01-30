import React from 'react';

import { GenomeViewModalContent } from '../GenomeViewModal';
import { VariantViewModalContent } from '../VariantViewModal';

import { ICONS } from '../../icon';

type InstructionsModalBodyProps = {
    activeTab: string;
};
export const InstructionsModalBody = ({ activeTab }: InstructionsModalBodyProps) => {
    return (
        <div className="instructions-modal-body">
            <div className="header">
                <h1 className="modal-title fs-5" id="exampleModalLabel">
                    Instructions
                </h1>
                <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
            </div>
            {activeTab === 'genome' ? (
                <GenomeViewModalContent />
            ) : activeTab === 'variant' ? (
                <VariantViewModalContent />
            ) : null}
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
        <a className="modal-navigation-link" href={`#${link}`} onClick={() => setActiveTab(link)}>
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
    const [activeTab, setActiveTab] = React.useState('genome');
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
