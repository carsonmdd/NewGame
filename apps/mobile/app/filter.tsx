import { ChevronLeft, X, Check, Circle, Filter } from 'lucide-react-native';
import React, { useMemo, useState } from 'react';
import {
	ScrollView,
	TouchableOpacity,
	View,
} from 'react-native';
import {
	useClearRefinements,
	useCurrentRefinements,
	useRefinementList,
	useStats,
} from 'react-instantsearch-core';
import { useRouter } from 'expo-router';
import { getSearchSortMode, setSearchSortMode } from '@/lib/searchSort';
import { LinearBackground } from '@/components/ui/linear/LinearBackground';
import { LinearCard } from '@/components/ui/linear/LinearCard';
import { LinearText } from '@/components/ui/linear/LinearText';
import { LinearButton } from '@/components/ui/linear/LinearButton';
import { SafeAreaView } from 'react-native-safe-area-context';

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

	const router = useRouter();

	const seeResults = () => router.back();

	return (
		<LinearBackground>
			<SafeAreaView className="flex-1" edges={['top', 'left', 'right']}>
				{/* Header */}
				<View className="px-6 py-4 flex-row items-center justify-between">
					<View className="flex-row items-center">
						<View className="w-10 h-10 items-center justify-center rounded-xl bg-accent/10 border border-accent/20 mr-3">
							<Filter size={18} color="#5E6AD2" />
						</View>
						<LinearText variant="h2">Filters</LinearText>
					</View>
					
					<TouchableOpacity
						onPress={seeResults}
						className="w-10 h-10 items-center justify-center rounded-xl bg-white/5 border border-white/10"
					>
						<X size={20} color="white" />
					</TouchableOpacity>
				</View>

				<ScrollView
					contentContainerClassName="px-6 pt-2 pb-12"
					showsVerticalScrollIndicator={false}
				>
					{/* Sort by */}
					<View className="mb-8">
						<LinearText variant="label" className="text-foreground-subtle mb-4">Sort by</LinearText>
						<LinearCard intensity={10} containerClassName="p-2 bg-white/[0.02] border-white/5">
							{SORT_ITEMS.map((o, index) => (
								<Row
									key={o.value}
									label={o.label}
									selected={currentSort === o.value}
									onPress={() => {
										setCurrentSort(o.value);
										setSearchSortMode(o.value);
									}}
									variant="radio"
									isLast={index === SORT_ITEMS.length - 1}
								/>
							))}
						</LinearCard>
					</View>

					{/* Filter by */}
					<View className="mb-8">
						<LinearText variant="label" className="text-foreground-subtle mb-4">Keywords</LinearText>
						<LinearCard intensity={10} containerClassName="p-2 bg-white/[0.02] border-white/5">
							{keywords.items.length === 0 ? (
								<View className="p-4">
									<LinearText variant="body" className="text-foreground-muted text-sm">No keywords found.</LinearText>
								</View>
							) : (
								keywords.items.map((item, index) => (
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
										isLast={index === keywords.items.length - 1}
									/>
								))
							)}
						</LinearCard>
					</View>

					{/* Bottom buttons */}
					<View className="flex-row gap-4 mt-6">
						<LinearButton
							title="Clear all"
							onPress={clearAll}
							variant="secondary"
							style={{ flex: 1, opacity: canClearAnything ? 1 : 0.4 }}
							disabled={!canClearAnything}
						/>
						<LinearButton
							title={`Show ${nbHits || ''} Results`}
							onPress={seeResults}
							variant="primary"
							style={{ flex: 1.5 }}
						/>
					</View>
				</ScrollView>
			</SafeAreaView>
		</LinearBackground>
	);
}

function Row({
	label,
	selected,
	rightText,
	onPress,
	variant,
	isLast,
}: {
	label: string;
	selected: boolean;
	rightText?: string;
	onPress: () => void;
	variant: 'checkbox' | 'radio';
	isLast?: boolean;
}) {
	return (
		<TouchableOpacity
			className={`min-h-[52px] flex-row items-center justify-between px-4 rounded-xl ${selected ? 'bg-accent/10' : ''} ${!isLast ? 'mb-1' : ''}`}
			activeOpacity={0.7}
			onPress={onPress}
		>
			<LinearText
				variant="body"
				className={`text-base ${selected ? 'font-bold text-foreground' : 'font-medium text-foreground-muted'}`}
			>
				{label}
			</LinearText>

			<View className="flex-row items-center gap-3">
				{rightText ? (
					<View className="bg-white/5 border border-white/10 rounded-lg px-2 py-0.5">
						<LinearText variant="body" className="text-foreground-subtle text-[11px] font-bold">{rightText}</LinearText>
					</View>
				) : null}

				<View className={`w-5 h-5 rounded-md items-center justify-center border ${selected ? 'bg-accent border-accent' : 'border-white/20'}`}>
					{selected && (
						variant === 'checkbox' ? (
							<Check size={12} color="white" strokeWidth={3} />
						) : (
							<View className="w-2 h-2 rounded-full bg-white" />
						)
					)}
				</View>
			</View>
		</TouchableOpacity>
	);
}
