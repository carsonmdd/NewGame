import { Ionicons } from '@expo/vector-icons';
import React from 'react';
import {
	ScrollView,
	StyleSheet,
	Text,
	TouchableOpacity,
	View,
} from 'react-native';
import { router } from 'expo-router';
import {
	useRefinementList,
	useSortBy,
	useClearRefinements,
} from 'react-instantsearch-core';
import { INDEX_NAME } from '@/lib/algolia';

/**
 * Filter screen
 * - Shared state with the Search tab via InstantSearch in root layout
 */

export default function FilterScreen() {
	// Sort by integration
	const {
		options,
		refine: refineSort,
		currentRefinement,
	} = useSortBy({
		items: [
			{ label: 'Most Recent', value: INDEX_NAME },
			{ label: 'Relevant', value: `${INDEX_NAME}_relevant` }, // Example replica indices
			{ label: 'Most Viewed', value: `${INDEX_NAME}_viewed` },
		],
	});

	// Refinement Lists
	const { items: typeItems, refine: refineType } = useRefinementList({
		attribute: 'fileType',
	});

	const { items: categoryItems, refine: refineCategory } = useRefinementList({
		attribute: 'category',
	});

	const { refine: clearRefinements } = useClearRefinements();

	const clearAll = () => {
		clearRefinements();
		refineSort(INDEX_NAME);
	};

	const applyAndClose = () => {
		router.back();
	};

	return (
		<View style={styles.container}>
			{/* Header */}
			<View style={styles.header}>
				<Text style={styles.headerTitle}>Filter Results</Text>
				<TouchableOpacity
					accessibilityRole="button"
					accessibilityLabel="Close filters"
					onPress={() => router.back()}
					style={styles.closeBtn}
					activeOpacity={0.7}
				>
					<Ionicons name="close" size={20} color="#F9FAFB" />
				</TouchableOpacity>
			</View>

			<ScrollView
				contentContainerStyle={styles.content}
				showsVerticalScrollIndicator={false}
			>
				{/* Sort by */}
				<Text style={styles.sectionTitle}>Sort by</Text>
				<View style={styles.sectionBox}>
					{options.map((option) => (
						<RadioRow
							key={option.value}
							label={option.label}
							selected={currentRefinement === option.value}
							onPress={() => refineSort(option.value)}
						/>
					))}
				</View>

				{/* Filter by */}
				<Text style={[styles.sectionTitle, { marginTop: 18 }]}>
					Filter by
				</Text>

				{/* Type (Algolia fileType attribute) */}
				<Text style={styles.subSectionTitle}>Type</Text>
				<View style={styles.sectionBox}>
					{['Document', 'Video', 'Audio', 'Other'].map((label) => {
						const item = typeItems.find((i) => i.label === label);
						return (
							<CheckboxRow
								key={label}
								label={label}
								checked={item?.isRefined || false}
								onPress={() => refineType(label)}
							/>
						);
					})}
				</View>

				{/* Category (Algolia category attribute) */}
				<Text style={[styles.subSectionTitle, { marginTop: 14 }]}>
					Category
				</Text>
				<View style={styles.sectionBox}>
					{[
						'Development Tools/Tech',
						'Education & Career',
						'Business',
						'Industry Insights',
					].map((label) => {
						const item = categoryItems.find(
							(i) => i.label === label,
						);
						return (
							<CheckboxRow
								key={label}
								label={label}
								checked={item?.isRefined || false}
								onPress={() => refineCategory(label)}
							/>
						);
					})}
				</View>

				{/* Bottom buttons */}
				<View style={styles.footerBtns}>
					<TouchableOpacity
						activeOpacity={0.7}
						style={[styles.btn, styles.btnOutline]}
						onPress={clearAll}
					>
						<Text style={styles.btnText}>Clear Filters</Text>
					</TouchableOpacity>

					<TouchableOpacity
						activeOpacity={0.7}
						style={[styles.btn, styles.btnSolid]}
						onPress={applyAndClose}
					>
						<Text style={[styles.btnText, { color: '#0B0B10' }]}>
							Apply
						</Text>
					</TouchableOpacity>
				</View>
			</ScrollView>
		</View>
	);
}

/** Multi-select row */
function CheckboxRow({
	label,
	checked = false,
	onPress,
}: {
	label: string;
	checked?: boolean;
	onPress: () => void;
}) {
	return (
		<TouchableOpacity
			style={styles.row}
			activeOpacity={0.7}
			onPress={onPress}
		>
			<Text style={styles.rowLabel}>{label}</Text>
			<Ionicons
				name={checked ? 'checkbox' : 'square-outline'}
				size={18}
				color={checked ? '#F9FAFB' : '#9CA3AF'}
			/>
		</TouchableOpacity>
	);
}

/** Single-select row (radio) */
function RadioRow({
	label,
	selected = false,
	onPress,
}: {
	label: string;
	selected?: boolean;
	onPress: () => void;
}) {
	return (
		<TouchableOpacity
			style={styles.row}
			activeOpacity={0.7}
			onPress={onPress}
		>
			<Text style={styles.rowLabel}>{label}</Text>
			<Ionicons
				name={selected ? 'radio-button-on' : 'radio-button-off'}
				size={18}
				color={selected ? '#F9FAFB' : '#9CA3AF'}
			/>
		</TouchableOpacity>
	);
}

const BG = '#050509';
const CARD = '#0F0F14';
const BORDER = '#2B2B36';

const styles = StyleSheet.create({
	container: {
		flex: 1,
		backgroundColor: BG,
	},
	header: {
		paddingTop: 14,
		paddingHorizontal: 16,
		paddingBottom: 10,
		flexDirection: 'row',
		alignItems: 'center',
		justifyContent: 'space-between',
		borderBottomWidth: StyleSheet.hairlineWidth,
		borderBottomColor: BORDER,
	},
	headerTitle: {
		color: '#F9FAFB',
		fontSize: 16,
		fontWeight: '700',
	},
	closeBtn: {
		padding: 8,
		borderRadius: 999,
	},
	content: {
		padding: 16,
		paddingBottom: 24,
	},
	sectionTitle: {
		color: '#F9FAFB',
		fontSize: 14,
		fontWeight: '700',
		marginBottom: 10,
	},
	subSectionTitle: {
		color: '#E5E7EB',
		fontSize: 13,
		fontWeight: '700',
		marginBottom: 8,
	},
	sectionBox: {
		backgroundColor: CARD,
		borderRadius: 12,
		borderWidth: 1,
		borderColor: BORDER,
		paddingHorizontal: 12,
		paddingVertical: 10,
	},
	row: {
		flexDirection: 'row',
		alignItems: 'center',
		justifyContent: 'space-between',
		paddingVertical: 8,
	},
	rowLabel: {
		color: '#E5E7EB',
		fontSize: 13,
	},
	footerBtns: {
		flexDirection: 'row',
		gap: 10,
		marginTop: 18,
	},
	btn: {
		flex: 1,
		height: 40,
		borderRadius: 999,
		alignItems: 'center',
		justifyContent: 'center',
	},
	btnOutline: {
		borderWidth: 1,
		borderColor: '#F9FAFB',
		backgroundColor: 'transparent',
	},
	btnSolid: {
		backgroundColor: '#F9FAFB',
	},
	btnText: {
		color: '#F9FAFB',
		fontSize: 13,
		fontWeight: '700',
	},
});
