import React from 'react';
import { StyleSheet, Text, View, TouchableOpacity, Alert } from 'react-native';
import { useHits, UseHitsProps } from 'react-instantsearch-core';
import { Resource } from '@/types/resource';

export function AlgoliaHits(props: UseHitsProps<Resource>) {
	const { hits } = useHits(props);

	const handlePress = (item: Resource) => {
		Alert.alert(item.title, item.description);
	};

	if (hits.length === 0) {
		return <Text style={styles.subtleText}>No resources found.</Text>;
	}

	return (
		<View style={styles.grid}>
			{hits.map((item) => (
				<TouchableOpacity
					key={item.id}
					style={styles.card}
					activeOpacity={0.7}
					onPress={() => handlePress(item)}
				>
					<Text style={styles.cardTitle} numberOfLines={2}>
						{item.title}
					</Text>
				</TouchableOpacity>
			))}
		</View>
	);
}

const CARD = '#17133A';

const styles = StyleSheet.create({
	subtleText: {
		color: 'rgba(255,255,255,0.65)',
		fontSize: 13,
		marginBottom: 8,
	},
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
