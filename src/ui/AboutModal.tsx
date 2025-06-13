import React from 'react';

type AboutModalProps = {
    showAbout: boolean;
    setShowAbout: (showAbout: boolean) => void;
};

export const AboutModal = ({ showAbout, setShowAbout }: AboutModalProps) => {
    const hidiveLabRef = (
        <>
            {' ('}
            <a href="http://gehlenborglab.org/" target="_blank" rel="noreferrer">
                HiDIVE Lab
            </a>
            {')'}
        </>
    );
    const parkLabRef = (
        <>
            {' ('}
            <a href="https://compbio.hms.harvard.edu/" target="_blank" rel="noreferrer">
                Park Lab
            </a>
            {')'}
        </>
    );
    return (
        <div className={showAbout ? 'about-modal' : 'about-modal-hidden'}>
            <button className="about-modal-close-button" onClick={() => setShowAbout(false)}>
                <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="30"
                    height="30"
                    viewBox="0 0 16 16"
                    strokeWidth="2"
                    stroke="none"
                    fill="currentColor"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                >
                    <path d="M4.646 4.646a.5.5 0 0 1 .708 0L8 7.293l2.646-2.647a.5.5 0 0 1 .708.708L8.707 8l2.647 2.646a.5.5 0 0 1-.708.708L8 8.707l-2.646 2.647a.5.5 0 0 1-.708-.708L7.293 8 4.646 5.354a.5.5 0 0 1 0-.708z"></path>
                </svg>
            </button>
            <p>
                <b>Chromoscope</b>
                <span className="dimed">{' | '}</span>About
            </p>

            <p>
                Whole genome sequencing is now routinely used to profile mutations in DNA in the soma and in the
                germline, informing molecular diagnoses of disease and therapeutic decisions. Structural variants (SVs)
                are the main new type of alterations we see more of, and they are often diagnostic, prognostic, or
                therapy-informing. However, the size and complexity of SV data, combined with the difficulty of
                obtaining accurate SV calls, pose challenges in the interpretation of SVs, requiring tedious visual
                inspection of potentially pathogenic variants with multiple visualization tools.
            </p>

            <p>
                To overcome the problems with the interpretation of SVs, we developed Chromoscope, an open-source
                web-based application for the interactive visualization of structural variants. Chromoscope has several
                innovative features which unlock the insights from whole genome sequencing: visualization at multiple
                scale levels simultaneously, effective navigation across scales, easy setup for loading users&apos;
                large datasets, and a feature to export, share, and further customize visualizations. We anticipate that
                Chromoscope will accelerate the exploration and interpretation of SVs by a broad range of scientists and
                clinicians, leading to new insights into genomic biomarkers.
            </p>
            <h4>Learn more about Chromoscope</h4>
            <ul>
                <li>
                    <b>GitHub:</b>{' '}
                    <a href="https://github.com/hms-dbmi/chromoscope" target="_blank" rel="noreferrer">
                        https://github.com/hms-dbmi/chromoscope
                    </a>
                </li>
                <li>
                    <b>Documentation:</b>{' '}
                    <a href="https://chromoscope.bio/" target="_blank" rel="noreferrer">
                        https://chromoscope.bio/
                    </a>
                </li>
                <li>
                    <b>Preprint:</b>{' '}
                    <a href="https://osf.io/pyqrx/" target="_blank" rel="noreferrer">
                        L&apos;Yi et al. Chromoscope: interactive multiscale visualization for structural variation in
                        human genomes, OSF, 2023.
                    </a>
                </li>
            </ul>
            <h4>The Team</h4>
            <ul>
                <li>
                    <b>Sehi L&apos;Yi</b>
                    {hidiveLabRef}
                </li>
                <li>
                    <b>Dominika Maziec</b>
                    {parkLabRef}
                </li>
                <li>
                    <b>Victoria Stevens</b>
                    {parkLabRef}
                </li>
                <li>
                    <b>Trevor Manz</b>
                    {hidiveLabRef}
                </li>
                <li>
                    <b>Alexander Veit</b>
                    {parkLabRef}
                </li>
                <li>
                    <b>Michele Berselli</b>
                    {parkLabRef}
                </li>
                <li>
                    <b>Peter J Park</b>
                    {parkLabRef}
                </li>
                <li>
                    <b>Dominik Glodzik</b>
                    {parkLabRef}
                </li>
                <li>
                    <b>Nils Gehlenborg</b>
                    {hidiveLabRef}
                </li>
            </ul>
            <div className="about-modal-footer">
                <a href="https://dbmi.hms.harvard.edu/" target="_blank" rel="noreferrer">
                    Department of Biomedical Informatics, Harvard Medical School
                </a>
            </div>
        </div>
    );
};
