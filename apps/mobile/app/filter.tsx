import { Ionicons } from '@expo/vector-icons';
import React, { useMemo, useState } from 'react';
import {
	ScrollView,
	Text,
	TouchableOpacity,
	View,
} from 'react-native';
import {
	useClearRefinements,
	useCurrentRefinements,
	useRefinementList,
	useStats,
} from 'react-instantsearch-core';
import { useNavigation } from '@react-navigation/native';
import { getSearchSortMode, setSearchSortMode } from '@/lib/searchSort';

const TEXT = '#F9FAFB';
const MUTED = '#9CA3AF';

const SORT_ITEMS = [
	{ label: 'Relevant', value: 'relevant' as const },
	{ label: 'Most Recent', value: 'recent' as const },
];

export default function FilterScreen() {
	const [currentSort, setCurrentSort] = useState<'relevant' | 'recent'>(
		getSearchSortMode(),
	);

	const keywords = useRefinementList({
		attribute: 'keywords',
		limit: 20,
		sortBy: ['count:desc', 'name:asc'],
	});

	const { canRefine: canClear, refine: clear } = useClearRefinements();
	const { items: currentRefinements } = useCurrentRefinements();
	const { nbHits } = useStats();

	const hasActiveSort = currentSort !== 'relevant';
	const canClearAnything = canClear || hasActiveSort;

	const totalRefinements = useMemo(
		() =>
			currentRefinements.reduce(
				(acc, g) => acc + g.refinements.length,
				0,
			),
		[currentRefinements],
	);

	const clearAll = () => {
		clear();
		setCurrentSort('relevant');
		setSearchSortMode('relevant');
	};

	const navigation = useNavigation();

	const seeResults = () => navigation.goBack();

	return (
		<View className="flex-1 bg-[#050509]">
			{/* Header */}
			<View className="px-4 pb-2.5 flex-row items-center justify-between border-b border-[#2B2B36]">
				<Text className="text-[#F9FAFB] text-[28px] leading-[34px] font-extrabold">Filters</Text>
				{totalRefinements > 0 ? (
					<View className="min-w-[24px] h-6 px-2 rounded-full bg-[#252b33] items-center justify-center">
						<Text className="text-white font-extrabold text-[12px]">{totalRefinements}</Text>
					</View>
				) : null}
			</View>

			<ScrollView
				contentContainerClassName="px-4 pt-4 pb-7"
				showsVerticalScrollIndicator={false}
			>
				{/* Sort by */}
				<Text className="text-[#F9FAFB] text-[17px] leading-[22px] font-bold mb-2.5">Sort by</Text>
				<View className="bg-[#0F0F14] rounded-2xl border border-[#2B2B36] px-3 py-2.5">
					{SORT_ITEMS.map((o) => (
						<Row
							key={o.value}
							label={o.label}
							selected={currentSort === o.value}
							onPress={() => {
								setCurrentSort(o.value);
								setSearchSortMode(o.value);
							}}
							variant="radio"
						/>
					))}
				</View>

				{/* Filter by */}
				<Text className="text-[#F9FAFB] text-[17px] leading-[22px] font-bold mb-2.5 mt-4.5">
					Filter by
				</Text>

				{/* Keywords */}
				<Text className="text-[#E5E7EB] text-[15px] leading-[20px] font-bold mb-2">Keywords</Text>
				<View className="bg-[#0F0F14] rounded-2xl border border-[#2B2B36] px-3 py-2.5">
					{keywords.items.length === 0 ? (
						<Text className="text-white/55 text-[13px] leading-[18px] py-1.5">No keywords found.</Text>
					) : (
						keywords.items.map((item) => (
							<Row
								key={item.value}
								label={item.label}
								selected={!!item.isRefined}
								rightText={
									typeof item.count === 'number'
										? String(item.count)
										: undefined
								}
								onPress={() => keywords.refine(item.value)}
								variant="checkbox"
							/>
						))
					)}
				</View>

				{/* Bottom buttons */}
				<View className="flex-row gap-2.5 mt-[22px]">
					<TouchableOpacity
						activeOpacity={0.8}
						className={`flex-1 h-11 rounded-full items-center justify-center border border-[#F9FAFB] bg-transparent ${!canClearAnything ? 'opacity-35' : ''}`}
						onPress={clearAll}
						disabled={!canClearAnything}
					>
						<Text className="text-[#F9FAFB] text-[15px] leading-[20px] font-bold">Clear all</Text>
					</TouchableOpacity>

					<TouchableOpacity
						activeOpacity={0.8}
						className="flex-1 h-11 rounded-full items-center justify-center bg-[#F9FAFB]"
						onPress={seeResults}
					>
						<Text className="text-[15px] leading-[20px] font-bold text-[#0B0B10]">
							See results
							{typeof nbHits === 'number' ? ` (${nbHits})` : ''}
						</Text>
					</TouchableOpacity>
				</View>
			</ScrollView>
		</View>
	);
}

function Row({
	label,
	selected,
	rightText,
	onPress,
	variant,
}: {
	label: string;
	selected: boolean;
	rightText?: string;
	onPress: () => void;
	variant: 'checkbox' | 'radio';
}) {
	const iconName =
		variant === 'checkbox'
			? selected
				? 'checkbox'
				: 'square-outline'
			: selected
				? 'radio-button-on'
				: 'radio-button-off';

	return (
		<TouchableOpacity
			className={`min-h-[44px] flex-row items-center justify-between py-2.5 px-2 rounded-xl ${selected ? 'bg-white/8' : ''}`}
			activeOpacity={0.7}
			onPress={onPress}
		>
			<Text
				className={`text-[#E5E7EB] text-[17px] leading-[22px] ${selected ? 'font-bold text-[#F9FAFB]' : 'font-medium'}`}
			>
				{label}
			</Text>

			<View className="flex-row items-center gap-2 ml-2.5">
				{rightText ? (
					<View className="bg-[#252b33] rounded-full px-2 py-0.5">
						<Text className="text-white font-bold text-[12px]">{rightText}</Text>
					</View>
				) : null}

				<Ionicons
					name={iconName as any}
					size={18}
					color={selected ? TEXT : MUTED}
				/>
			</View>
		</TouchableOpacity>
	);
}
