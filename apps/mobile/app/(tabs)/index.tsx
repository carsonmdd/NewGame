import React, { useEffect, useState } from 'react';
import {
	Alert,
	ScrollView,
	StyleSheet,
	Text,
	TouchableOpacity,
	View,
} from 'react-native';

import { resourceApi } from '@/lib/api';
import { Resource } from '@/types/resource';

export default function HomeScreen() {
	const [trending, setTrending] = useState<Resource[]>([]);
	const [latest, setLatest] = useState<Resource[]>([]);
	const [loading, setLoading] = useState(true);
	const [error, setError] = useState('');

	const loadResources = async () => {
		try {
			setLoading(true);
			setError('');
			const response = await resourceApi.discover();
			setTrending(response.data.trending);
			setLatest(response.data.new);
		} catch {
			setError('Failed to load resources.');
		} finally {
			setLoading(false);
		}
	};

	useEffect(() => {
		loadResources();
	}, []);

	const handlePress = (item: Resource) => {
		// TODO: replace this Alert with navigation to your detail screen if desired
		Alert.alert(item.title, item.description);
	};

	return (
		<View style={styles.container}>
			<ScrollView
				contentContainerStyle={styles.scrollContent}
				showsVerticalScrollIndicator={false}
			>
				{/* Big heading */}
				<Text style={styles.bigTitle}>Home</Text>

				<View style={styles.sectionLabel}>
					<Text style={styles.screenLabel}>Trending</Text>
				</View>

				{loading && trending.length === 0 ? (
					<Text style={styles.subtleText}>Loading resources…</Text>
				) : trending.length === 0 ? (
					<Text style={styles.subtleText}>No resources found.</Text>
				) : (
					<View style={styles.grid}>
						{trending.map((item) => (
							<TouchableOpacity
								key={item.id}
								style={styles.card}
								activeOpacity={0.7}
								onPress={() => handlePress(item)}
							>
								<Text
									style={styles.cardTitle}
									numberOfLines={2}
								>
									{item.title}
								</Text>
							</TouchableOpacity>
						))}
					</View>
				)}

				{/* Guides Selection */}
				<View style={styles.sectionLabel}>
					<Text style={styles.screenLabel}>Latest</Text>
				</View>

				{loading && latest.length === 0 ? (
					<Text style={styles.subtleText}>Loading resources…</Text>
				) : latest.length === 0 ? (
					<Text style={styles.subtleText}>No resources found.</Text>
				) : (
					<View style={styles.grid}>
						{latest.map((item) => (
							<TouchableOpacity
								key={item.id}
								style={styles.card}
								activeOpacity={0.7}
								onPress={() => handlePress(item)}
							>
								<Text
									style={styles.cardTitle}
									numberOfLines={2}
								>
									{item.title}
								</Text>
							</TouchableOpacity>
						))}
					</View>
				)}
			</ScrollView>
		</View>
	);
}

const PURPLE = '#8C4D93';
const BG = '#050509';

const styles = StyleSheet.create({
	container: {
		flex: 1,
		backgroundColor: BG,
	},
	scrollContent: {
		paddingHorizontal: 20,
		paddingTop: 16,
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
	menuButton: {
		padding: 6,
	},
	menuLine: {
		height: 2,
		width: 18,
		backgroundColor: '#F9FAFB',
		marginVertical: 2,
		borderRadius: 999,
	},

	// Heading + search
	bigTitle: {
		color: '#F9FAFB',
		fontSize: 24,
		fontWeight: '700',
		marginBottom: 16,
	},
	searchBar: {
		flexDirection: 'row',
		alignItems: 'center',
		backgroundColor: PURPLE,
		borderRadius: 999,
		paddingHorizontal: 14,
		paddingVertical: 8,
		marginBottom: 24,
	},
	searchIcon: {
		marginRight: 8,
	},
	searchInput: {
		flex: 1,
		color: '#F9FAFB',
		fontSize: 14,
	},

	// Sections
	sectionLabel: {
		color: '#E5E7EB',
		fontSize: 14,
		fontWeight: '600',
		marginBottom: 8,
	},
	sectionSpacing: {
		marginTop: 24,
	},
	subtleText: {
		color: '#9CA3AF',
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
		backgroundColor: PURPLE,
		borderRadius: 18,
		padding: 12,
		marginBottom: 14,
		width: '100%', // two columns
		justifyContent: 'center',
		alignItems: 'center',
		minHeight: 80,
	},
	cardTitle: {
		color: '#F9FAFB',
		fontSize: 14,
		fontWeight: '600',
		textAlign: 'center',
	},
});
