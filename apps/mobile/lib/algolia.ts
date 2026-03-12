import { liteClient as algoliasearch } from 'algoliasearch/lite';

export const searchClient = algoliasearch(
	process.env.EXPO_PUBLIC_ALGOLIA_APP_ID || '',
	process.env.EXPO_PUBLIC_ALGOLIA_SEARCH_API_KEY || '',
);

export const INDEX_NAME = process.env.EXPO_PUBLIC_ALGOLIA_INDEX_NAME || 'resources';