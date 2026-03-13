import React, { useMemo } from 'react';
import { useHits, UseHitsProps } from 'react-instantsearch-core';
import { View } from 'react-native';

import { ResourceCard } from '@/components/ResourceCard';
import { Resource } from '@/types/resource';
import { getSearchSortMode } from '@/lib/searchSort';
import { CustomText } from './CustomText';

export function AlgoliaHits(props: UseHitsProps<Resource>) {
	const { hits } = useHits(props);

	const visibleHits = useMemo(() => {
		const sortMode = getSearchSortMode();

		if (sortMode !== 'recent') {
			return hits;
		}

		return [...hits].sort((a, b) => {
			const aTime = Date.parse(a.date || a.createdAt || '');
			const bTime = Date.parse(b.date || b.createdAt || '');

			const safeATime = Number.isNaN(aTime) ? 0 : aTime;
			const safeBTime = Number.isNaN(bTime) ? 0 : bTime;

			return safeBTime - safeATime;
		});
	}, [hits]);

	if (visibleHits.length === 0) {
		return (
			<CustomText
				variant="body"
				className="text-foreground-muted text-sm mb-4"
			>
				No resources found.
			</CustomText>
		);
	}

	return (
		<View className="flex-row flex-wrap justify-between">
			{visibleHits.map((item) => (
				<ResourceCard key={item.id} item={item} />
			))}
		</View>
	);
}
