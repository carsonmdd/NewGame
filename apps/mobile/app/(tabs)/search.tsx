import { Ionicons } from '@expo/vector-icons';
import React from 'react';
import { ScrollView, StyleSheet, Text, View } from 'react-native';

import { AlgoliaSearchBox } from '@/components/AlgoliaSearchBox';
import { AlgoliaHits } from '@/components/AlgoliaHits';

import { AlgoliaFilterWidgets } from '@/components/AlgoliaFilterWidgets';

export default function SearchScreen() {
	return (
		<View style={styles.container}>

			{/* Keep Filters Updated */}
			<AlgoliaFilterWidgets />

			<ScrollView
				contentContainerStyle={styles.scrollContent}
				showsVerticalScrollIndicator={false}
			>
				{/* Top bar: big Search + avatar */}
				<View style={styles.topBar}>
					<Text style={styles.screenLabel}>Search</Text>

					<View style={styles.avatarCircle}>
						<Ionicons name="person" size={18} color="#111" />
					</View>
				</View>

				{/* Search bar with Algolia */}
				<AlgoliaSearchBox />

				{/* Algolia Results */}
				<AlgoliaHits />
			</ScrollView>
		</View>
	);
}

const BG = '#0B0B0F';
const CARD = '#17133A';

const styles = StyleSheet.create({
	container: {
		flex: 1,
		backgroundColor: BG,
	},
	scrollContent: {
		paddingHorizontal: 16,
		paddingTop: 12,
		paddingBottom: 32,
	},

	// Top bar
	topBar: {
		flexDirection: 'row',
		justifyContent: 'space-between',
		alignItems: 'center',
		marginBottom: 12,
	},
	screenLabel: {
		color: '#FFFFFF',
		fontSize: 34,
		fontWeight: '900',
	},
	avatarCircle: {
		width: 36,
		height: 36,
		borderRadius: 18,
		backgroundColor: '#E9F1FF',
		alignItems: 'center',
		justifyContent: 'center',
	},

	// Sections
	sectionLabel: {
		color: 'rgba(255,255,255,0.75)',
		fontSize: 13,
		fontWeight: '800',
		marginBottom: 10,
		textTransform: 'uppercase',
		letterSpacing: 0.6,
	},
	sectionSpacing: {
		marginTop: 18,
	},
	subtleText: {
		color: 'rgba(255,255,255,0.65)',
		fontSize: 13,
		marginBottom: 8,
	},

	// Grid of cards
	grid: {
		flexDirection: 'row',
		flexWrap: 'wrap',
		justifyContent: 'space-between',
	},
	card: {
		backgroundColor: CARD,
		borderRadius: 18,
		padding: 12,
		marginBottom: 14,
		width: '48%',
		minHeight: 160,
		justifyContent: 'flex-end',
	},
	cardTitle: {
		color: '#FFFFFF',
		fontSize: 16,
		fontWeight: '900',
		lineHeight: 20,
	},
});
