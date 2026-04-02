import React, { useState, useEffect, useRef } from 'react';
import { ICONS } from '../../icon';
import { FilterOption, NewFilter, ActiveFilters, OptionValue } from './OverviewPanel';
import { CohortFilter } from '../../App';
import { Primitive } from './OverviewPanel';


export const isFilterOption = (option: FilterOption | OptionValue): option is FilterOption => {
    return typeof option === 'object' && 'name' in option;
};

type OverviewFilterProps = {
    identifier?: string;
    nullValue?: string;
    active?: boolean;
    title: string;
    type?: string;
    options?: FilterOption[] | OptionValue[];
    activeFilters?: ActiveFilters;
    cohortFiltersObject?: {[key: string]: CohortFilter};
    optionCounts?: Record<string, number>;
    onChange?: (value: string, option?: OptionValue| FilterOption | null) => void;
    setActiveFilters?: (filters: ActiveFilters) => void;
};

export const getBinaryOptionValue = (option: Primitive): string => {
    const value = option;
    if (value === '1' || value === 1 || value === true) {
        return 'Yes';
    } else if (value === '0' || value === 0 || value === false) {
        return 'No';
    }
    return null;
};

export const transformOptionValue = (value: Primitive, filterType: string) => {
    if (filterType === 'binary') {
        return getBinaryOptionValue(value);
    } else if (filterType === 'continuous') {
        return value
    }
    return value;
};

export const OverviewFilter = ({
    identifier,
    nullValue,
    active = false,
    type,
    title,
    options = [],
    activeFilters,
    optionCounts,
    onChange = null,
    setActiveFilters = null,
    cohortFiltersObject
}: OverviewFilterProps) => {
    const overviewFilterRef = useRef<HTMLDivElement>(null);
    const toggleButtonRef = useRef<HTMLButtonElement>(null);
    const optionsRefs = useRef<(HTMLLIElement | null)[]>([]);

    const [showDropdown, setShowDropdown] = useState(false);
    const [selectedOption, setSelectedOption] = useState<string | null>(null);
    const [focusedIndex, setFocusedIndex] = useState<number>(-1);

    const isFilterActive = identifier in activeFilters;

    // Manage the focused index for keyboard navigation
    useEffect(() => {
        if (showDropdown && focusedIndex >= 0 && optionsRefs.current[focusedIndex]) {
            optionsRefs.current[focusedIndex]?.focus();
        }
    }, [showDropdown, focusedIndex]);

    // Scroll to top when new sample is selected
    useEffect(() => {
        if (selectedOption) {
            const container = document.querySelector('.overview-container');
            if (container) {
                container.scrollTo({ top: 0 });
            }
        }
    }, [selectedOption]);

    useEffect(() => {
        // If another filter is active, set this filter to inactive
        if (!Object.keys(activeFilters).includes(identifier)) {
            setSelectedOption(null);
        }
    }, [activeFilters]);

    // Close dropdown on outside click
    useEffect(() => {
        function handleClickOutside(event: MouseEvent) {
            const clickedOutside =
                !overviewFilterRef.current || !overviewFilterRef.current.contains(event.target as Node);
            if (clickedOutside) {
                setShowDropdown(false);
                setFocusedIndex(-1);
            }
        }

        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    // Function for handling option selection
    const handleOptionSelection = (option: FilterOption | OptionValue | null) => {
            // Handle filter options
            if (isFilterOption(option)) {
                setSelectedOption(option.name); // Set the selected option name
                // setActiveFilters([identifier]); // Set active filter to only the current identifier
                
                // pass URL through onChange
                if (onChange) {
                    onChange(identifier, option);
                }
            } else {
                onChange(identifier, option);
        }

        setShowDropdown(false);
        setFocusedIndex(-1);
        toggleButtonRef.current?.focus();
    };

    // Handle keyboard navigation for the dropdown
    const handleDropdownKeydown = (e: React.KeyboardEvent<HTMLDivElement>) => {
        if (!showDropdown && (e.key === 'Enter' || e.key === ' ' || e.key === 'ArrowDown' || e.key === 'ArrowUp')) {
            e.preventDefault();
            setShowDropdown(true);
            setFocusedIndex(0);
            return;
        }

        if (!showDropdown) return;

        // // Map key events to actions
        switch (e.key) {
            case 'ArrowDown':
                e.preventDefault();
                setFocusedIndex(prevIndex => (prevIndex + 1) % options.length);
                break;
            case 'ArrowUp':
                e.preventDefault();
                setFocusedIndex(prevIndex => (prevIndex - 1 + options.length) % options.length);
                break;
            case 'Enter':
            case ' ':
                e.preventDefault();
                if (focusedIndex >= 0 && focusedIndex < options.length) {
                    const selected = options[focusedIndex];
                    handleOptionSelection(selected);
                    setShowDropdown(false);
                    setFocusedIndex(-1);
                }
                break;
            case 'Escape':
                e.preventDefault();
                setShowDropdown(false);
                setFocusedIndex(-1);
                break;
            case 'Tab':
                setShowDropdown(false);
                setFocusedIndex(-1);
                break;
            default:
                break;
        }
    };

    return (
        <div
            className={`dropdown-container filter ${isFilterActive ? 'has-selection' : ''}`}
            ref={overviewFilterRef}
            role="combobox"
            aria-expanded={showDropdown}
            aria-haspopup="listbox"
            aria-owns="dropdown-list"
            onKeyDown={handleDropdownKeydown}
        >
            <button
                className={`dropdown-button ${showDropdown ? 'toggle-open' : ''}`}
                onClick={e => {
                    // Focus the selected option when opening the dropdown
                    setShowDropdown(prev => {
                        const isOpening = !prev;
                        if (isOpening && selectedOption) {
                            const selectedIdx = options.findIndex(o => o.name === selectedOption);
                            setFocusedIndex(selectedIdx >= 0 ? selectedIdx : 0);
                        }
                        return isOpening;
                    });
                }}
                aria-labelledby="select-label"
            >
                <div className="select-label-wrapper">
                    <span id="select-label">{title}</span>
                    { activeFilters?.[identifier]?.length > 0 &&
                        <div className="selected-option-count">
                            <span>
                                {activeFilters[identifier].length ?? ''}
                            </span>
                        </div>
                    }
                </div>
                <svg className="icon" viewBox={ICONS.CHEVRON_UP.viewBox}>
                    {ICONS.CHEVRON_UP.path.map(p => (
                        <path fill="currentColor" key={p} d={p} />
                    ))}
                </svg>
            </button>
            <ul id="dropdown-list" role="listbox" className={`dropdown-items ${showDropdown ? 'd-flex' : 'd-none'}`}>
                {options
                    .sort((a: FilterOption | OptionValue, b: FilterOption | OptionValue) => {
                        if (isFilterOption(a) && isFilterOption(b)) {
                            return a.name.localeCompare(b.name) ? 1 : -1
                        } else {
                            const valA = (a as OptionValue).value;
                            const valB = (b as OptionValue).value;

                            if (typeof valA === 'number' && typeof valB === 'number') {
                                return valA - valB;
                            }

                            // Cast to string to as fallback
                            return ("" + valA).localeCompare("" + valB) ? 1 : -1
                        }
                    })
                    .map((option: FilterOption | OptionValue, i: number) => {
                        
                        // Determine if the option is a FilterOption or OptionValue
                        if (isFilterOption(option)) {
                            return (
                                <li
                                    key={option.name}
                                    role="option"
                                    tabIndex={focusedIndex === i ? 0 : -1}
                                    ref={el => {
                                        optionsRefs.current[i] = el;
                                    }}
                                    aria-selected={selectedOption === option.name}
                                    onClick={() => handleOptionSelection(option)}
                                    onMouseEnter={() => setFocusedIndex(i)}
                                    className={`dropdown-item ${selectedOption === option.name ? 'selected' : ''} ${
                                        focusedIndex === i ? 'focused' : ''
                                    }`}
                                >
                                    <span>{option.name}</span>
                                    <span>{optionCounts?.[option.name] ?? option?.count ?? ''}</span>
                                </li>
                            );
                        } else {
                            const { value, count } = option;

                            const activeOptions = activeFilters[identifier] || [];
                            const isSelected = activeOptions.includes(value);

                            // Format the value based on the filter type
                            const filterType = Object.values(cohortFiltersObject).find(f => f.field === identifier)?.type;
                            const formattedValue = transformOptionValue(value, filterType);

                            return (
                                <li
                                    key={i}
                                    role="option"
                                    tabIndex={focusedIndex === i ? 0 : -1}
                                    ref={el => {
                                        optionsRefs.current[i] = el;
                                    }}
                                    aria-selected={isSelected}
                                    onMouseEnter={() => setFocusedIndex(i)}
                                    className={`dropdown-item ${isSelected ? 'selected' : ''} ${
                                        focusedIndex === i ? 'focused' : ''
                                    }`}
                                >
                                    <label className="dropdown-item-checkbox">
                                        <label htmlFor={`${identifier}-${option.value}`} className="checkbox-container">
                                            <input
                                                id={`${identifier}-${option.value}`}
                                                className="checkbox" 
                                                type="checkbox" 
                                                checked={isSelected} 
                                                onChange={() => handleOptionSelection(option)} 
                                            />
                                            <span className="checkbox-icon">
                                                {isSelected && (
                                                    <svg className="icon" viewBox={ICONS.CHECKMARK.viewBox}>
                                                        {ICONS.CHECKMARK.path.map(p => (
                                                            <path fill="currentColor" key={p} d={p} />
                                                        ))}
                                                    </svg>
                                                )}
                                            </span>
                                            <span>{formattedValue}</span>
                                        </label>
                                        <span className="count">{optionCounts?.[value as string] ?? option?.count ?? ''}</span>
                                    </label>
                                </li>
                            );
                        }
                    })}
            </ul>
        </div>
    );
};
