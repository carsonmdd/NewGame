import { useRouter } from 'expo-router';
import React, { useMemo } from 'react';
import { useHits, UseHitsProps } from 'react-instantsearch-core';
import { Text, View } from 'react-native';

import { ResourceCard } from '@/components/ResourceCard';
import { Resource } from '@/types/resource';
import { getSearchSortMode } from '@/lib/searchSort';

export function AlgoliaHits(props: UseHitsProps<Resource>) {
	const { hits } = useHits(props);
	const router = useRouter();

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
			<Text className="text-white/65 text-[13px] mb-2">
				No resources found.
			</Text>
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
