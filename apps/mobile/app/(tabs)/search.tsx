import React from 'react';
import { ScrollView, Text, View } from 'react-native';

import { AlgoliaSearchBox } from '@/components/AlgoliaSearchBox';
import { AlgoliaHits } from '@/components/AlgoliaHits';

import { AlgoliaFilterWidgets } from '@/components/AlgoliaFilterWidgets';
import {
	SafeAreaView,
	useSafeAreaInsets,
} from 'react-native-safe-area-context';

export default function SearchScreen() {
	const insets = useSafeAreaInsets();

	return (
		<SafeAreaView className="flex-1 bg-[#0B0B0F]" edges={['left', 'right']}>
			<View className="flex-1 bg-[#0B0B0F]" style={{ paddingTop: insets.top }}>
				{/* Keep Filters Updated */}
				<AlgoliaFilterWidgets />

				<ScrollView
					contentContainerClassName="px-4 pt-2.5 pb-8"
					showsVerticalScrollIndicator={false}
				>
					<View className="flex-row justify-between items-center mb-3">
						<Text className="text-white text-[34px] font-black">Search</Text>
					</View>

					{/* Search bar with Algolia */}
					<AlgoliaSearchBox />

					{/* Algolia Results */}
					<AlgoliaHits />
				</ScrollView>
			</View>
		</SafeAreaView>
	);
}
