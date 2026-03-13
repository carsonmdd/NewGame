import React from 'react';
import { ScrollView, View } from 'react-native';

import { AlgoliaSearchBox } from '@/components/AlgoliaSearchBox';
import { AlgoliaHits } from '@/components/AlgoliaHits';

import { AlgoliaFilterWidgets } from '@/components/AlgoliaFilterWidgets';
import {
	SafeAreaView,
	useSafeAreaInsets,
} from 'react-native-safe-area-context';
import { Background } from '@/components/Background';
import { CustomText } from '@/components/CustomText';

export default function SearchScreen() {
	const insets = useSafeAreaInsets();

	return (
		<Background>
			<SafeAreaView className="flex-1" edges={['left', 'right']}>
				<View className="flex-1" style={{ paddingTop: insets.top }}>
					{/* Keep Filters Updated */}
					<AlgoliaFilterWidgets />

					<ScrollView
						contentContainerClassName="px-6 pt-4 pb-20"
						showsVerticalScrollIndicator={false}
					>
						<View className="mb-6">
							<CustomText
								variant="label"
								className="text-accent tracking-[0.2em] mb-1"
							>
								RESOURCES
							</CustomText>
							<CustomText variant="h1">Search</CustomText>
						</View>

						{/* Search bar with Algolia */}
						<AlgoliaSearchBox />

						{/* Algolia Results */}
						<AlgoliaHits />
					</ScrollView>
				</View>
			</SafeAreaView>
		</Background>
	);
}
