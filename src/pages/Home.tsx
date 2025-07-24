// pages/Home.tsx
import React, { useEffect, useState, useCallback, useMemo } from 'react';
import { useAppDispatch, useAppSelector } from '../hooks';
import { fetchData } from '../store/slices/dataSlice';
import type { Item } from '../store/slices/dataSlice';

import FilterBar from '../components/FilterBar';
import ContentCard from '../components/ContentCard';
import ContentSkeleton from '../components/ContentSkeleton';
import { useQueryParams } from '../utils/useQueryParams';

const ITEMS_PER_LOAD = 12;

const Home: React.FC = () => {
  const dispatch = useAppDispatch();
  const allItems = useAppSelector((s) => s.data.items);
  // useQueryParams functions (getParamArray, getParam) are now GUARANTEED to be stable
  const { getParamArray, getParam } = useQueryParams();

  const [visibleItems, setVisibleItems] = useState<Item[]>([]);
  const [page, setPage] = useState(1);
  const [loadingMore, setLoadingMore] = useState(false);

  // Effect to dispatch data fetching only once on component mount
  useEffect(() => {
    dispatch(fetchData());
  }, [dispatch]);

  // Memoized function to filter allItems based on current query parameters.
  // This function itself is stable and only re-creates if its dependencies change.
  const getProcessed = useCallback((): Item[] => {
    // console.log('getProcessed recreated'); // Uncomment for debugging
    const pricingFilters = getParamArray('pricing');
    const searchTerm = getParam('search').toLowerCase();
    const minPrice = Number(getParam('min') || 0);
    const maxPrice = Number(getParam('max') || 999);
    const sortBy = getParam('sort') || 'name'; // Get sort param

    let filteredItems = allItems.filter((item) => {
      const itemPricingCategory =
        item.pricingOption === 0
          ? 'free'
          : item.pricingOption === 1
            ? 'paid'
            : 'view';

      const matchesPricing = pricingFilters.length === 0 || pricingFilters.includes(itemPricingCategory);
      const matchesSearch =
        !searchTerm ||
        item.title.toLowerCase().includes(searchTerm) ||
        item.creator.toLowerCase().includes(searchTerm);

      // Only apply price range filter if 'paid' is selected in pricing filters
      const matchesPriceRange =
        !pricingFilters.includes('paid') || // If 'paid' is not selected, this filter doesn't apply
        (item.pricingOption === 1 && item.price >= minPrice && item.price <= maxPrice);

      return matchesPricing && matchesSearch && matchesPriceRange;
    });

    // Apply sorting
    filteredItems.sort((a, b) => {
      if (sortBy === 'high') {
        return (b.price || 0) - (a.price || 0); // Sort by price descending
      } else if (sortBy === 'low') {
        return (a.price || 0) - (b.price || 0); // Sort by price ascending
      } else { // 'name' or default
        return a.title.localeCompare(b.title); // Sort by title alphabetically
      }
    });

    return filteredItems;
  }, [allItems, getParamArray, getParam]); // These dependencies should now be stable due to useQueryParams memoization

  // Memoize the *result* of calling getProcessed.
  // This ensures `processedItems` is a stable array reference,
  // only changing when the actual filtered data changes.
  const processedItems = useMemo(() => {
    // console.log('processedItems re-calculated'); // Uncomment for debugging
    return getProcessed();
  }, [getProcessed]); // Depends on the stable getProcessed function

  // Effect to reset visible items and page when filters (i.e., processedItems) change.
  // This is the useEffect that was causing the error previously.
  // It now depends on `processedItems`, which is a stable reference unless its content truly changes.
  useEffect(() => {
    // console.log('Initial set/reset visible items due to filters change'); // Uncomment for debugging
    setVisibleItems(processedItems.slice(0, ITEMS_PER_LOAD));
    setPage(1);
  }, [processedItems]); // This dependency is now stable, preventing infinite loops

  // Memoized function to load more items.
  const loadMore = useCallback(() => {
    // console.log('Loading more items'); // Uncomment for debugging
    setLoadingMore(true);
    setTimeout(() => {
      setVisibleItems((prev) => {
        // Calculate the next number of items to show
        const nextSliceEnd = (page + 1) * ITEMS_PER_LOAD;
        // Slice from the pre-filtered/processed items (processedItems)
        // This ensures we always slice from the correct, currently filtered list.
        const next = processedItems.slice(0, nextSliceEnd);
        return next;
      });
      setPage((p) => p + 1);
      setLoadingMore(false);
    }, 500); // Simulate network delay
  }, [page, processedItems]); // Dependencies: page for correct slicing, processedItems for the data source

  // Effect for infinite scrolling.
  useEffect(() => {
    const onScroll = () => {
      // Check if user is near the bottom of the page
      if (
        window.innerHeight + window.scrollY >=
        document.documentElement.scrollHeight - 100 && // Near bottom of the scrollable area
        !loadingMore && // Not already loading more data
        visibleItems.length < processedItems.length // There are more items to load
      ) {
        loadMore();
      }
    };

    window.addEventListener('scroll', onScroll);
    return () => window.removeEventListener('scroll', onScroll);
  }, [loadMore, loadingMore, visibleItems.length, processedItems.length]); // Dependencies for scroll listener

  return (
    <div className="container mt-4">
      <FilterBar />
      <div className="row g-3">
        {/* Render visible items */}
        {visibleItems.map((item) => (
          <div key={item.id} className="col-12 col-sm-6 col-md-4 col-lg-3">
            <ContentCard item={item} />
          </div>
        ))}

        {/* Show skeletons when loading more */}
        {loadingMore && processedItems.length > visibleItems.length && // Only show skeletons if there are more items to load
          Array(ITEMS_PER_LOAD)
            .fill(0)
            .map((_, i) => (
              <div key={`skeleton-${i}`} className="col-12 col-sm-6 col-md-4 col-lg-3">
                <ContentSkeleton />
              </div>
            ))}
      </div>
      {/* Optional: Add status indicators at the bottom */}
      {loadingMore && (
         <div className="text-center my-3">Loading more items...</div>
      )}
      {!loadingMore && visibleItems.length >= processedItems.length && processedItems.length > 0 && (
        <div className="text-center my-3 text-muted">No more items to load.</div>
      )}
      {!loadingMore && processedItems.length === 0 && allItems.length > 0 && (
         <div className="text-center my-3 text-muted">No items match your current filters.</div>
      )}
      {!loadingMore && allItems.length === 0 && (dispatch(fetchData()), // Re-fetch if allItems is empty
         <div className="text-center my-3 text-muted">Loading initial data...</div>
      )}
    </div>
  );
};

export default Home;