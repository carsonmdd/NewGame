import { Ionicons } from '@expo/vector-icons';
import { Asset } from 'expo-asset';
import React, { useEffect, useMemo, useState } from 'react';
import {
	Alert,
	ScrollView,
	StyleSheet,
	Text,
	TextInput,
	TouchableOpacity,
	View,
} from 'react-native';

import { router } from 'expo-router';

import { RESOURCE_DEFS } from '@/constants/resources';

type Resource = {
	rid: number;
	fileType: string;
	title: string;
	content: string;
	description: string;
	date: string;
	creator: number;
	author: string;
};

export default function SearchScreen() {
	const [resources, setResources] = useState<Resource[]>([]);
	const [query, setQuery] = useState('');
	const [loading, setLoading] = useState(true);

	// Load all txt files from the manifest
	useEffect(() => {
		const loadResources = async () => {
			try {
				const loaded: Resource[] = [];

				for (const def of RESOURCE_DEFS) {
					loaded.push({
						rid: def.rid,
						fileType: def.fileType,
						title: def.title,
						content: def.content,
						description: def.description,
						date: def.date,
						creator: def.creator,
						author: def.author,
					});
				}

				setResources(loaded);
			} catch (err) {
				console.error('Failed to load resources:', err);
			} finally {
				setLoading(false);
			}
		};

		loadResources();
	}, []);

	const filtered = useMemo(() => {
		const q = query.trim().toLowerCase();
		if (!q) return resources;

		return resources.filter((r) => {
			return (
				r.title.toLowerCase().includes(q) ||
				r.content.toLowerCase().includes(q)
			);
		});
	}, [resources, query]);

	const recentlySaved = filtered.slice(-2);

	const handlePress = (item: Resource) => {
		Alert.alert(item.title, item.content);
	};

	return (
		<View style={styles.container}>
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

				{/* Search bar row */}
				<View style={styles.searchRow}>
					<View style={styles.searchBar}>
						<Ionicons
							name="search"
							size={18}
							color="rgba(255,255,255,0.85)"
							style={styles.searchIcon}
						/>
						<TextInput
							style={styles.searchInput}
							placeholder="Guides, videos, tutorials, and more"
							placeholderTextColor="rgba(255,255,255,0.55)"
							value={query}
							onChangeText={setQuery}
							returnKeyType="search"
						/>
					</View>

					<View style={styles.filterBtn}>
						<Ionicons
							name="options-outline"
							size={20}
							color="#111"
						/>
					</View>
				</View>

				{loading && filtered.length === 0 ? (
					<Text style={styles.subtleText}>Loading resources…</Text>
				) : filtered.length === 0 ? (
					<Text style={styles.subtleText}>No resources found.</Text>
				) : (
					<View style={styles.grid}>
						{filtered.map((item) => (
							<TouchableOpacity
								key={item.rid}
								style={styles.card}
								activeOpacity={0.85}
								onPress={() => handlePress(item)}
							>
								<Text
									style={styles.cardTitle}
									numberOfLines={3}
								>
									{item.title}
								</Text>
							</TouchableOpacity>
						))}
					</View>
				)}

        {/* Search bar */}
        <View style={styles.searchBar}>
          <Ionicons
            name="search"
            size={18}
            color="#F9FAFB"
            style={styles.searchIcon}
          />
          <TextInput
            style={styles.searchInput}
            placeholder="Search"
            placeholderTextColor="#E5E7EB"
            value={query}
            onChangeText={setQuery}
            returnKeyType="search"
          />

          {/*  Filter button (routes to /filter). */}
          <TouchableOpacity
            accessibilityRole="button"
            accessibilityLabel="Open filters"
            activeOpacity={0.7}
            style={styles.filterBtn}
            onPress={() => router.push('../filter')}
          >
            <Ionicons name="options-outline" size={18} color="#F9FAFB" />
          </TouchableOpacity>
        </View>

        {/* Search section */}
        {loading && filtered.length === 0 ? (
          <Text style={styles.subtleText}>Loading resources…</Text>
        ) : filtered.length === 0 ? (
          <Text style={styles.subtleText}>No resources found.</Text>
        ) : (
          <View style={styles.grid}>
            {filtered.map((item) => (
              <TouchableOpacity
                key={item.rid}
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
        )}

        {/* Recently Saved section */}
				{recentlySaved.length > 0 && (
					<>
						<Text
							style={[styles.sectionLabel, styles.sectionSpacing]}
						>
							Recently Saved
						</Text>
						<View style={styles.grid}>
							{recentlySaved.map((item) => (
								<TouchableOpacity
									key={`recent-${item.rid}`}
									style={styles.card}
									activeOpacity={0.85}
									onPress={() => handlePress(item)}
								>
									<Text
										style={styles.cardTitle}
										numberOfLines={3}
									>
										{item.title}
									</Text>
								</TouchableOpacity>
							))}
						</View>
					</>
				)}
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

	// Search row
	searchRow: {
		flexDirection: 'row',
		alignItems: 'center',
		gap: 10,
		marginBottom: 16,
	},
	searchBar: {
		flex: 1,
		flexDirection: 'row',
		alignItems: 'center',
		backgroundColor: 'rgba(255,255,255,0.12)',
		borderRadius: 999,
		paddingHorizontal: 14,
		height: 44,
	},
	searchIcon: {
		marginRight: 10,
	},
	searchInput: {
		flex: 1,
		color: '#FFFFFF',
		fontSize: 14,
	},
	filterBtn: {
		width: 44,
		height: 44,
		borderRadius: 22,
		backgroundColor: 'rgba(255,255,255,0.85)',
		alignItems: 'center',
		justifyContent: 'center',
	},

  // Filter icon container
  filterBtn: {
    marginLeft: 8,
    padding: 6,
    borderRadius: 999,
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
