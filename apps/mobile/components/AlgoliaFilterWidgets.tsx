import React from 'react';
import { useRefinementList } from 'react-instantsearch-core';

/**
 * Filter widgets keep refinement state alive even when the filter modal unmounts.
 * They render nothing, but register the attributes with InstantSearch.
 */

export function AlgoliaFilterWidgets() {
  useRefinementList({ attribute: 'keywords' });

  return null;
}