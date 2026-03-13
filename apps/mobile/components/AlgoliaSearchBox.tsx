import React, { useState, useRef, useMemo } from 'react';
import { TextInput, View, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
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
		<View className="flex-row items-center bg-white/10 rounded-full px-3.5 h-[44px] mb-4">
			<Ionicons
				name="search"
				size={18}
				color="#F9FAFB"
				className="mr-2.5"
			/>
			<TextInput
				ref={inputRef}
				className="flex-1 text-white text-[14px]"
				placeholder="Search for resources..."
				placeholderTextColor="#E5E7EB"
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
				className={`ml-2 p-1.5 rounded-full ${hasActiveFilters ? 'bg-[#F9FAFB]' : ''}`}
				onPress={() => router.push('../filter')}
			>
				<Ionicons
					name="options-outline"
					size={18}
					color={hasActiveFilters ? '#0B0B0F' : '#F9FAFB'}
				/>
			</TouchableOpacity>
		</View>
	);
}
