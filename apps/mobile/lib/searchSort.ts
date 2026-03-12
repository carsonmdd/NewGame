let sortMode: 'relevant' | 'recent' = 'relevant';

export function setSearchSortMode(mode: 'relevant' | 'recent') {
  sortMode = mode;
}

export function getSearchSortMode() {
  return sortMode;
}