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
import { Header } from '@react-navigation/elements';

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

export default function HomeScreen() {
  const [resources, setResources] = useState<Resource[]>([]);
  const [query, setQuery] = useState('');
  const [loading, setLoading] = useState(true);

  // Load all txt files from the manifest
  useEffect(() => {
    const loadResources = async () => {
      try {
        const loaded: Resource[] = [];

        for (const def of RESOURCE_DEFS) {
          const content = Asset.fromModule(def.content);
          await content.downloadAsync();

          if (!content.localUri) continue;

          const res = await fetch(content.localUri);
          const text = await res.text();

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

  const filtered = resources.filter((r) => {
    const q = query.toLowerCase();
    return (
      r.title.toLowerCase().includes(q) ||
      r.content.toLowerCase().includes(q)
    );
  });

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
        {/* Big heading */}
        <Text style={styles.bigTitle}>Home</Text>
        
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
        <View style={styles.sectionLabel}>
          <TextInput
            style={styles.bigTitle}
            placeholder="Made for You"
            placeholderTextColor="#E5E7EB"
            value={query}
            onChangeText={setQuery}
            returnKeyType="search"
          />
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

        {/* Guides Selection */}
        <View style={styles.sectionLabel}>
          <TextInput
            style={styles.bigTitle}
            placeholder="Guides"
            placeholderTextColor="#E5E7EB"
            value={query}
            onChangeText={setQuery}
            returnKeyType="search"
          />
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


        {/*Videos Selection area*/}
        <View style={styles.sectionLabel}>
          <TextInput
            style={styles.bigTitle}
            placeholder="Videos"
            placeholderTextColor="#E5E7EB"
            value={query}
            onChangeText={setQuery}
            returnKeyType="search"
          />
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


        {/*Users selection area*/}
        <View style={styles.sectionLabel}>
          <TextInput
            style={styles.bigTitle}
            placeholder="Users"
            placeholderTextColor="#E5E7EB"
            value={query}
            onChangeText={setQuery}
            returnKeyType="search"
          />
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
