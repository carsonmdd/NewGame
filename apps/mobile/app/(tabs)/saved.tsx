import { Ionicons } from '@expo/vector-icons';
import React, { useMemo, useState } from 'react';
import {
  FlatList,
  Modal,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';

/**
 * SAVED TAB (UI-first / placeholder)
 * - Collections row (horizontal)
 * - Recently Saved (vertical grid)
 * - Tapping a Collection opens a modal showing items in that collection
 *
 * NOTE: No persistence yet. Everything here is placeholder/skeleton.
 */

type Collection = {
  id: string;
  name: string;
};

type SavedItem = {
  id: string;
  title: string;
};

const BG = '#050509';
const TEXT = '#F9FAFB';
const MUTED = '#9CA3AF';
const INPUT = '#2A2A2A';

export default function SavedScreen() {
  // Placeholder collections (swap for real data later)
  const collections: Collection[] = useMemo(
    () => [
      { id: 'c1', name: 'Unreal Engine' },
      { id: 'c2', name: 'Unreal Engine' },
      { id: 'c3', name: 'Unreal Engine' },
      { id: 'c4', name: 'Unreal Engine' },
    ],
    []
  );

  // Placeholder "recently saved" (UI-only)
  const recentlySaved: SavedItem[] = useMemo(
    () => [
      { id: 'r1', title: 'Intro to HTML for\nGame Developers\nPart 1' },
      { id: 'r2', title: 'Intro to HTML for\nGame Developers\nPart 2' },
      { id: 'r3', title: 'Intro to CSS for\nGame Developers' },
      { id: 'r4', title: 'Understanding\nGame UI Patterns' },
    ],
    []
  );

  const [openCollection, setOpenCollection] = useState<Collection | null>(null);
  const [collectionSearch, setCollectionSearch] = useState('');

  return (
    <View style={styles.container}>
      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        {/* Header row */}
        <View style={styles.headerRow}>
          <Text style={styles.headerTitle}>Saved</Text>

          {/* Avatar placeholder */}
          <View style={styles.avatar}>
            <Text style={styles.avatarText}>👨‍💻</Text>
          </View>
        </View>

        {/* Collections */}
        <Text style={styles.sectionTitle}>Collections</Text>

        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.collectionsRow}
        >
          {collections.map((c) => (
            <TouchableOpacity
              key={c.id}
              activeOpacity={0.8}
              onPress={() => {
                setCollectionSearch('');
                setOpenCollection(c);
              }}
              style={styles.collectionWrap}
            >
              <View style={styles.collectionSquare} />
              <Text style={styles.collectionName} numberOfLines={2}>
                {c.name}
              </Text>
            </TouchableOpacity>
          ))}
        </ScrollView>

        {/* Recently Saved */}
        <Text style={[styles.sectionTitle, { marginTop: 18 }]}>Recently Saved</Text>

        <View style={styles.recentGrid}>
          {recentlySaved.map((item) => (
            <View key={item.id} style={styles.recentCard}>
              <View style={styles.recentThumb} />
              <Text style={styles.recentTitle} numberOfLines={4}>
                {item.title}
              </Text>
            </View>
          ))}
        </View>
      </ScrollView>

      {/* Collection Modal */}
      <Modal
        visible={!!openCollection}
        animationType="slide"
        presentationStyle="fullScreen"
        onRequestClose={() => setOpenCollection(null)}
      >
        <View style={styles.modalContainer}>
          {/* Modal header */}
          <View style={styles.modalHeader}>
            <Text style={styles.modalTitle}>{openCollection?.name ?? 'Collection'}</Text>

            <TouchableOpacity
              accessibilityRole="button"
              accessibilityLabel="Close collection"
              activeOpacity={0.8}
              onPress={() => setOpenCollection(null)}
              style={styles.modalClose}
            >
              <Ionicons name="close" size={24} color={TEXT} />
            </TouchableOpacity>
          </View>

          {/* Search + filter row */}
          <View style={styles.modalSearchRow}>
            <View style={styles.modalSearchBar}>
              <Ionicons name="search" size={18} color={MUTED} style={{ marginRight: 8 }} />
              <TextInput
                value={collectionSearch}
                onChangeText={setCollectionSearch}
                placeholder="Search your collection"
                placeholderTextColor={MUTED}
                style={styles.modalSearchInput}
                returnKeyType="search"
              />
            </View>

            <TouchableOpacity
              activeOpacity={0.8}
              onPress={() => {}}
              accessibilityRole="button"
              accessibilityLabel="Collection filters (not implemented)"
              style={styles.modalFilterBtn}
            >
              <Ionicons name="options-outline" size={22} color={TEXT} />
            </TouchableOpacity>
          </View>

          {/* Grid: + tile + placeholder resources */}
          <FlatList
            contentContainerStyle={styles.modalGrid}
            data={buildCollectionTiles()}
            keyExtractor={(x) => x.id}
            numColumns={2}
            columnWrapperStyle={{ gap: 14 }}
            renderItem={({ item }) => {
              if (item.kind === 'add') {
                return (
                  <TouchableOpacity
                    activeOpacity={0.8}
                    onPress={() => {}}
                    style={styles.addTile}
                    accessibilityRole="button"
                    accessibilityLabel="Add resource to collection (not implemented)"
                  >
                    <Text style={styles.addPlus}>+</Text>
                  </TouchableOpacity>
                );
              }

              return (
                <View style={styles.modalTile}>
                  <Text style={styles.modalTileLabel}>Resource</Text>
                </View>
              );
            }}
            showsVerticalScrollIndicator={false}
          />
        </View>
      </Modal>
    </View>
  );
}

function buildCollectionTiles(): Array<{ id: string; kind: 'add' | 'resource' }> {
  // first tile is +, rest are placeholders
  const tiles: Array<{ id: string; kind: 'add' | 'resource' }> = [{ id: 'add', kind: 'add' }];
  for (let i = 0; i < 7; i++) tiles.push({ id: `res-${i}`, kind: 'resource' });
  return tiles;
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: BG,
  },
  content: {
    paddingHorizontal: 20,
    paddingTop: 18,
    paddingBottom: 36,
  },

  headerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 14,
  },
  headerTitle: {
    color: TEXT,
    fontSize: 42,
    fontWeight: '800',
    letterSpacing: 0.2,
  },
  avatar: {
    width: 40,
    height: 40,
    borderRadius: 999,
    backgroundColor: '#1B1B22',
    alignItems: 'center',
    justifyContent: 'center',
  },
  avatarText: {
    fontSize: 18,
  },

  sectionTitle: {
    color: TEXT,
    fontSize: 36,
    fontWeight: '800',
    marginTop: 6,
    marginBottom: 10,
  },

  collectionsRow: {
    paddingRight: 6,
    gap: 18,
  },
  collectionWrap: {
    width: 160,
  },
  collectionSquare: {
    width: 160,
    height: 140,
    borderRadius: 22,
    backgroundColor: '#1A1F4A', // placeholder (swap for real image later)
    marginBottom: 10,
  },
  collectionName: {
    color: TEXT,
    fontSize: 28,
    fontWeight: '700',
    lineHeight: 30,
  },

  recentGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    rowGap: 18,
  },
  recentCard: {
    width: '48%',
  },
  recentThumb: {
    width: '100%',
    height: 150,
    borderRadius: 18,
    backgroundColor: '#1B1B22',
    marginBottom: 10,
  },
  recentTitle: {
    color: TEXT,
    fontSize: 22,
    fontWeight: '700',
    lineHeight: 26,
  },

  // Modal
  modalContainer: {
    flex: 1,
    backgroundColor: BG,
    paddingTop: 16,
  },
  modalHeader: {
    paddingHorizontal: 20,
    paddingTop: 8,
    paddingBottom: 12,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  modalTitle: {
    color: TEXT,
    fontSize: 38,
    fontWeight: '800',
  },
  modalClose: {
    padding: 8,
    borderRadius: 999,
  },

  modalSearchRow: {
    paddingHorizontal: 20,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    marginTop: 10,
  },
  modalSearchBar: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: INPUT,
    borderRadius: 14,
    paddingHorizontal: 14,
    height: 44,
  },
  modalSearchInput: {
    flex: 1,
    color: TEXT,
    fontSize: 16,
    paddingVertical: 0,
  },
  modalFilterBtn: {
    width: 52,
    height: 44,
    borderRadius: 14,
    backgroundColor: INPUT,
    alignItems: 'center',
    justifyContent: 'center',
  },

  modalGrid: {
    paddingHorizontal: 20,
    paddingTop: 22,
    paddingBottom: 28,
    gap: 14,
  },
  addTile: {
    flex: 1,
    height: 160,
    borderRadius: 26,
    backgroundColor: '#2E2E2E',
    alignItems: 'center',
    justifyContent: 'center',
  },
  addPlus: {
    color: TEXT,
    fontSize: 72,
    fontWeight: '200',
    marginTop: -6,
  },
  modalTile: {
    flex: 1,
    height: 160,
    borderRadius: 26,
    backgroundColor: '#2E2E2E',
    justifyContent: 'flex-end',
    padding: 14,
  },
  modalTileLabel: {
    color: TEXT,
    fontSize: 26,
    fontWeight: '800',
  },
});
