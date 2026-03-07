import { SavedResourcesProvider } from '@/contexts/SavedResourcesContext';
import { useColorScheme } from '@/hooks/use-color-scheme';
import { INDEX_NAME, searchClient } from '@/lib/algolia';
import {
	DarkTheme,
	DefaultTheme,
	ThemeProvider,
} from '@react-navigation/native';
import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import React from 'react';
import { InstantSearch } from 'react-instantsearch-core';
import 'react-native-reanimated';

export const unstable_settings = {
	anchor: '(tabs)',
};

export default function RootLayout() {
	const colorScheme = useColorScheme();

	return (
		<ThemeProvider
			value={colorScheme === 'dark' ? DarkTheme : DefaultTheme}
		>
			<InstantSearch searchClient={searchClient} indexName={INDEX_NAME} 
				future={{ preserveSharedStateOnUnmount: true }}
			>
				<SavedResourcesProvider>
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

					<Stack.Screen 
						name="resource/[id]" 
						options={{ headerShown: false }} 
					/>
				</Stack>
				</SavedResourcesProvider>
			</InstantSearch>
			<StatusBar style="auto" />
		</ThemeProvider>
	);
}
