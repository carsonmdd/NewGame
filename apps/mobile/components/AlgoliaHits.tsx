import React from 'react';
import { StyleSheet, Text, View, TouchableOpacity, Alert, Image} from 'react-native';
import { useHits, UseHitsProps } from 'react-instantsearch-core';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';

import { Resource } from '@/types/resource';
import { handleResourcePress } from '@/utils/resourceAction';
import { getKind, getStableId, isYouTubeUrl, getYouTubeThumb } from '@/utils/resourceRender';


export function AlgoliaHits(props: UseHitsProps<Resource>) {
	const { hits } = useHits(props);
  	const router = useRouter();

	const handlePress = (item: Resource) => {
		Alert.alert(item.title, item.description);
	};

	if (hits.length === 0) {
		return <Text style={styles.subtleText}>No resources found.</Text>;
	}

	return (
		<View style={styles.grid}>
		{hits.map((item) => {
			const kind = getKind(item);
			const key = getStableId(item);

			const thumb =
			kind === 'VIDEO' && item.url && isYouTubeUrl(item.url)
				? getYouTubeThumb(item.url)
				: null;

			return (
			<TouchableOpacity
				key={key}
				style={styles.card}
				activeOpacity={0.7}
				onPress={() => handleResourcePress(router, item)}
			>
				{thumb ? <Image source={{ uri: thumb }} style={styles.thumb} /> : null}

				<View style={styles.iconBadge}>
				{kind === 'IN_APP' && <Ionicons name="document-text" size={16} color="#fff" />}
				{kind === 'PDF' && <Ionicons name="document" size={16} color="#fff" />}
				{kind === 'AUDIO' && <Ionicons name="play" size={16} color="#fff" />}
				{kind === 'VIDEO' && <Ionicons name="logo-youtube" size={16} color="#fff" />}
				{kind === 'LINK' && <Ionicons name="open-outline" size={16} color="#fff" />}
				</View>

				<Text style={styles.cardTitle} numberOfLines={2}>
				{item.title}
				</Text>
			</TouchableOpacity>
			);
		})}
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
