import { Ionicons } from '@expo/vector-icons';
import { Asset } from 'expo-asset';
import React, { useEffect, useState } from 'react';
import {
  Alert,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';

import { RESOURCE_DEFS } from '@/constants/resources';

type Resource = {
  id: string;
  title: string;
  content: string;
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
          const asset = Asset.fromModule(def.asset);
          await asset.downloadAsync();

          if (!asset.localUri) continue;

          const res = await fetch(asset.localUri);
          const text = await res.text();

          loaded.push({
            id: def.id,
            title: def.title,
            content: text,
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

  const filtered = resources.filter((r) => {
    const q = query.toLowerCase();
    return (
      r.title.toLowerCase().includes(q) ||
      r.content.toLowerCase().includes(q)
    );
  });

  // For now, treat the last 2 filtered items as "recently saved"
  const recentlySaved = filtered.slice(-2);

  const handlePress = (item: Resource) => {
    // TODO: replace this Alert with navigation to your detail screen if desired
    Alert.alert(item.title, item.content);
  };

  return (
    <View style={styles.container}>
      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* Top bar with small "Search" label + menu icon */}
        <View style={styles.topBar}>
          <Text style={styles.screenLabel}>Search</Text>
        </View>

        {/* Big heading */}
        <Text style={styles.bigTitle}>What are you looking for?</Text>

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
        )}

        {/* Recently Saved section */}
        {recentlySaved.length > 0 && (
          <>
            <Text style={[styles.sectionLabel, styles.sectionSpacing]}>
              Recently Saved
            </Text>
            <View style={styles.grid}>
              {recentlySaved.map((item) => (
                <TouchableOpacity
                  key={`recent-${item.id}`}
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
          </>
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
    color: '#9CA3AF',
    fontSize: 14,
    fontWeight: '600',
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
    width: '48%', // two columns
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
