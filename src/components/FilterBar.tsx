// components/FilterBar.tsx
import React, { useCallback } from 'react';
import { useQueryParams } from '../utils/useQueryParams';
// Removed: import MultiRangeSlider, { ChangeResult } from 'multi-range-slider-react';

const pricingOptions = [
  { label: 'Paid', value: 'paid' },
  { label: 'Free', value: 'free' },
  { label: 'View Only', value: 'view' }
];

const FilterBar: React.FC = () => {
  const { getParamArray, setParamArray, getParam, setParam, setSearchParams } = useQueryParams();

  const currentSortBy = getParam('sort') || 'name';
  const currentPricingFilters = getParamArray('pricing');
  // Removed: currentMinPrice and currentMaxPrice as they were tied to the slider

  const handleSearchChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    setParam('search', e.target.value);
  }, [setParam]);

  const handleSortChange = useCallback((e: React.ChangeEvent<HTMLSelectElement>) => {
    setParam('sort', e.target.value);
  }, [setParam]);

  const handlePricingToggle = useCallback((optionValue: string) => {
    const arr = getParamArray('pricing');
    const next = arr.includes(optionValue)
      ? arr.filter(v => v !== optionValue)
      : [...arr, optionValue];
    setParamArray('pricing', next);
  }, [getParamArray, setParamArray]);

  // Removed: handlePriceChange as it was tied to the slider

  const handleResetFilters = useCallback(() => {
    // Create a brand new URLSearchParams object with only the default values
    const newParams = new URLSearchParams();
    newParams.set('sort', 'name'); // Set default sort
    newParams.set('min', '0');     // Set default min price (for internal logic)
    newParams.set('max', '999');   // Set default max price (for internal logic)
    // 'search' and 'pricing' are not set, so they will be cleared from the URL.

    // Apply the entire new set of parameters in one go
    setSearchParams(newParams);
  }, [setSearchParams]);

  return (
    <div className="mb-4">
      <div className="d-flex flex-wrap gap-3 align-items-center">
        <input
          type="text"
          className="form-control"
          placeholder="Search by title or creator"
          value={getParam('search')}
          onChange={handleSearchChange}
        />

        {pricingOptions.map(o => (
          <label key={o.value} className="form-check-label">
            <input
              type="checkbox"
              className="form-check-input me-1"
              checked={currentPricingFilters.includes(o.value)}
              onChange={() => handlePricingToggle(o.value)}
            />
            {o.label}
          </label>
        ))}

        <select
          className="form-select w-auto"
          value={currentSortBy}
          onChange={handleSortChange}
        >
          <option value="name">Item Name</option>
          <option value="high">Higher Price</option>
          <option value="low">Lower Price</option>
        </select>

        {/* Removed: MultiRangeSlider JSX block */}

        <button className="btn btn-secondary" onClick={handleResetFilters}>
          Reset
        </button>
      </div>
    </div>
  );
};

export default FilterBar;