import React from 'react';

type BinaryFilterProps = {
    i: number;
    focusedIndex: number;
    optionsRefs: React.MutableRefObject<(HTMLLIElement | null)[]>;
    selectedOption: string | null;
    setFocusedIndex: (focusedIndex: number) => void;
    value: string | number | boolean;
    count?: number;
    onClick?: (value: string) => void;
};

export const BinaryFilter = ({
    i,
    focusedIndex,
    optionsRefs,
    selectedOption,
    value,
    count,
    setFocusedIndex
}: BinaryFilterProps) => {
    let formattedValue = value;

    if (value === '1' || value === 1 || value === true) {
        formattedValue = 'Yes';
    } else if (value === '0' || value === 0 || value === false) {
        formattedValue = 'No';
    }

    return (
        <li
            key={i}
            role="option"
            tabIndex={focusedIndex === i + 1 ? 0 : -1}
            ref={el => {
                optionsRefs.current[i + 1] = el;
            }}
            aria-selected={selectedOption === value}
            // onClick={() => handleOptionSelection(option)}
            onMouseEnter={() => setFocusedIndex(i + 1)}
            className={`dropdown-item ${selectedOption === value ? 'selected' : ''} ${
                focusedIndex === i + 1 ? 'focused' : ''
            }`}
        >
            <input type="radio" name="filter" checked={selectedOption === value} />
            <span>{formattedValue}</span>
            <span>{count ?? ''}</span>
        </li>
    );
};
