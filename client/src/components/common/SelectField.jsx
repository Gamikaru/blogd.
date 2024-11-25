// src/components/SelectField.jsx

import PropTypes from "prop-types";
import { forwardRef, memo, useMemo } from "react";
import { FiChevronDown } from "react-icons/fi"; // Import FiChevronDown icon

const SelectField = forwardRef(({ options, value, onChange, error, className, ...rest }, ref) => {
    const renderedOptions = useMemo(
        () =>
            options.map((option, index) => (
                <option key={index} value={option}>
                    {option}
                </option>
            )),
        [options]
    );

    return (
        <div className="input-field-wrapper">
            <div className="select-container">
                <select
                    name={rest.name} // Ensure name is passed
                    value={value}
                    onChange={onChange}
                    className={`input-control ${className} ${error ? 'is-invalid' : ''}`}
                    ref={ref}
                    {...rest} // Pass down additional props like 'name'
                    aria-label={rest['aria-label'] || "Select input"}
                >
                    <option value="">Select</option>
                    {renderedOptions}
                </select>
                <FiChevronDown className="select-icon" /> {/* Add Chevron Icon */}
            </div>
            {error && <span className="error-label">{error}</span>}
        </div>
    );
});

SelectField.displayName = 'SelectField';

SelectField.propTypes = {
    options: PropTypes.arrayOf(PropTypes.string).isRequired,
    value: PropTypes.oneOfType([
        PropTypes.string,
        PropTypes.number,
        PropTypes.bool,
        PropTypes.object,
    ]).isRequired,
    onChange: PropTypes.func.isRequired,
    error: PropTypes.string,
    className: PropTypes.string,
};

export default memo(SelectField);