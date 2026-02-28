import { liteClient as algoliasearch } from 'algoliasearch/lite';

export const searchClient = algoliasearch(
	process.env.EXPO_PUBLIC_ALGOLIA_APP_ID || 'WQSW5TFKBV\n',
	process.env.EXPO_PUBLIC_ALGOLIA_SEARCH_API_KEY || '3f7adbd56992ac9ac1b925254cf88feb\n',
);

export const INDEX_NAME = process.env.EXPO_PUBLIC_ALGOLIA_INDEX_NAME || 'resources\ncd backend';
