// app/(tabs)/search.tsx
import { Asset } from 'expo-asset';
import React, { useEffect, useState } from 'react';
import { Alert, FlatList, StyleSheet, Text, TextInput, TouchableOpacity, View, } from 'react-native';

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
          // resolve & download the asset
          const asset = Asset.fromModule(def.asset);
          await asset.downloadAsync();

          if (!asset.localUri) continue;

          // read its text content
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

  const handlePress = (item: Resource) => {
    // For now: show the whole txt content in an alert.
    // Later: navigate to a detail screen instead.
    Alert.alert(item.title, item.content);
  };

  const renderItem = ({ item }: { item: Resource }) => (
    <TouchableOpacity
      style={styles.card}
      onPress={() => handlePress(item)}
      activeOpacity={0.7}
    >
      <Text style={styles.cardTitle}>{item.title}</Text>
      <Text style={styles.cardPreview} numberOfLines={3}>
        {item.content}
      </Text>
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Search</Text>
        <TextInput
          style={styles.searchInput}
          placeholder="Search by title or text…"
          placeholderTextColor="#9CA3AF"
          value={query}
          onChangeText={setQuery}
          returnKeyType="search"
        />
      </View>

      <FlatList
        data={filtered}
        keyExtractor={(item) => item.id}
        renderItem={renderItem}
        contentContainerStyle={styles.listContent}
        ListEmptyComponent={
          !loading ? (
            <Text style={styles.emptyText}>No resources found.</Text>
          ) : null
        }
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#020617',
  },
  header: {
    paddingTop: 16,
    paddingHorizontal: 16,
    paddingBottom: 8,
    backgroundColor: '#020617',
  },
  headerTitle: {
    color: '#F9FAFB',
    fontSize: 20,
    fontWeight: '700',
    marginBottom: 8,
  },
  searchInput: {
    backgroundColor: '#111827',
    borderRadius: 999,
    paddingHorizontal: 12,
    paddingVertical: 8,
    color: '#F9FAFB',
    fontSize: 14,
  },
  listContent: {
    paddingHorizontal: 16,
    paddingTop: 8,
    paddingBottom: 16,
  },
  card: {
    backgroundColor: '#111827',
    borderRadius: 12,
    padding: 12,
    marginBottom: 10,
  },
  cardTitle: {
    color: '#F9FAFB',
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 4,
  },
  cardPreview: {
    color: '#D1D5DB',
    fontSize: 14,
  },
  emptyText: {
    marginTop: 16,
    textAlign: 'center',
    color: '#9CA3AF',
  },
});
