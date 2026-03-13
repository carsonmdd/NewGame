import { Search, SlidersHorizontal } from 'lucide-react-native';
import React, { useState, useRef, useMemo } from 'react';
import { TextInput, View, TouchableOpacity } from 'react-native';
import {
	useSearchBox,
	UseSearchBoxProps,
	useCurrentRefinements,
} from 'react-instantsearch-core';
import { router } from 'expo-router';

export function AlgoliaSearchBox(props: UseSearchBoxProps) {
	const { query, refine } = useSearchBox(props);
	const [inputValue, setInputValue] = useState(query);
	const inputRef = useRef<TextInput>(null);

	const { items } = useCurrentRefinements();

	const hasActiveFilters = useMemo(() => {
		return items.some(
			(group) =>
				(group.attribute === 'resourceType' ||
					group.attribute === 'difficulty') &&
				group.refinements.length > 0,
		);
	}, [items]);

	function setQuery(newQuery: string) {
		setInputValue(newQuery);
		refine(newQuery);
	}

	return (
		<View className="flex-row items-center bg-surface rounded-xl px-4 h-12 mb-6 border border-white/10">
			<View className="mr-3">
				<Search size={18} color="#8A8F98" />
			</View>
			<TextInput
				ref={inputRef}
				className="flex-1 text-foreground text-base font-medium outline-none"
				placeholder="Search resources..."
				placeholderTextColor="#8A8F98"
				value={inputValue}
				onChangeText={setQuery}
				clearButtonMode="while-editing"
				autoCapitalize="none"
				autoCorrect={false}
				spellCheck={false}
				returnKeyType="search"
			/>

			<TouchableOpacity
				accessibilityRole="button"
				accessibilityLabel="Open filters"
				activeOpacity={0.7}
				className={`ml-2 w-8 h-8 items-center justify-center rounded-lg ${hasActiveFilters ? 'bg-accent' : 'bg-white/5 border border-white/10'}`}
				onPress={() => router.push('../filter')}
			>
				<SlidersHorizontal
					size={16}
					color={hasActiveFilters ? 'white' : '#8A8F98'}
				/>
			</TouchableOpacity>
		</View>
	);
}
