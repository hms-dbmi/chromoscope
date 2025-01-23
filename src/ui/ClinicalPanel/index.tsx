import React, { useState, useEffect } from 'react';

import { ICONS } from '../../icon';

export type DataRowProps = {
    label?: string;
    value?: string;
    cDNA?: string;
    chr?: string;
    gene?: string;
    position?: string;
    type?: string;
    count?: string;
    hrDetect?: boolean;
    handleClick?: () => void;
};

export type ClinicalInfo = {
    summary: SummaryItem[];
    variants: VariantItem[];
    signatures: SignatureItem[];
};

export type SummaryItem = {
    label: string;
    value: string;
};

export type VariantItem = {
    gene: string;
    type?: string; // if we know all the possible types, we can narrow down further, i.e., type: "Germline" | "homozygous loss" | ...;
    cDNA?: string;
    chr: string;
    start: string | number;
    end: string | number;
    position: string | number;
    handleClick?: () => void;
};

export type SignatureItem = {
    type: string; // if we know all the possible types, we can narrow down further, i.e., type: "indels" | "point_mutations" | ...;
    count: string | number;
    label: string;
    hrDetect: boolean;
};

// Data row with label and value
const DataRow = ({ handleClick, label, value }: DataRowProps) => {
    let formattedLabel = label;

    // Format label to be capitalized if string
    if (label && typeof label === 'string') {
        formattedLabel = label.charAt(0).toUpperCase() + label.slice(1);
    }

    return (
        <li
            className={`data-row ${handleClick ? 'clickable' : ''}`}
            onClick={handleClick ? () => handleClick() : null}
            role={handleClick ? 'button' : ''}
        >
            {label ? <span className="data-label">{formattedLabel}</span> : null}
            <span className="data-value">{value}</span>
        </li>
    );
};

type ToggleRowGroupProps = {
    header: string;
    callout?: string;
    data: DataRowProps[];
};

// Group of rows with a toggle-able header
const ToggleRowGroup = ({ callout = null, header, data }: ToggleRowGroupProps) => {
    const [isExpanded, setIsExpanded] = useState(false);

    return (
        <div className={`dropdown-row ${isExpanded ? 'expanded' : 'collapsed'} ${data.length === 0 ? 'disabled' : ''}`}>
            <button className="header toggle" onClick={() => setIsExpanded(!isExpanded)}>
                <h4>{header}</h4>
                <div className="toggle">
                    <svg className="panel-icon-arrow" viewBox={ICONS.TRIANGLE_DOWN.viewBox}>
                        <title>TRIANGLE DOWN</title>
                        <path fill="currentColor" d={ICONS.TRIANGLE_DOWN.path[0]} />
                    </svg>
                </div>
            </button>
            {callout && (
                <div className="callout">
                    <div className="content">
                        <svg className="panel-icon-arrow" viewBox={ICONS.INFO_CIRCLE.viewBox}>
                            <title>INFO CIRCLE</title>
                            {ICONS.INFO_CIRCLE.path.map(p => (
                                <path fill="currentColor" key={p} d={p} />
                            ))}
                        </svg>
                        <span>{callout}</span>
                    </div>
                </div>
            )}
            <div className="body">
                <ul className="data-list">
                    {data.map((row: DataRowProps, i: number) => {
                        return <DataRow key={i} label={row.label} value={row.value} />;
                    })}
                </ul>
            </div>
        </div>
    );
};

type PanelSectionProps = {
    data: DataRowProps[];
    callout?: string;
    handleZoomToGene?: (gene: string) => void;
};

// Panel section for Clinical Summary data
const ClinicalSummary = ({ data, callout = null }: PanelSectionProps) => {
    const [isExpanded, setIsExpanded] = useState(true);

    return (
        <div className={`summary panel-section ${isExpanded ? 'expanded' : 'collapsed'}`}>
            <button onClick={() => setIsExpanded(!isExpanded)} className="section-header">
                <h3>Clinical Summary</h3>
                <div className="section-toggle">
                    <svg className="panel-icon-arrow" viewBox={ICONS.TRIANGLE_DOWN.viewBox}>
                        <title>TRIANGLE DOWN</title>
                        <path fill="currentColor" d={ICONS.TRIANGLE_DOWN.path[0]} />
                    </svg>
                </div>
            </button>
            <div tabIndex={isExpanded ? 0 : -1} className="section-body">
                {callout && (
                    <div className="callout">
                        <div className="content">
                            <span>{callout}</span>
                        </div>
                    </div>
                )}
                <ul className="data-list">
                    {data.map((row: DataRowProps, i: number) => {
                        return <DataRow key={i} label={row.label} value={row.value} />;
                    })}
                </ul>
            </div>
        </div>
    );
};

// Panel section for Clinically Relevant Variants data
const ClinicallyRelevantVariants = ({ handleZoomToGene, data }: PanelSectionProps) => {
    const [isExpanded, setIsExpanded] = useState(true);

    return (
        <div className={`variants panel-section ${isExpanded ? 'expanded' : 'collapsed'}`}>
            <button onClick={() => setIsExpanded(!isExpanded)} className="section-header">
                <h3>Clinically-relevant Variants</h3>
                <div className="section-toggle">
                    <svg className="panel-icon-arrow" viewBox={ICONS.TRIANGLE_DOWN.viewBox}>
                        <title>TRIANGLE DOWN</title>
                        <path fill="currentColor" d={ICONS.TRIANGLE_DOWN.path[0]} />
                    </svg>
                </div>
            </button>
            <div tabIndex={isExpanded ? 0 : -1} className="section-body">
                <div className="callout">
                    <div className="content">
                        <svg className="panel-icon-arrow" viewBox={ICONS.INFO_CIRCLE.viewBox}>
                            <title>INFO CIRCLE</title>
                            {ICONS.INFO_CIRCLE.path.map(p => (
                                <path fill="currentColor" key={p} d={p} />
                            ))}
                        </svg>
                        <span>Click to show in the visualization</span>
                    </div>
                </div>
                <ul className="data-list">
                    {data.map((row: DataRowProps, i: number) => {
                        const gene = row?.gene ?? '';
                        const type = row?.type ?? '';
                        const cDNA = row?.cDNA ?? '';
                        const variantString = gene + ' ' + type + ' ' + cDNA;

                        const handleClick = () => {
                            handleZoomToGene(gene);
                        };

                        return <DataRow handleClick={handleClick} key={i} label={null} value={variantString} />;
                    })}
                </ul>
            </div>
        </div>
    );
};

// Panel section for Mutational Signatures data
const MutationalSignatures = ({ data }: PanelSectionProps) => {
    const [isExpanded, setIsExpanded] = useState(true);

    // Check if HRDetect is positive
    const isHrDetect = data.some((row: DataRowProps) => row.hrDetect);

    // Split data into HRDetect and other data
    const hrDetectData = [];
    const otherData = [];

    data.forEach((row: DataRowProps) => {
        const formattedData = {
            label: row.count,
            value: row.label
        };

        if (row.hrDetect) {
            hrDetectData.push(formattedData);
        } else {
            otherData.push(formattedData);
        }
    });

    return (
        <div className={`signatures panel-section ${isExpanded ? 'expanded' : 'collapsed'}`}>
            <button onClick={() => setIsExpanded(!isExpanded)} className="section-header">
                <h3>Mutational Signatures</h3>
                <div className="section-toggle">
                    <svg className="panel-icon-arrow" viewBox={ICONS.TRIANGLE_DOWN.viewBox}>
                        <title>TRIANGLE DOWN</title>
                        <path fill="currentColor" d={ICONS.TRIANGLE_DOWN.path[0]} />
                    </svg>
                </div>
            </button>
            <div className="callout hrdetect">
                <span className="label">HRDetect</span>
                <div className="value">
                    <svg
                        className={`circle-icon ${isHrDetect ? 'positive' : 'negative'}`}
                        viewBox={ICONS.CIRCLE.viewBox}
                    >
                        <title>CIRCLE</title>
                        <path fill="currentColor" d={ICONS.CIRCLE.path[0]} />
                    </svg>
                    <span>{isHrDetect ? 'Positive' : 'Negative'}</span>
                </div>
            </div>
            <div tabIndex={isExpanded ? 0 : -1} className="section-body">
                <ToggleRowGroup
                    // callout={'Click to show in the visualization'}
                    header={'HRD-related Features Found'}
                    data={hrDetectData}
                />
                <ToggleRowGroup header={'Other Features Found'} data={otherData} />
            </div>
        </div>
    );
};

type ClinicalPanelProps = {
    demo: any;
    gosRef: any;
    filteredSamples: any;
    isClinicalPanelOpen: boolean;
    hasClinicalInfo: boolean;
    setInteractiveMode: (interactiveMode: boolean) => void;
    setIsClinicalPanelOpen: (isClinicalPanelOpen: boolean) => void;
};

export const ClinicalPanel = ({
    hasClinicalInfo,
    demo,
    gosRef,
    isClinicalPanelOpen,
    setInteractiveMode,
    setIsClinicalPanelOpen
}: ClinicalPanelProps) => {
    const { clinicalInfo: clinicalInformation, cancer } = demo;

    // Format cancer label to add as callout
    const formattedCancerLabel = cancer
        ? cancer
              .split(' ')
              .map((s: string) => s.charAt(0).toUpperCase() + s.slice(1))
              .join(' ')
        : null;

    const handleZoomToGene = (gene: string) => {
        setInteractiveMode(true);
        setTimeout(() => {
            document.getElementById('variant-view')?.scrollIntoView({
                block: 'start',
                inline: 'nearest',
                behavior: 'smooth'
            }),
                0;
        });

        gosRef.current.api.zoomToGene(`${demo.id}-mid-ideogram`, `${gene}`, 1000);
    };

    return (
        <div
            className={`clinical-panel-container ${isClinicalPanelOpen ? 'open' : 'closed'} ${
                hasClinicalInfo && clinicalInformation ? '' : 'disabled'
            }`}
        >
            <div className={`clinical-panel`}>
                <div className="panel-header">
                    <svg className="panel-icon" viewBox={ICONS.CLIPBOARD.viewBox}>
                        <title>Clipboard</title>
                        <path fill="currentColor" d={ICONS.CLIPBOARD.path[0]} />
                    </svg>
                    <h2>Genome Interpretation</h2>
                    <button className="collapse-panel" onClick={() => setIsClinicalPanelOpen(!isClinicalPanelOpen)}>
                        <svg className="panel-icon-arrow" viewBox={ICONS.ARROW_RIGHT.viewBox}>
                            <title>ARROW RIGHT</title>
                            <path fill="currentColor" d={ICONS.ARROW_RIGHT.path[0]} />
                        </svg>
                    </button>
                </div>

                {hasClinicalInfo && clinicalInformation ? (
                    <div className="content">
                        <ClinicalSummary data={clinicalInformation?.summary ?? []} callout={formattedCancerLabel} />
                        <ClinicallyRelevantVariants
                            handleZoomToGene={handleZoomToGene}
                            data={clinicalInformation?.variants ?? []}
                        />
                        <MutationalSignatures data={clinicalInformation?.signatures ?? []} />
                    </div>
                ) : null}
            </div>
        </div>
    );
};
