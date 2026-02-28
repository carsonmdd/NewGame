import React from 'react';
import {
	DarkTheme,
	DefaultTheme,
	ThemeProvider,
} from '@react-navigation/native';
import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import 'react-native-reanimated';
import { useColorScheme } from '@/hooks/use-color-scheme';
import { searchClient, INDEX_NAME } from '@/lib/algolia';
import { InstantSearch } from 'react-instantsearch-core';

export const unstable_settings = {
	anchor: '(tabs)',
};

export default function RootLayout() {
	const colorScheme = useColorScheme();

	return (
		<ThemeProvider
			value={colorScheme === 'dark' ? DarkTheme : DefaultTheme}
		>
			<InstantSearch searchClient={searchClient} indexName={INDEX_NAME}>
				<Stack>
					<Stack.Screen
						name="(tabs)"
						options={{ headerShown: false }}
					/>

					{/* Search-only filter screen (opened from the Search tab) */}
					<Stack.Screen
						name="filter"
						options={{ presentation: 'modal', headerShown: false }}
					/>

					<Stack.Screen
						name="modal"
						options={{ presentation: 'modal', title: 'Modal' }}
					/>
				</Stack>
			</InstantSearch>
			<StatusBar style="auto" />
		</ThemeProvider>
	);
}
