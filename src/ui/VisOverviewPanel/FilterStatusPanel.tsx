import React from 'react';

import { CohortFilter } from '../../App';
import { OptionValue, ActiveFilters } from './OverviewPanel';
import { ICONS } from '../../icon';
import { getBinaryOptionValue } from './OverviewFilter';

type FilterStatusPanelProps = {
    activeFilters: ActiveFilters;
    cohortFilters: CohortFilter[];
    onFilterOptionSelection: (filterKey: string, option: OptionValue) => void;
}

export const FilterStatusPanel = ({ activeFilters, cohortFilters = [], onFilterOptionSelection } : FilterStatusPanelProps ) => {
  return (
    <div className="filter-status">
        <span>Filtered By:</span>
        {
            Object.keys(activeFilters).map((filterKey, i) => {
                const activeFilterIdentifier = filterKey;
                const { title: filterTitle, field: filterIdentifier, type: filterType } = Object.values(cohortFilters).find(f => f.field === activeFilterIdentifier);

                return (
                    <>
                        {i > 0 && 
                            <span className="ampersand">&amp;</span>
                        }
                        <div className="filter-status-item" key={i}>
                            <div className="selected-filter-options-container">
                                <div className="selected-filter-options">
                                    {
                                        activeFilters[activeFilterIdentifier].map((value, i) => {
                                            // Format the value based on the filter type
                                            const formattedValue = filterType === 'binary' ? getBinaryOptionValue(value) : value;

                                            return (
                                                <>
                                                    {i > 0 && 
                                                        <div className="divider vertical">
                                                            <span>|</span>
                                                        </div>
                                                    }
                                                    <div className="selected-filter-option" key={i}>
                                                        <span>{formattedValue}</span>
                                                        <button className="remove-filter-option" onClick={() => onFilterOptionSelection(activeFilterIdentifier, { value })}>
                                                            <svg className="icon" viewBox={ICONS.X_MARK.viewBox}>
                                                                {ICONS.X_MARK.path.map(p => (
                                                                    <path fill="currentColor" key={p} d={p} />
                                                                ))}
                                                            </svg>
                                                        </button>
                                                    </div>
                                                </>
                                            );
                                        })
                                    }
                                </div>
                                <span className="selected-filter-title">{filterTitle}</span>
                            </div>
                        </div>
                    </>
                );
            })
        }
    </div>
  )
}
