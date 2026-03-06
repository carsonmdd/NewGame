import { Ionicons } from '@expo/vector-icons';
import { Image } from 'expo-image';
import { Stack, useLocalSearchParams, useRouter } from 'expo-router';
import React, { useMemo } from 'react';
import { useSavedResources } from '@/contexts/SavedResourcesContext';
import {
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from 'react-native';

import { Resource } from '@/types/resource';

function formatDate(dateString?: string) {
  if (!dateString) return 'Unknown date';

  const d = new Date(dateString);
  if (Number.isNaN(d.getTime())) return dateString;

  return d.toLocaleDateString();
}

export default function ResourceDetailScreen() {
  const { resource } = useLocalSearchParams<{
    id: string;
    resource?: string;
  }>();

  const router = useRouter();
  const { saveResource, unsaveResource, isSaved } = useSavedResources();

  const parsedResource = useMemo(() => {
    if (!resource) return null;

    try {
      return JSON.parse(resource) as Resource;
    } catch (err) {
      console.error('Failed to parse resource param:', err);
      return null;
    }
  }, [resource]);

  if (!parsedResource) {
    return (
      <>
        <Stack.Screen options={{ headerShown: false }} />
        <View style={styles.container}>
          <View style={styles.centered}>
            <Text style={styles.notFoundText}>Resource not found.</Text>
          </View>
        </View>
      </>
    );
  }

  const resourceId = parsedResource.objectID || parsedResource.id;
  const saved = isSaved(resourceId);

  return (
    <>
      <Stack.Screen options={{ headerShown: false }} />

      <View style={styles.container}>
        <ScrollView
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
        >
          <View style={styles.topRow}>
            <Pressable style={styles.backButton} onPress={() => router.back()}>
              <Ionicons name="arrow-back" size={28} color="#EF4444" />
            </Pressable>

            <View style={styles.metaBlock}>
              <Text style={styles.metaText}>
                {parsedResource.author ?? 'Unknown author'}
              </Text>
              <Text style={styles.metaText}>
                Published: {formatDate(parsedResource.createdAt)}
              </Text>
              <Text style={styles.title}>{parsedResource.title}</Text>
            </View>
          </View>

          {parsedResource.imageUrl ? (
            <Image
              source={parsedResource.imageUrl}
              style={styles.heroImage}
              contentFit="cover"
            />
          ) : null}

          <View style={styles.contentBox}>
            <Text style={styles.contentLabel}>Content</Text>

            <Text style={styles.contentText}>
              {parsedResource.content ??
                parsedResource.description ??
                'No content available.'}
            </Text>
          </View>

          <Pressable
            style={[styles.saveButton, saved && styles.saveButtonActive]}
            onPress={() => {
              if (saved) {
                unsaveResource(resourceId);
              } else {
                saveResource(parsedResource);
              }
            }}
          >
            <Ionicons
              name={saved ? 'bookmark' : 'bookmark-outline'}
              size={18}
              color="#FFFFFF"
            />
            <Text style={styles.saveButtonText}>
              {saved ? 'Saved' : 'Save'}
            </Text>
          </Pressable>
        </ScrollView>
      </View>
    </>
  );
}

const BG = '#ECECEC';
const RED = '#EF4444';

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: BG,
  },
  scrollContent: {
    paddingHorizontal: 24,
    paddingTop: 32,
    paddingBottom: 40,
  },
  centered: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  notFoundText: {
    fontSize: 18,
    fontWeight: '700',
    color: '#111827',
  },
  topRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: 20,
  },
  backButton: {
    marginRight: 18,
    paddingTop: 4,
  },
  metaBlock: {
    flex: 1,
  },
  metaText: {
    fontSize: 15,
    color: '#111827',
    marginBottom: 2,
  },
  title: {
    fontSize: 28,
    fontWeight: '800',
    color: '#111827',
    marginTop: 4,
  },
  heroImage: {
    width: '100%',
    height: 190,
    borderRadius: 24,
    marginBottom: 18,
  },
  contentBox: {
    borderWidth: 4,
    borderColor: RED,
    borderRadius: 28,
    padding: 18,
    minHeight: 360,
    backgroundColor: 'transparent',
  },
  contentLabel: {
    fontSize: 16,
    fontWeight: '700',
    color: '#111827',
    marginBottom: 12,
  },
  contentText: {
    fontSize: 16,
    lineHeight: 24,
    color: '#111827',
  },
  saveButton: {
    marginTop: 24,
    alignSelf: 'flex-start',
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: RED,
    paddingHorizontal: 18,
    paddingVertical: 12,
    borderRadius: 999,
    gap: 8,
  },
  saveButtonActive: {
    backgroundColor: '#DC2626',
  },
  saveButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '700',
  },
});