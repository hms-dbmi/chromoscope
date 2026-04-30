import React, { useState, useEffect, useMemo } from 'react';

import { ICONS } from '../../icon';
import { OverviewFilter } from './OverviewFilter';
import { SampleType } from '../../data/samples';
import { SmallOverviewWrapper } from '../SmallOverviewWrapper';
import { CohortSelector } from './CohortSelector';
import { Cohorts } from '../../App';
import { accessNestedField, getBinnedValues, getBinIndex } from '../../utils';
import { FilterStatusPanel } from './FilterStatusPanel';

/**
 * `Option` is used to define a filter option for the OverviewPanel. It
 * contains the type, field, and values of the filter option.
 * Also used to define `activeFilters`
 */
export type Primitive = string | number | boolean;

export type OptionValue = {
    start?: number;
    end?: number;
    value: Primitive;
    count?: number;
};
export type Option = {
    type: string;
    field: string;
    values: OptionValue[];
};

type FiltersMap = {
    [key: string]: Option;
};

export type ActiveFilters = {
    [key: string]: Primitive[];
};

type OverviewPanelProps = {
    demo: SampleType;
    demoIndex: React.MutableRefObject<number>;
    externalDemoUrl: React.MutableRefObject<string>;
    filteredSamples: Array<any>;
    selectedCohort: string;
    cohorts: Cohorts;
    externalError: string;
    setCohorts: (cohorts: Cohorts) => void;
    setShowSamples: (showSamples: boolean) => void;
    setSelectedCohort: (cohort: string) => void;
    setFilteredSamples: (samples: Array<any>) => void;
    handleDemoChange: (demo: SampleType) => void;
};

export const OverviewPanel = ({
    demo,
    demoIndex,
    filteredSamples,
    selectedCohort,
    cohorts,
    externalError,
    setCohorts,
    setShowSamples,
    setSelectedCohort,
    setFilteredSamples,
    handleDemoChange
}: OverviewPanelProps) => {
    const [activeFilters, setActiveFilters] = useState<ActiveFilters>({});
    const [showExternalDemoAlert, setShowExternalDemoAlert] = useState<boolean>(true);
    const [showNonMatches, setShowNonMatches] = useState<boolean>(false);

    // Get all samples
    const allSamples = cohorts[selectedCohort]?.samples || [];

    // Get filters for the selected cohort
    const cohortFiltersObject = cohorts?.[selectedCohort]?.filters || {};
    const filterIdentifiers: string[] = Object.keys(cohortFiltersObject);

    // Create variable to store inverted filters
    const invertedSamples = cohorts[selectedCohort]?.samples?.filter(
        (sample: SampleType) => !filteredSamples.includes(sample)
    );

    // Compute filter options based on cohort filters
    // Update when: cohorts or selectedCohort changes
    const filterValuesMap = useMemo(() => {
        // Return if no filters are defined
        if (filterIdentifiers.length === 0) {
            return;
        }

        const filtersMap: FiltersMap = {};

        // Extract the options from the filters property of the configuration
        filterIdentifiers.map((filterIdentifier: string, i: number) => {
            const { field, title, type } = cohortFiltersObject?.[filterIdentifier];

            const valuesMap = new Map<string | number | boolean, number>();

            // Check each sample for all possible entries
            cohorts[selectedCohort]?.samples.forEach((sample: any) => {
                //  Get nested field value
                const nestedFieldValue = accessNestedField(sample, field);

                if (nestedFieldValue !== null && nestedFieldValue !== undefined) {
                    // add value to the map with count
                    if (valuesMap.has(nestedFieldValue)) {
                        valuesMap.set(nestedFieldValue, valuesMap.get(nestedFieldValue) + 1);
                    } else {
                        valuesMap.set(nestedFieldValue, 1);
                    }
                }
            });

            let transformedValues: OptionValue[] = [...valuesMap].map(([value, count]) => ({ value, count }));
            if (type === 'continuous') {
                transformedValues = getBinnedValues(transformedValues);
            }

            filtersMap[filterIdentifier] = {
                type,
                field,
                values: transformedValues
            };
        });

        return filtersMap;
    }, [cohorts, selectedCohort]);

    /**
     * Filters `prevSamples` based on `activeFilters`
     * @param prevSamples - samples to filter
     * @param activeFilters - active filters
     * @returns filtered samples
     */
    const getFilteredSamples = (prevSamples: SampleType[], activeFilters: ActiveFilters) => {
        return prevSamples.filter((sample: any) => {
            return Object.entries(activeFilters).every(([identifier, acceptedValues]) => {
                if (acceptedValues.length === 0) return true;

                const filterField = cohorts[selectedCohort]?.filters?.[identifier]?.field;
                let sampleValue = accessNestedField(sample, filterField);

                // Continuous values have bins to compare against
                if (filterValuesMap[identifier]?.type === 'continuous') {
                    // Typecast to Number if necessary
                    const number = Number(sampleValue);
                    // Check if `sampleValue` is between one of the bins
                    const bins = filterValuesMap[identifier].values;
                    const binIndex = getBinIndex(number, bins);
                    sampleValue = bins[binIndex].value;
                }
                return acceptedValues.includes(sampleValue);
            });
        });
    };

    /**
     * Create a subset for each filter, giving the samples that are currently
     * shown based on the active filters except for that filter. Used to count
     * the number of samples that would be added/removed if a filter option is
     * selected/deselected
     */
    const baseSubsets = useMemo(() => {
        if (!filterValuesMap) return {};

        const result: Record<string, SampleType[]> = {};

        Object.keys(cohortFiltersObject).forEach(filterIdentifier => {
            // Clone active filters
            const activeFiltersWithoutSelf: ActiveFilters = { ...activeFilters };

            // Remove current filter entirely
            delete activeFiltersWithoutSelf[filterIdentifier];

            // Apply remaining filters
            result[filterIdentifier] = getFilteredSamples(allSamples, activeFiltersWithoutSelf);
        });

        return result;
    }, [allSamples, activeFilters, filterValuesMap, cohortFiltersObject]);

    // Get counts for each option by filtering base subset on onlythat option
    const optionCounts = useMemo(() => {
        if (!filterValuesMap) return {};

        const counts: Record<string, Record<string, number>> = {};

        Object.keys(filterValuesMap).forEach(filterId => {
            counts[filterId] = {};

            // Get base subset
            const base = baseSubsets[filterId] || [];
            const currentValues = activeFilters[filterId] || [];

            filterValuesMap[filterId].values.forEach(option => {
                const value = option.value;
                let newValues: Primitive[];

                if (currentValues.includes(value)) {
                    // simulate unchecking the option
                    newValues = currentValues.filter(v => v !== value);
                } else {
                    // simulate checking the option
                    newValues = [...currentValues, value];
                }

                let result: SampleType[];

                if (newValues.length === 0) {
                    result = base;
                } else {
                    result = getFilteredSamples(base, {
                        [filterId]: newValues
                    });
                }

                counts[filterId][value as string] = result.length;
            });
        });

        return counts;
    }, [allSamples, activeFilters, filterValuesMap, cohortFiltersObject]);

    /**
     * Adds an option to an existing active filter or removes it if it exists
     * @param filterIdentifier - identifier of the filter
     * @param value - value of the option
     * @returns updated activeFilters object
     */
    const getUpdatedActiveFilters = (filterIdentifier: string, value: Primitive) => {
        const currentValues = activeFilters[filterIdentifier] || [];

        // Check if `value` already exist in the filter
        const updatedValues = currentValues.includes(value)
            ? currentValues.filter(v => v !== value)
            : [...currentValues, value];

        // Copy activeFilters
        const updatedActiveFilters = { ...activeFilters };

        // Remove filter if all values are removed
        if (updatedValues.length === 0) {
            delete updatedActiveFilters[filterIdentifier];
        } else {
            updatedActiveFilters[filterIdentifier] = updatedValues;
        }

        return updatedActiveFilters;
    };

    /**
     * Handles the selection of a filter option. Updates the `filteredSamples`
     * and `activeFilters` state accordingly.
     * @param filterIdentifier - identifier of the filter whose option was selected
     * @param option - option selected by the user
     */
    const onFilterOptionSelection = (filterIdentifier: string, option: OptionValue) => {
        const { value } = option;

        // Compute updated filters
        const updatedActiveFilters = getUpdatedActiveFilters(filterIdentifier, value);

        // Apply filters
        const newFilteredSamples = getFilteredSamples(allSamples, updatedActiveFilters);

        // Update state variables
        setFilteredSamples(newFilteredSamples);
        setActiveFilters(updatedActiveFilters);

        // If all filters are removed, hide non-matches
        if (Object.keys(updatedActiveFilters).length === 0) {
            setShowNonMatches(false);
        }
    };

    // Update filtered samples when cohort changes
    useEffect(() => {
        setFilteredSamples(cohorts[selectedCohort]?.samples || []);
    }, [cohorts, selectedCohort]);

    // Scroll to top when new sample is selected
    useEffect(() => {
        // Scroll to top when new cohort is selected
        if (selectedCohort) {
            const container = document.querySelector('.overview-container');
            if (container) {
                container.scrollTo({ top: 0 });
            }
        }
    }, [selectedCohort]);

    // When a new sample is added, add a class to the overview container
    useEffect(() => {
        const overviewContainer = document.querySelector('.overview-container');
        if (overviewContainer) {
            overviewContainer.classList.add('new-sample-added');
            setTimeout(() => {
                overviewContainer.classList.remove('new-sample-added');
            }, 3000);
        }
    }, [filteredSamples]);

    return (
        <div>
            <div className="overview-root">
                {showExternalDemoAlert && externalError && (
                    <div className="alert alert-warning external-demo" role="alert">
                        <strong>Error loading external URL:</strong> The provided link could not be loaded. Please check
                        the URL and try again.
                        <button
                            type="button"
                            className="close"
                            aria-label="Close"
                            onClick={() => setShowExternalDemoAlert(false)}
                        >
                            <span aria-hidden="true">&times;</span>
                        </button>
                    </div>
                )}
                <div className="overview-header">
                    <CohortSelector
                        cohorts={cohorts}
                        setCohorts={setCohorts}
                        setFilteredSamples={setFilteredSamples}
                        selectedCohort={selectedCohort}
                        setSelectedCohort={setSelectedCohort}
                    />
                    {/* Button below triggers UploadModal */}
                    <button className="upload-file-button" data-bs-toggle="modal" data-bs-target="#upload-modal">
                        <svg className="button" viewBox={ICONS.UPLOAD_FILE.viewBox}>
                            <title>Upload File</title>
                            {ICONS.UPLOAD_FILE.path.map(p => (
                                <path fill="currentColor" key={p} d={p} />
                            ))}
                        </svg>
                        <span>Visualize Your Data</span>
                    </button>
                </div>
                {filterIdentifiers.length > 0 && (
                    <>
                        <div className="overview-controls">
                            <div className="overview-controls-filters">
                                {filterIdentifiers.map((filterIdentifier, i) => {
                                    const { field, title, type } = cohortFiltersObject?.[filterIdentifier];

                                    return (
                                        <OverviewFilter
                                            key={i}
                                            type={type}
                                            identifier={filterIdentifier}
                                            title={title}
                                            options={filterValuesMap?.[filterIdentifier]?.values}
                                            active={Object.keys(activeFilters).includes(field || '')}
                                            onChange={onFilterOptionSelection}
                                            activeFilters={activeFilters}
                                            nullValue={type === 'binary' ? undefined : null}
                                            setActiveFilters={setActiveFilters}
                                            cohortFiltersObject={cohortFiltersObject}
                                            optionCounts={optionCounts[filterIdentifier]}
                                        />
                                    );
                                })}
                            </div>
                            {Object.keys(activeFilters).length > 0 && (
                                <div className="non-matches-checkbox">
                                    <label
                                        htmlFor="non-matches"
                                        className={`checkbox-container ${showNonMatches ? 'checked' : ''}`}
                                    >
                                        <input
                                            id="non-matches"
                                            type="checkbox"
                                            className="checkbox"
                                            checked={showNonMatches}
                                            aria-checked={showNonMatches}
                                            onChange={e => setShowNonMatches(e.target.checked)}
                                        />
                                        <span className="checkbox-icon">
                                            <svg className="icon" viewBox={ICONS.CHECKMARK.viewBox}>
                                                {ICONS.CHECKMARK.path.map(p => (
                                                    <path fill="currentColor" key={p} d={p} />
                                                ))}
                                            </svg>
                                        </span>
                                        Show non-matches for comparison
                                    </label>
                                </div>
                            )}
                        </div>
                    </>
                )}
                {Object.keys(activeFilters).length > 0 && (
                    <FilterStatusPanel
                        activeFilters={activeFilters}
                        cohortFiltersObject={cohortFiltersObject}
                        onFilterOptionSelection={onFilterOptionSelection}
                    />
                )}
                <div
                    className={`overview-container ${selectedCohort === 'PCAWG: Cancer Cohort' ? 'with-filters' : ''}`}
                >
                    <div className="overview-container-group">
                        {showNonMatches && Object.keys(activeFilters).length > 0 && (
                            <div className="comparison-banner matches">
                                <span>Matches</span>
                            </div>
                        )}
                        <div className="overview-status">{`Total of ${filteredSamples.length} samples loaded`}</div>
                        <div className="samples-container">
                            <SmallOverviewWrapper
                                demo={demo}
                                handleDemoChange={handleDemoChange}
                                demoIndex={demoIndex}
                                filteredSamples={filteredSamples}
                                setShowSamples={setShowSamples}
                            />
                        </div>
                    </div>
                    {showNonMatches && Object.keys(activeFilters).length > 0 && (
                        <div className="overview-container-group invert">
                            <div className="comparison-banner non-matches">
                                <span>Non - Matches</span>
                            </div>
                            <div className="overview-status">{`Total of ${invertedSamples.length} samples loaded`}</div>
                            <div className="samples-container">
                                <SmallOverviewWrapper
                                    demo={demo}
                                    handleDemoChange={handleDemoChange}
                                    demoIndex={demoIndex}
                                    filteredSamples={invertedSamples}
                                    setShowSamples={setShowSamples}
                                />
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};
