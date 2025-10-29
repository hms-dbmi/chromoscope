import React, { useEffect, useRef, useState } from 'react';
import { ICONS } from '../../icon';
import { samples } from '../../data/samples';
import { Cohorts, Cohort } from '../../App';

type CohortSelectorProps = {
    cohorts: Cohorts;
    selectedCohort: string | null;
    setCohorts: (cohorts: Cohorts) => void;
    setSelectedCohort: (cohort: string) => void;
    setFilteredSamples: (samples: Array<any>) => void;
};

export const CohortSelector = ({
    cohorts,
    setCohorts,
    selectedCohort,
    setSelectedCohort,
    setFilteredSamples
}: CohortSelectorProps) => {
    const [showDropdown, setShowDropdown] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const dropdownRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        if (!cohorts?.['MSK SPECTRUM']) {
            setIsLoading(true);
            fetch(
                'https://genomebrowser-uploads.hms.harvard.edu/data/dg204/SPECTRUM/SPECTRUM_config_with_clinicalInfo_sorted_v4.json'
            )
                .then(res => {
                    return res.json();
                })
                .then(data => {
                    if (data?.name && data?.samples?.length > 0) {
                        setCohorts({
                            ...cohorts,
                            'MSK SPECTRUM': data
                        });
                    }
                })
                .finally(() => {
                    setIsLoading(false);
                })
                .catch(() => {
                    console.error('Failed to fetch MSK cohort data');
                    setIsLoading(false);
                });
        }

        // Close dropdown on outside click
        const handleClickOutside = (event: MouseEvent) => {
            const clickedOutside = !dropdownRef.current || !dropdownRef.current.contains(event.target as Node);
            if (clickedOutside) {
                setShowDropdown(false);
            }
        };

        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    return (
        <div className="dropdown-container cohort-selector" ref={dropdownRef}>
            <button
                className={`dropdown-button ${showDropdown ? 'toggle-open' : ''}`}
                onClick={e => setShowDropdown(!showDropdown)}
            >
                <span className="">{cohorts[selectedCohort]?.name}</span>
                <svg className="icon" viewBox={ICONS.CHEVRON_UP.viewBox}>
                    <title>{showDropdown ? 'Chevron Up' : 'Chevron Down'}</title>
                    {ICONS.CHEVRON_UP.path.map(p => (
                        <path fill="currentColor" key={p} d={p} />
                    ))}
                </svg>
            </button>
            <ul className={`dropdown-items ${showDropdown ? 'd-flex' : 'd-none'}`}>
                {Object.keys(cohorts).map((cohort, index) => {
                    const cohortData = cohorts[cohort];
                    return (
                        <li
                            key={index}
                            className={`dropdown-item ${cohort === selectedCohort ? 'selected' : ''}`}
                            onClick={() => {
                                setSelectedCohort(cohort);
                                setFilteredSamples(cohortData?.samples);
                                showDropdown && setShowDropdown(false);
                            }}
                        >
                            {cohortData.name}
                        </li>
                    );
                })}
            </ul>
        </div>
    );
};
