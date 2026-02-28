import React from 'react';
import {
	ScrollView,
	StyleSheet,
	Text,
	TouchableOpacity,
	View,
} from 'react-native';
import { useRouter } from 'expo-router';

const trendingData = [
	{ id: '1', title: 'How Gamers Start Your First Coding Lesson' },
	{ id: '2', title: 'Popular for New Developers' },
];

const latestData = [
	{ id: '3', title: 'Learn CSV and Data Files' },
	{ id: '4', title: 'System Architecture Basics' },
];

export default function HomeScreen() {
	const router = useRouter();

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
						<TouchableOpacity onPress={() => router.push('/trending')}>
							<Text style={styles.sectionLink}>See all</Text>
						</TouchableOpacity>
					</View>

					{trendingData.map((item) => (
						<TouchableOpacity
							key={item.id}
							activeOpacity={0.85}
							style={styles.resourceCard}
							onPress={() => router.push('/trending')}
						>
							<View style={styles.imagePlaceholder} />
							<View style={styles.cardOverlay}>
								<Text style={styles.cardTitle} numberOfLines={2}>
									{item.title}
								</Text>
							</View>
						</TouchableOpacity>
					))}
				</View>

				<View style={styles.section}>
					<View style={styles.sectionHeader}>
						<Text style={styles.sectionTitle}>Latest</Text>
						<TouchableOpacity onPress={() => router.push('/latest')}>
							<Text style={styles.sectionLink}>See all</Text>
						</TouchableOpacity>
					</View>

					{latestData.map((item) => (
						<TouchableOpacity
							key={item.id}
							activeOpacity={0.85}
							style={styles.resourceCard}
							onPress={() => router.push('/latest')}
						>
							<View style={styles.imagePlaceholder} />
							<View style={styles.cardOverlay}>
								<Text style={styles.cardTitle} numberOfLines={2}>
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
