import React from 'react';
import {
	FlatList,
	StyleSheet,
	Text,
	TouchableOpacity,
	View,
} from 'react-native';
import { useRouter } from 'expo-router';

const latestData = [
	{ id: '1', title: 'Popular for New Developers' },
	{ id: '2', title: 'System Architecture Basics' },
	{ id: '3', title: 'Learn CSV and Data Files' },
	{ id: '4', title: 'Intro to App Design' },
];

export default function LatestScreen() {
	const router = useRouter();

	return (
		<View style={styles.container}>
			<View style={styles.header}>
				<TouchableOpacity onPress={() => router.back()}>
					<Text style={styles.backText}>Back</Text>
				</TouchableOpacity>

				<Text style={styles.title}>Latest</Text>

				<View style={{ width: 40 }} />
			</View>

			<FlatList
				data={latestData}
				keyExtractor={(item) => item.id}
				contentContainerStyle={styles.listContent}
				renderItem={({ item }) => (
					<View style={styles.card}>
						<View style={styles.placeholder} />
						<View style={styles.overlay}>
							<Text style={styles.cardTitle}>{item.title}</Text>
						</View>
					</View>
				)}
			/>
		</View>
	);
}

const styles = StyleSheet.create({
	container: {
		flex: 1,
		backgroundColor: '#0A0A0A',
	},
	header: {
		paddingTop: 18,
		paddingHorizontal: 20,
		paddingBottom: 16,
		flexDirection: 'row',
		justifyContent: 'space-between',
		alignItems: 'center',
	},
	backText: {
		color: '#FFFFFF',
		fontSize: 15,
	},
	title: {
		color: '#FFFFFF',
		fontSize: 20,
		fontWeight: '700',
	},
	listContent: {
		paddingHorizontal: 20,
		paddingBottom: 24,
	},
	card: {
		height: 185,
		borderRadius: 20,
		backgroundColor: '#161616',
		marginBottom: 16,
		overflow: 'hidden',
	},
	placeholder: {
		...StyleSheet.absoluteFillObject,
		backgroundColor: '#2B2B2B',
	},
	overlay: {
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