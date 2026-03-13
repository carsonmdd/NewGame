import React from 'react';
import { ScrollView, View } from 'react-native';

import { AlgoliaSearchBox } from '@/components/AlgoliaSearchBox';
import { AlgoliaHits } from '@/components/AlgoliaHits';

import { AlgoliaFilterWidgets } from '@/components/AlgoliaFilterWidgets';
import {
	SafeAreaView,
	useSafeAreaInsets,
} from 'react-native-safe-area-context';
import { LinearBackground } from '@/components/ui/linear/LinearBackground';
import { LinearText } from '@/components/ui/linear/LinearText';

export default function SearchScreen() {
	const insets = useSafeAreaInsets();

	return (
		<LinearBackground>
			<SafeAreaView className="flex-1" edges={['left', 'right']}>
				<View className="flex-1" style={{ paddingTop: insets.top }}>
					{/* Keep Filters Updated */}
					<AlgoliaFilterWidgets />

					<ScrollView
						contentContainerClassName="px-6 pt-4 pb-20"
						showsVerticalScrollIndicator={false}
					>
						<View className="mb-6">
							<LinearText
								variant="label"
								className="text-accent tracking-[0.2em] mb-1"
							>
								RESOURCES
							</LinearText>
							<LinearText variant="h1">Search</LinearText>
						</View>

						{/* Search bar with Algolia */}
						<AlgoliaSearchBox />

						{/* Algolia Results */}
						<AlgoliaHits />
					</ScrollView>
				</View>
			</SafeAreaView>
		</LinearBackground>
	);
}
