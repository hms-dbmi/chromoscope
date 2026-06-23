import React from 'react';

import { CohortFilter } from '../../App';
import { OptionValue, ActiveFilters } from './OverviewPanel';
import { ICONS } from '../../icon';
import { getBinaryOptionValue } from './OverviewFilter';

type FilterStatusPanelProps = {
    activeFilters: ActiveFilters;
    cohortFiltersObject: { [key: string]: CohortFilter };
    onFilterOptionSelection: (filterKey: string, option: OptionValue) => void;
    clearFilters: () => void;
};

export const FilterStatusPanel = ({
    activeFilters,
    cohortFiltersObject = {},
    onFilterOptionSelection,
    clearFilters
}: FilterStatusPanelProps) => {
    return (
        <div className="filter-status">
            <div className="filter-status-header">
                <svg className="icon" viewBox={ICONS.FILTER.viewBox}>
                    {ICONS.FILTER.path.map(p => (
                        <path fill="currentColor" key={p} d={p} />
                    ))}
                </svg>
                <span>Filters:</span>
            </div>
            {Object.keys(activeFilters).map((filterIdentifier, i) => {
                const { title: filterTitle, type: filterType } = cohortFiltersObject?.[filterIdentifier] || {};

                return (
                    <div className="filter-status-item-container" key={i}>
                        {i > 0 && <span className="ampersand">&amp;</span>}
                        <div className="filter-status-item">
                            <div className="selected-filter-options-container">
                                <div className="selected-filter-options">
                                    {activeFilters[filterIdentifier].map((value, i) => {
                                        // Format the value based on the filter type
                                        const formattedValue =
                                            filterType === 'binary' ? getBinaryOptionValue(value) : value;

                                        return (
                                            <div className="selected-filter-option-container" key={i}>
                                                {i > 0 && (
                                                    <div className="divider vertical">
                                                        <span>|</span>
                                                    </div>
                                                )}
                                                <div className="selected-filter-option">
                                                    <span>{formattedValue}</span>
                                                    <button
                                                        className="remove-filter-option"
                                                        onClick={() =>
                                                            onFilterOptionSelection(filterIdentifier, { value })
                                                        }
                                                    >
                                                        <svg className="icon" viewBox={ICONS.X_MARK.viewBox}>
                                                            {ICONS.X_MARK.path.map(p => (
                                                                <path fill="currentColor" key={p} d={p} />
                                                            ))}
                                                        </svg>
                                                    </button>
                                                </div>
                                            </div>
                                        );
                                    })}
                                </div>
                                <span className="selected-filter-title">{filterTitle}</span>
                            </div>
                        </div>
                    </div>
                );
            })}
            {Object.keys(activeFilters)?.length > 1 && (
                <button className="clear-filters-button" onClick={clearFilters}>
                    <span>Clear All</span>
                </button>
            )}
        </div>
    );
};
