import React, { useState, useEffect, useRef } from 'react';
import { ICONS } from '../../icon';
import { FilterOption } from './OverviewPanel';

type OverviewFilterProps = {
    identifier?: string;
    nullValue?: string;
    active?: boolean;
    title: string;
    options?: Array<any>;
    activeFilters?: string[];
    onChange?: (value: string) => void;
    setActiveFilters?: (filters: string[]) => void;
};

export const OverviewFilter = ({
    identifier,
    nullValue = null,
    active,
    title,
    options = [],
    activeFilters,
    onChange = null,
    setActiveFilters = null
}: OverviewFilterProps) => {
    const overviewFilterRef = useRef<HTMLDivElement>(null);
    const toggleButtonRef = useRef<HTMLButtonElement>(null);
    const optionsRefs = useRef<(HTMLLIElement | null)[]>([]);

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

    const handleOptionSelection = (option: FilterOption | null) => {
        if (option === null) {
            setSelectedOption(null);
        } else {
            setSelectedOption(option.name); // Set the selected option name
            setActiveFilters([identifier]); // Set active filter to only the current identifier
        }

        setShowDropdown(false);
        setFocusedIndex(-1);
        toggleButtonRef.current?.focus();

        // URL
        if (option?.url) {
            onChange(option.url.replace('https://chromoscope.bio/app/?showSamples=true&external=', ''));
        }
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

        // Map key events to actions
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
                    setSelectedOption(selected.name);
                    setShowDropdown(false);
                    setFocusedIndex(-1);
                    if (onChange)
                        onChange(selected.url.replace('https://chromoscope.bio/app/?showSamples=true&external=', ''));
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
                <span id="select-label">{selectedOption ?? title}</span>
                <svg className="icon" viewBox={ICONS.CHEVRON_UP.viewBox}>
                    <title>{showDropdown ? 'Chevron Up' : 'Chevron Down'}</title>
                    {ICONS.CHEVRON_UP.path.map(p => (
                        <path fill="currentColor" key={p} d={p} />
                    ))}
                </svg>
            </button>
            <ul id="dropdown-list" role="listbox" className={`dropdown-items ${showDropdown ? 'd-flex' : 'd-none'}`}>
                {/* First list option is the provided nullValue */}
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
                {options
                    .sort((a, b) => (a.name > b.name ? 1 : -1))
                    .map((option, i) => {
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
                                <span>{option?.count ? option.count : ''}</span>
                            </li>
                        );
                    })}
            </ul>
        </div>
    );
};
