import { resourceApi } from '@/lib/api';
import { Resource } from '@/types/resource';
import React, { useEffect, useState } from 'react';
import {
	ScrollView,
	StyleSheet,
	Text,
	TouchableOpacity,
	View,
} from 'react-native';
import { useRouter } from 'expo-router';

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
		} catch (e) {
			setError('Failed to load resources.');
		} finally {
			setLoading(false);
		}
	};

	useEffect(() => {
		loadResources();
	}, []);

	return (
		<View style={styles.container}>
			<ScrollView
				showsVerticalScrollIndicator={false}
				contentContainerStyle={styles.scrollContent}
			>
				<View style={styles.headerRow}>
					<Text style={styles.homeTitle}>Home</Text>

					<View style={styles.avatar} />
				</View>

				<View style={styles.section}>
					<View style={styles.sectionHeader}>
						<Text style={styles.sectionTitle}>Trending</Text>
					</View>

					{trending.map((item) => (
						<TouchableOpacity
							key={item.id}
							activeOpacity={0.85}
							style={styles.resourceCard}
						>
							<View style={styles.imagePlaceholder} />
							<View style={styles.cardOverlay}>
								<Text
									style={styles.cardTitle}
									numberOfLines={2}
								>
									{item.title}
								</Text>
							</View>
						</TouchableOpacity>
					))}
				</View>

				<View style={styles.section}>
					<View style={styles.sectionHeader}>
						<Text style={styles.sectionTitle}>Latest</Text>
					</View>

					{latest.map((item) => (
						<TouchableOpacity
							key={item.id}
							activeOpacity={0.85}
							style={styles.resourceCard}
						>
							<View style={styles.imagePlaceholder} />
							<View style={styles.cardOverlay}>
								<Text
									style={styles.cardTitle}
									numberOfLines={2}
								>
									{item.title}
								</Text>
							</View>
						</TouchableOpacity>
					))}
				</View>
			</ScrollView>
		</View>
	);
}

const styles = StyleSheet.create({
	container: {
		flex: 1,
		backgroundColor: '#0A0A0A',
	},
	scrollContent: {
		paddingHorizontal: 20,
		paddingTop: 18,
		paddingBottom: 32,
	},
	headerRow: {
		flexDirection: 'row',
		justifyContent: 'space-between',
		alignItems: 'center',
		marginBottom: 20,
	},
	homeTitle: {
		color: '#FFFFFF',
		fontSize: 24,
		fontWeight: '700',
	},
	avatar: {
		width: 42,
		height: 42,
		borderRadius: 21,
		backgroundColor: '#D9D9D9',
	},
	section: {
		marginBottom: 24,
	},
	sectionHeader: {
		flexDirection: 'row',
		justifyContent: 'space-between',
		alignItems: 'center',
		marginBottom: 12,
	},
	sectionTitle: {
		color: '#FFFFFF',
		fontSize: 18,
		fontWeight: '700',
	},
	sectionLink: {
		color: '#BDBDBD',
		fontSize: 13,
		fontWeight: '500',
	},
	resourceCard: {
		height: 185,
		borderRadius: 20,
		backgroundColor: '#161616',
		marginBottom: 16,
		overflow: 'hidden',
		position: 'relative',
	},
	imagePlaceholder: {
		...StyleSheet.absoluteFillObject,
		backgroundColor: '#2B2B2B',
	},
	cardOverlay: {
		flex: 1,
		justifyContent: 'flex-end',
		paddingHorizontal: 18,
		paddingBottom: 18,
	},
	cardTitle: {
		color: '#FFFFFF',
		fontSize: 17,
		fontWeight: '700',
		lineHeight: 22,
	},
});
