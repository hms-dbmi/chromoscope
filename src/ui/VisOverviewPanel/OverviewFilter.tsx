import React, { useState, useEffect, useRef } from 'react';
import { ICONS } from '../../icon';
import { FilterOption, Option, OptionValue } from './OverviewPanel';
import { BinaryFilter } from './BinaryFilter';

const getBinaryOptionValue = (option: string | number | boolean): string => {
    const value = option;
    if (value === '1' || value === 1 || value === true) {
        return 'Yes';
    } else if (value === '0' || value === 0 || value === false) {
        return 'No';
    }
    return null;
};

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
    activeFilters?: string[];
    onChange?: (value: string, option?: FilterOption | null) => void;
    setActiveFilters?: (filters: string[]) => void;
};

export const OverviewFilter = ({
    identifier,
    nullValue,
    active = false,
    type,
    title,
    options = [],
    activeFilters,
    onChange = null,
    setActiveFilters = null
}: OverviewFilterProps) => {
    const overviewFilterRef = useRef<HTMLDivElement>(null);
    const toggleButtonRef = useRef<HTMLButtonElement>(null);
    const optionsRefs = useRef<(HTMLLIElement | null)[]>([]);

    // console.log('options:', options, optionsRefs);

    const [showDropdown, setShowDropdown] = useState(false);
    const [selectedOption, setSelectedOption] = useState<string | null>(null);
    const [focusedIndex, setFocusedIndex] = useState<number>(-1);

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
        if (!activeFilters.includes(identifier)) {
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
        if (option === null) {
            setSelectedOption(null);
            setActiveFilters([]); // Clear all active filters
        } else if (isFilterOption(option)) {
            setSelectedOption(option.name); // Set the selected option name
            setActiveFilters([identifier]); // Set active filter to only the current identifier

            // pass URL through onChange
            if (onChange) {
                onChange(identifier, option);
            }
        } else {
            // deselect option if already selected
            if (selectedOption === option.value) {
                console.log('deselect option: ', option);
                setSelectedOption(null);
                // setActiveFilters([]); // Clear all active filters
            } else {
                console.log('selectedOption:', selectedOption ?? 'No option selected yet. Selecting option:', option);
                setSelectedOption(option.value + ''); // Set the selected option value
                // setActiveFilters([identifier]); // Set active filter to only the current identifier
                onChange(identifier, option);
            }

            // if (onChange) {
            //     // console.log("onChange!", identifier, option);
            //     onChange(identifier, option.value);
            // }
        }

        setShowDropdown(false);
        setFocusedIndex(-1);
        toggleButtonRef.current?.focus();

        // if (option?.url) {
        //     onChange(option.url.replace('https://chromoscope.bio/app/?showSamples=true&external=', ''));
        // }
    };

    // Handle keyboard navigation for the dropdown
    const handleDropdownKeydown = (e: React.KeyboardEvent<HTMLDivElement>) => {
        return;
        // if (!showDropdown && (e.key === 'Enter' || e.key === ' ' || e.key === 'ArrowDown' || e.key === 'ArrowUp')) {
        //     e.preventDefault();
        //     setShowDropdown(true);
        //     setFocusedIndex(0);
        //     return;
        // }

        // if (!showDropdown) return;

        // // Map key events to actions
        // switch (e.key) {
        //     case 'ArrowDown':
        //         e.preventDefault();
        //         setFocusedIndex(prevIndex => (prevIndex + 1) % options.length);
        //         break;
        //     case 'ArrowUp':
        //         e.preventDefault();
        //         setFocusedIndex(prevIndex => (prevIndex - 1 + options.length) % options.length);
        //         break;
        //     case 'Enter':
        //     case ' ':
        //         e.preventDefault();
        //         if (focusedIndex >= 0 && focusedIndex < options.length) {
        //             const selected = options[focusedIndex];
        //             // console.log('selected', selected);
        //             setSelectedOption(selected.name);
        //             setShowDropdown(false);
        //             setFocusedIndex(-1);
        //             if (onChange) {
        //                 // console.log('onChange!');
        //                 onChange(identifier, selected);
        //                 // onChange(selected.url.replace('https://chromoscope.bio/app/?showSamples=true&external=', ''));
        //             }
        //         }
        //         break;
        //     case 'Escape':
        //         e.preventDefault();
        //         setShowDropdown(false);
        //         setFocusedIndex(-1);
        //         break;
        //     case 'Tab':
        //         setShowDropdown(false);
        //         setFocusedIndex(-1);
        //         break;
        //     default:
        //         break;
        // }
    };

    return (
        <div
            className={`dropdown-container filter ${selectedOption ? 'has-selection' : ''}`}
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
                <span id="select-label">{getBinaryOptionValue(selectedOption) ?? title}</span>
                <svg className="icon" viewBox={ICONS.CHEVRON_UP.viewBox}>
                    <title>{showDropdown ? 'Chevron Up' : 'Chevron Down'}</title>
                    {ICONS.CHEVRON_UP.path.map(p => (
                        <path fill="currentColor" key={p} d={p} />
                    ))}
                </svg>
            </button>
            <ul id="dropdown-list" role="listbox" className={`dropdown-items ${showDropdown ? 'd-flex' : 'd-none'}`}>
                {/* First list option is the nullValue if provided */}
                {typeof nullValue !== 'undefined' && (
                    <li
                        key={'None'}
                        role="option"
                        tabIndex={focusedIndex === 0 ? 0 : -1}
                        ref={el => {
                            optionsRefs.current[0] = el;
                        }}
                        aria-selected={selectedOption === nullValue}
                        onClick={() => handleOptionSelection(null)}
                        onMouseEnter={() => setFocusedIndex(0)}
                        className={`dropdown-item ${selectedOption === null ? 'selected' : ''} ${
                            focusedIndex === 0 ? 'focused' : ''
                        }`}
                    >
                        None
                    </li>
                )}
                {options
                    // .sort((a, b) => {
                    //     return a.localeCompare(b) ? 1 : -1
                    // })
                    .map((option: FilterOption | OptionValue, i: number) => {
                        // Determine if the option is a FilterOption or OptionValue

                        if (isFilterOption(option)) {
                            return (
                                <li
                                    key={option.name}
                                    role="option"
                                    tabIndex={focusedIndex === i + 1 ? 0 : -1}
                                    ref={el => {
                                        optionsRefs.current[i + 1] = el;
                                    }}
                                    aria-selected={selectedOption === option.name}
                                    onClick={() => handleOptionSelection(option)}
                                    onMouseEnter={() => setFocusedIndex(i + 1)}
                                    className={`dropdown-item ${selectedOption === option.name ? 'selected' : ''} ${
                                        focusedIndex === i + 1 ? 'focused' : ''
                                    }`}
                                >
                                    <span>{option.name}</span>
                                    <span>{option?.count ?? ''}</span>
                                </li>
                            );
                        } else {
                            const { value, count } = option;

                            // convert binary options to Yes/No
                            // if (type === "binary" && options.length === 2) {
                            //     return (
                            //         <BinaryFilter
                            //             i={i}
                            //             focusedIndex={focusedIndex}
                            //             optionsRefs={optionsRefs}
                            //             selectedOption={selectedOption}
                            //             setFocusedIndex={setFocusedIndex}
                            //             value={value}
                            //             count={count}
                            //             onClick={handleOptionSelection}
                            //         />
                            //     )
                            // }
                            const formattedValue = value;
                            // if (type === "binary") {
                            //     formattedValue = getBinaryOptionValue(value);
                            // }

                            return (
                                <li
                                    key={i}
                                    role="option"
                                    tabIndex={focusedIndex === i + 1 ? 0 : -1}
                                    ref={el => {
                                        optionsRefs.current[i + 1] = el;
                                    }}
                                    aria-selected={selectedOption === formattedValue}
                                    onClick={() => handleOptionSelection(option)}
                                    onMouseEnter={() => setFocusedIndex(i + 1)}
                                    className={`dropdown-item ${selectedOption === formattedValue ? 'selected' : ''} ${
                                        focusedIndex === i + 1 ? 'focused' : ''
                                    }`}
                                >
                                    <span>{formattedValue}</span>
                                    <span>{count ?? ''}</span>
                                </li>
                            );
                        }
                    })}
            </ul>
        </div>
    );
};
