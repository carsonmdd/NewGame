import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import React, { useMemo, useState } from 'react';
import {
  Alert,
  FlatList,
  Modal,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { useSavedResources } from '@/contexts/SavedResourcesContext';
import { Resource } from '@/types/resource';

/**
 * SAVED TAB
 * - Collections are a vertical 2-column grid
 * - Default collection: "Recently Saved"
 * - "+" tile creates a new collection tile (placeholder)
 * - Tapping a collection opens the modal
 * - "Recently Saved" modal now uses real saved resources from context
 */

type Collection = {
  id: string;
  name: string;
};

type ModalTile =
  | { id: string; kind: 'add' }
  | { id: string; kind: 'resource'; resource: Resource };

const BG = '#050509';
const TEXT = '#F9FAFB';
const MUTED = '#9CA3AF';
const INPUT = '#2A2A2A';
const TILE_BG = '#1B1B22';

const NAME_MAX = 22;

export default function SavedScreen() {
  const router = useRouter();
  const { savedResources } = useSavedResources();

  const defaultCollections: Collection[] = useMemo(
    () => [{ id: 'recent', name: 'Recently Saved' }],
    []
  );

  const [collections, setCollections] = useState<Collection[]>(defaultCollections);
  const [openCollectionId, setOpenCollectionId] = useState<string | null>(null);

  const [isEditingTitle, setIsEditingTitle] = useState(false);
  const [draftName, setDraftName] = useState('');
  const [collectionSearch, setCollectionSearch] = useState('');

  const openCollection = useMemo(() => {
    if (!openCollectionId) return null;
    return collections.find((c) => c.id === openCollectionId) ?? null;
  }, [collections, openCollectionId]);

  const openCollectionName = openCollection?.name ?? 'Collection';

  const openModalForCollection = (c: Collection) => {
    setCollectionSearch('');
    setIsEditingTitle(false);
    setDraftName(c.name);
    setOpenCollectionId(c.id);
  };

  const closeModal = () => {
    setOpenCollectionId(null);
    setIsEditingTitle(false);
    setDraftName('');
  };

  const addCollection = () => {
    const nextNum = collections.filter((c) => c.id.startsWith('new-')).length + 1;
    const newCollection: Collection = {
      id: `new-${Date.now()}`,
      name: `New Collection ${nextNum}`,
    };
    setCollections((prev) => [...prev, newCollection]);
  };

  const sanitizeName = (value: string) => {
    const cleaned = value.replace(/[^a-zA-Z0-9 ]/g, '');
    const collapsed = cleaned.replace(/\s+/g, ' ');
    return collapsed.slice(0, NAME_MAX);
  };

  const startEditingTitle = () => {
    if (!openCollection) return;
    setDraftName(openCollection.name);
    setIsEditingTitle(true);
  };

  const saveTitle = () => {
    if (!openCollection) return;

    const trimmed = draftName.trim();
    const safe = sanitizeName(trimmed);

    if (!safe) {
      setDraftName(openCollection.name);
      setIsEditingTitle(false);
      return;
    }

    setCollections((prev) =>
      prev.map((c) => (c.id === openCollection.id ? { ...c, name: safe } : c))
    );

    setIsEditingTitle(false);
  };

  const deleteCollection = () => {
    if (!openCollection) return;

    if (openCollection.id === 'recent') {
      Alert.alert('Cannot delete', 'The "Recently Saved" collection cannot be deleted.');
      return;
    }

    Alert.alert(
      'Delete collection?',
      `Are you sure you want to delete "${openCollection.name}"?`,
      [
        { text: 'No', style: 'cancel' },
        {
          text: 'Yes',
          style: 'destructive',
          onPress: () => {
            setCollections((prev) => prev.filter((c) => c.id !== openCollection.id));
            closeModal();
          },
        },
      ]
    );
  };

  const gridData = useMemo(() => {
    return [
      ...collections.map((c) => ({ kind: 'collection' as const, collection: c, id: c.id })),
      { kind: 'add' as const, id: 'add' },
    ];
  }, [collections]);

  const filteredSavedResources = useMemo(() => {
    const q = collectionSearch.trim().toLowerCase();

    if (!q) return savedResources;

    return savedResources.filter((resource) => {
      const titleMatch = resource.title?.toLowerCase().includes(q);
      const descriptionMatch = resource.description?.toLowerCase().includes(q);
      const tagsMatch = resource.tags?.some((tag) => tag.toLowerCase().includes(q));

      return titleMatch || descriptionMatch || tagsMatch;
    });
  }, [savedResources, collectionSearch]);

  const modalTiles: ModalTile[] = useMemo(() => {
    if (!openCollection) return [];

    if (openCollection.id === 'recent') {
      return filteredSavedResources.map((resource) => ({
        id: resource.objectID || resource.id,
        kind: 'resource' as const,
        resource,
      }));
    }

    return [{ id: 'add', kind: 'add' }];
  }, [openCollection, filteredSavedResources]);

  return (
    <SafeAreaView style={styles.safe} edges={['left', 'right']}>
      <View style={styles.container}>
        <View style={styles.headerRow}>
          <Text style={styles.headerTitle}>Saved</Text>
          <View style={styles.avatar}>
            <Text style={styles.avatarText}>👨‍💻</Text>
          </View>
        </View>

        <Text style={styles.sectionTitle}>Collections</Text>

        <FlatList
          data={gridData}
          keyExtractor={(item) => item.id}
          numColumns={2}
          columnWrapperStyle={styles.columnWrap}
          contentContainerStyle={styles.gridContent}
          showsVerticalScrollIndicator={false}
          renderItem={({ item }) => {
            if (item.kind === 'add') {
              return (
                <View style={styles.addTileWrap}>
                  <TouchableOpacity
                    activeOpacity={0.85}
                    onPress={addCollection}
                    style={styles.addTile}
                    accessibilityRole="button"
                    accessibilityLabel="Create new collection"
                  >
                    <Text style={styles.addPlus}>+</Text>
                  </TouchableOpacity>
                </View>
              );
            }

            const c = item.collection;
            return (
              <TouchableOpacity
                activeOpacity={0.85}
                onPress={() => openModalForCollection(c)}
                style={styles.collectionTile}
                accessibilityRole="button"
                accessibilityLabel={`Open collection ${c.name}`}
              >
                <View style={styles.collectionSquare} />
                <Text style={styles.collectionName} numberOfLines={1}>
                  {c.name}
                </Text>
              </TouchableOpacity>
            );
          }}
        />

        <Modal
          visible={!!openCollection}
          animationType="slide"
          presentationStyle="fullScreen"
          onRequestClose={closeModal}
        >
          <SafeAreaView style={styles.modalSafe} edges={['top', 'left', 'right']}>
            <View style={styles.modalContainer}>
              <View style={styles.modalHeader}>
                <View style={styles.modalTitleRow}>
                  {!isEditingTitle ? (
                    <TouchableOpacity
                      activeOpacity={0.8}
                      onPress={startEditingTitle}
                      accessibilityRole="button"
                      accessibilityLabel="Edit collection name"
                      style={styles.modalTitleTap}
                    >
                      <Text style={styles.modalTitle} numberOfLines={1}>
                        {openCollectionName}
                      </Text>
                    </TouchableOpacity>
                  ) : (
                    <View style={styles.modalTitleEditWrap}>
                      <TextInput
                        value={draftName}
                        onChangeText={(t) => setDraftName(sanitizeName(t))}
                        style={styles.modalTitleInput}
                        placeholder="Collection name"
                        placeholderTextColor={MUTED}
                        autoFocus
                        maxLength={NAME_MAX}
                        returnKeyType="done"
                        onSubmitEditing={saveTitle}
                        autoCorrect={false}
                      />
                      <Text style={styles.editHelpText}>
                        Letters, numbers, spaces. Max {NAME_MAX} characters.
                      </Text>
                    </View>
                  )}
                </View>

                <View style={styles.modalHeaderBtns}>
                  <TouchableOpacity
                    accessibilityRole="button"
                    accessibilityLabel="Delete collection"
                    activeOpacity={0.8}
                    onPress={deleteCollection}
                    style={styles.iconBtn}
                  >
                    <Ionicons name="trash-outline" size={22} color={TEXT} />
                  </TouchableOpacity>

                  <TouchableOpacity
                    accessibilityRole="button"
                    accessibilityLabel="Close collection"
                    activeOpacity={0.8}
                    onPress={closeModal}
                    style={styles.iconBtn}
                  >
                    <Ionicons name="close" size={24} color={TEXT} />
                  </TouchableOpacity>
                </View>
              </View>

              {isEditingTitle && (
                <View style={styles.editActionsRow}>
                  <TouchableOpacity
                    activeOpacity={0.85}
                    onPress={() => {
                      setDraftName(openCollectionName);
                      setIsEditingTitle(false);
                    }}
                    style={[styles.editBtn, styles.editBtnGhost]}
                  >
                    <Text style={styles.editBtnText}>Cancel</Text>
                  </TouchableOpacity>

                  <TouchableOpacity
                    activeOpacity={0.85}
                    onPress={saveTitle}
                    style={[styles.editBtn, styles.editBtnSolid]}
                  >
                    <Text style={[styles.editBtnText, { color: '#0B0B10' }]}>Save</Text>
                  </TouchableOpacity>
                </View>
              )}

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

              <FlatList
                contentContainerStyle={styles.modalGrid}
                data={modalTiles}
                keyExtractor={(x) => x.id}
                numColumns={2}
                columnWrapperStyle={{ gap: 14 }}
                renderItem={({ item }) => {
                  if (item.kind === 'add') {
                    return (
                      <TouchableOpacity
                        activeOpacity={0.8}
                        onPress={() => {}}
                        style={styles.modalAddTile}
                        accessibilityRole="button"
                        accessibilityLabel="Add resource to collection (not implemented)"
                      >
                        <Text style={styles.modalAddPlus}>+</Text>
                      </TouchableOpacity>
                    );
                  }

                  const resource = item.resource;

                  return (
                    <TouchableOpacity
                      activeOpacity={0.8}
                      style={styles.modalTile}
                      onPress={() =>
                        router.push({
                          pathname: '/resource/[id]',
                          params: {
                            id: resource.objectID || resource.id,
                            resource: JSON.stringify(resource),
                          },
                        })
                      }
                    >
                      <Text style={styles.modalTileLabel} numberOfLines={2}>
                        {resource.title}
                      </Text>
                    </TouchableOpacity>
                  );
                }}
                ListEmptyComponent={
                  openCollection?.id === 'recent' ? (
                    <Text style={styles.emptyCollectionText}>No saved resources yet.</Text>
                  ) : null
                }
                showsVerticalScrollIndicator={false}
              />
            </View>
          </SafeAreaView>
        </Modal>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: {
    flex: 1,
    backgroundColor: BG,
  },
  container: {
    flex: 1,
    backgroundColor: BG,
    paddingHorizontal: 20,
    paddingTop: 10,
  },
  headerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 6,
  },
  headerTitle: {
    color: TEXT,
    fontSize: 44,
    fontWeight: '800',
    letterSpacing: 0.2,
  },
  avatar: {
    width: 40,
    height: 40,
    borderRadius: 999,
    backgroundColor: TILE_BG,
    alignItems: 'center',
    justifyContent: 'center',
  },
  avatarText: {
    fontSize: 18,
  },
  sectionTitle: {
    color: TEXT,
    fontSize: 40,
    fontWeight: '800',
    marginTop: 0,
    marginBottom: 12,
  },
  gridContent: {
    paddingBottom: 24,
  },
  columnWrap: {
    gap: 18,
    marginBottom: 18,
  },
  collectionTile: {
    flex: 1,
  },
  collectionSquare: {
    width: '100%',
    height: 165,
    borderRadius: 28,
    backgroundColor: '#1A1F4A',
    marginBottom: 10,
  },
  collectionName: {
    color: TEXT,
    fontSize: 22,
    fontWeight: '700',
  },
  addTileWrap: {
    flex: 1,
    alignItems: 'flex-start',
  },
  addTile: {
    width: 165,
    height: 165,
    borderRadius: 999,
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
  modalSafe: {
    flex: 1,
    backgroundColor: BG,
  },
  modalContainer: {
    flex: 1,
    backgroundColor: BG,
  },
  modalHeader: {
    paddingHorizontal: 20,
    paddingTop: 6,
    paddingBottom: 8,
    flexDirection: 'row',
    alignItems: 'flex-start',
    justifyContent: 'space-between',
  },
  modalTitleRow: {
    flex: 1,
    paddingRight: 10,
  },
  modalTitleTap: {
    paddingVertical: 4,
  },
  modalTitle: {
    color: TEXT,
    fontSize: 38,
    fontWeight: '800',
  },
  modalTitleEditWrap: {
    paddingTop: 2,
  },
  modalTitleInput: {
    color: TEXT,
    fontSize: 34,
    fontWeight: '800',
    paddingVertical: 6,
    paddingHorizontal: 0,
  },
  editHelpText: {
    color: MUTED,
    fontSize: 12,
    marginTop: 4,
  },
  modalHeaderBtns: {
    flexDirection: 'row',
    gap: 10,
    alignItems: 'center',
  },
  iconBtn: {
    padding: 8,
    borderRadius: 999,
  },
  editActionsRow: {
    paddingHorizontal: 20,
    flexDirection: 'row',
    gap: 10,
    marginTop: 4,
    marginBottom: 6,
  },
  editBtn: {
    flex: 1,
    height: 40,
    borderRadius: 999,
    alignItems: 'center',
    justifyContent: 'center',
  },
  editBtnGhost: {
    borderWidth: 1,
    borderColor: TEXT,
    backgroundColor: 'transparent',
  },
  editBtnSolid: {
    backgroundColor: TEXT,
  },
  editBtnText: {
    color: TEXT,
    fontSize: 13,
    fontWeight: '800',
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
  modalAddTile: {
    flex: 1,
    height: 160,
    borderRadius: 26,
    backgroundColor: '#2E2E2E',
    alignItems: 'center',
    justifyContent: 'center',
  },
  modalAddPlus: {
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
  emptyCollectionText: {
    color: MUTED,
    fontSize: 16,
    marginTop: 8,
  },
});