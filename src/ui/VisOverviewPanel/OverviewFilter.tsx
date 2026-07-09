import React, { useState, useEffect, useRef, useLayoutEffect } from 'react';
import { ICONS } from '../../icon';
import { ActiveFilters, OptionValue } from './OverviewPanel';
import { CohortFilter } from '../../App';
import { Primitive } from './OverviewPanel';

type OverviewFilterProps = {
    identifier?: string;
    title: string;
    type?: string;
    options?: OptionValue[];
    activeFilters?: ActiveFilters;
    cohortFiltersObject?: { [key: string]: CohortFilter };
    optionCounts?: Record<string, number>;
    onChange?: (value: string, option?: OptionValue | null) => void;
};

export const getBinaryOptionValue = (option: Primitive): string | null => {
    const value = option;
    if (value === '1' || value === 1 || value === true) {
        return 'Yes';
    } else if (value === '0' || value === 0 || value === false) {
        return 'No';
    }
    return null;
};

export const transformOptionValue = (value: Primitive, filterType: string | undefined) => {
    if (filterType === 'binary') {
        return getBinaryOptionValue(value);
    } else if (filterType === 'continuous') {
        const match = (value as string).match(/^(-?[\d.]+)-(-?[\d.]+)$/);
        const [start, end] = match ? [match[1], match[2]].map(n => Number(n).toLocaleString()) : [value, value];
        return start + ' - ' + end;
    }
    return value;
};

export const OverviewFilter = ({
    identifier,
    title,
    options = [],
    activeFilters = {},
    optionCounts,
    onChange = null,
    cohortFiltersObject
}: OverviewFilterProps) => {
    const overviewFilterRef = useRef<HTMLDivElement>(null);
    const toggleButtonRef = useRef<HTMLButtonElement>(null);
    const optionsRefs = useRef<(HTMLLIElement | null)[]>([]);

    const [showDropdown, setShowDropdown] = useState(false);
    const [selectedOption, setSelectedOption] = useState<string | null>(null);
    const [focusedIndex, setFocusedIndex] = useState<number>(-1);

    const isFilterActive = identifier in activeFilters;

    useLayoutEffect(() => {
        if (!showDropdown) return;
        const dropdown = document.querySelector('#dropdown-list-for-' + identifier);
        if (!dropdown) return;
        const rect = dropdown.getBoundingClientRect();

        const isOverflowingRight = rect.right > window.innerWidth;

        if (isOverflowingRight) {
            dropdown.classList.add('reverse-dropdown');
        }
    }, [showDropdown]);

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

    const handleOptionSelection = (option: OptionValue | null) => {
        onChange(identifier, option);
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
                    handleOptionSelection(options[focusedIndex]);
                }
                break;
            case 'Escape':
                e.preventDefault();
                setShowDropdown(false);
                setFocusedIndex(-1);
                toggleButtonRef.current?.focus();
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
            aria-owns={'dropdown-list-for-' + identifier}
            onKeyDown={handleDropdownKeydown}
        >
            <button
                className={`dropdown-button ${showDropdown ? 'toggle-open' : ''}`}
                onClick={e => {
                    // Focus the selected option when opening the dropdown
                    setShowDropdown(!showDropdown);
                }}
                aria-labelledby="select-label"
            >
                <div className="select-label-wrapper">
                    <span id={'select-label-for-' + identifier} className="select-label" title={title}>
                        {title}
                    </span>
                </div>
                <div className="count-container">
                    {activeFilters?.[identifier]?.length > 0 && (
                        <div className="selected-option-count">
                            <span>{activeFilters[identifier].length ?? ''}</span>
                        </div>
                    )}
                    <svg className="icon" viewBox={ICONS.CHEVRON_UP.viewBox}>
                        {ICONS.CHEVRON_UP.path.map(p => (
                            <path fill="currentColor" key={p} d={p} />
                        ))}
                    </svg>
                </div>
            </button>
            <ul
                id={`dropdown-list-for-${identifier}`}
                role="listbox"
                className={`dropdown-items ${showDropdown ? 'd-flex' : 'd-none'}`}
            >
                {options
                    .sort((a: OptionValue, b: OptionValue) => {
                        const valA = (a as OptionValue).value;
                        const valB = (b as OptionValue).value;

                        if (typeof valA === 'number' && typeof valB === 'number') {
                            return valA - valB;
                        }

                        // Cast to string to as fallback
                        return ('' + valA).localeCompare('' + valB);
                    })
                    .map((option: OptionValue, i: number) => {
                        const { value } = option;

                        const activeOptions = activeFilters[identifier] || [];
                        const isSelected = activeOptions.includes(value);

                        const filterType = cohortFiltersObject[identifier]?.type;
                        const formattedValue = transformOptionValue(value, filterType);

                        // Hide if option (in isolation) has no results
                        if (filterType === 'continuous' && option?.count === 0) {
                            return null;
                        }

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
                                <div className="dropdown-item-checkbox">
                                    <label className="checkbox-container">
                                        <div className="input-label">
                                            <input
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
                                        </div>
                                        <span className="count">
                                            {optionCounts?.[value as string] ?? option?.count ?? ''}
                                        </span>
                                    </label>
                                </div>
                            </li>
                        );
                    })}
            </ul>
        </div>
    );
};
