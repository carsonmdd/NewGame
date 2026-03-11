import { Ionicons } from '@expo/vector-icons';
import { useAudioPlayer } from 'expo-audio';
import { Image } from 'expo-image';
import { Stack, useLocalSearchParams, useRouter } from 'expo-router';
import React, { useMemo } from 'react';
import {
  Linking,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from 'react-native';

import { useSavedResources } from '@/contexts/SavedResourcesContext';
import { Resource } from '@/types/resource';

function formatDate(dateString?: string) {
  if (!dateString) return 'Unknown date';

  const d = new Date(dateString);
  if (Number.isNaN(d.getTime())) return dateString;

  return d.toLocaleDateString();
}

function getResourceType(resource: Resource): 'TEXT' | 'PDF' | 'IMAGE' | 'VIDEO' | 'AUDIO' | 'LINK' {
  const rawType = (resource as any).type?.toUpperCase?.() ?? '';
  const url = ((resource as any).url ?? '').toLowerCase();
  const imageUrl = ((resource as any).imageUrl ?? '').toLowerCase();

  if (rawType.includes('PDF') || url.endsWith('.pdf')) return 'PDF';
  if (rawType.includes('IMAGE') || imageUrl || /\.(png|jpg|jpeg|webp|gif)$/.test(url)) return 'IMAGE';
  if (rawType.includes('VIDEO') || /youtube\.com|youtu\.be|vimeo\.com|mp4|webm/.test(url)) return 'VIDEO';
  if (rawType.includes('AUDIO') || /\.(mp3|wav|m4a|aac|ogg)$/.test(url)) return 'AUDIO';
  if (rawType.includes('LINK')) return 'LINK';

  return 'TEXT';
}

function isYouTubeUrl(url?: string) {
  if (!url) return false;
  return /youtube\.com|youtu\.be/.test(url);
}

function getYouTubeEmbedLabel(url?: string) {
  if (!url) return 'Open Video';
  return isYouTubeUrl(url) ? 'Open YouTube Video' : 'Open Video';
}

function AudioSection({ url }: { url: string }) {
  const player = useAudioPlayer({ uri: url });

  return (
    <View style={styles.mediaPanel}>
      <View style={styles.audioIconWrap}>
        <Ionicons name="musical-notes-outline" size={34} color={COLORS.textPrimary} />
      </View>

      <Text style={styles.mediaTitle}>Audio Resource</Text>
      <Text style={styles.mediaSubtext}>Tap below to play or pause.</Text>

      <Pressable
        style={styles.primaryActionButton}
        onPress={() => {
          if (player.playing) {
            player.pause();
          } else {
            player.play();
          }
        }}
      >
        <Ionicons
          name={player.playing ? 'pause' : 'play'}
          size={18}
          color={COLORS.textPrimary}
        />
        <Text style={styles.primaryActionText}>
          {player.playing ? 'Pause Audio' : 'Play Audio'}
        </Text>
      </Pressable>
    </View>
  );
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

  const resourceId = (parsedResource as any).objectID || parsedResource.id;
  const saved = isSaved(resourceId);
  const type = getResourceType(parsedResource);
  const contentText =
    (parsedResource as any).content ??
    (parsedResource as any).description ??
    'No content available.';
  const author = (parsedResource as any).author ?? 'Unknown author';
  const subjectLine =
    type === 'PDF'
      ? 'PDF Document'
      : type === 'IMAGE'
      ? 'Image Resource'
      : type === 'VIDEO'
      ? 'Video Resource'
      : type === 'AUDIO'
      ? 'Audio Resource'
      : type === 'LINK'
      ? 'External Resource'
      : 'Text Resource';

  const imageSource =
    (parsedResource as any).imageUrl || (type === 'IMAGE' ? (parsedResource as any).url : null);

  const externalUrl = (parsedResource as any).url;

  const renderMainPanel = () => {
    if (type === 'IMAGE' && imageSource) {
      return (
        <View style={styles.panel}>
          <Image
            source={imageSource}
            style={styles.fullImage}
            contentFit="cover"
          />
          {!!((parsedResource as any).description || (parsedResource as any).content) && (
            <View style={styles.panelTextBlock}>
              <Text style={styles.panelLabel}>Description</Text>
              <Text style={styles.panelText}>{contentText}</Text>
            </View>
          )}
        </View>
      );
    }

    if (type === 'VIDEO') {
      return (
        <View style={styles.panel}>
          <View style={styles.mediaPanel}>
            <View style={styles.videoIconWrap}>
              <Ionicons name="play-circle-outline" size={44} color={COLORS.textPrimary} />
            </View>

            <Text style={styles.mediaTitle}>Video Resource</Text>
            <Text style={styles.mediaSubtext}>
              Open the video in its source to watch it.
            </Text>

            {!!externalUrl && (
              <Pressable
                style={styles.primaryActionButton}
                onPress={() => Linking.openURL(externalUrl)}
              >
                <Ionicons name="open-outline" size={18} color={COLORS.textPrimary} />
                <Text style={styles.primaryActionText}>
                  {getYouTubeEmbedLabel(externalUrl)}
                </Text>
              </Pressable>
            )}
          </View>

          {!!((parsedResource as any).description || (parsedResource as any).content) && (
            <View style={styles.panelTextBlock}>
              <Text style={styles.panelLabel}>Description</Text>
              <Text style={styles.panelText}>{contentText}</Text>
            </View>
          )}
        </View>
      );
    }

    if (type === 'AUDIO' && externalUrl) {
      return (
        <View style={styles.panel}>
          <AudioSection url={externalUrl} />

          {!!((parsedResource as any).description || (parsedResource as any).content) && (
            <View style={styles.panelTextBlock}>
              <Text style={styles.panelLabel}>Description</Text>
              <Text style={styles.panelText}>{contentText}</Text>
            </View>
          )}
        </View>
      );
    }

    if (type === 'PDF') {
      return (
        <View style={styles.panel}>
          <View style={styles.mediaPanel}>
            <View style={styles.pdfIconWrap}>
              <Ionicons name="document-text-outline" size={38} color={COLORS.textPrimary} />
            </View>

            <Text style={styles.mediaTitle}>PDF Document</Text>
            <Text style={styles.mediaSubtext}>
              Preview the document details below or open the source file.
            </Text>

            {!!externalUrl && (
              <Pressable
                style={styles.primaryActionButton}
                onPress={() => Linking.openURL(externalUrl)}
              >
                <Ionicons name="document-outline" size={18} color={COLORS.textPrimary} />
                <Text style={styles.primaryActionText}>Open PDF</Text>
              </Pressable>
            )}
          </View>

          <View style={styles.panelTextBlock}>
            <Text style={styles.panelLabel}>Content</Text>
            <Text style={styles.panelText}>{contentText}</Text>
          </View>
        </View>
      );
    }

    if (type === 'LINK') {
      return (
        <View style={styles.panel}>
          <View style={styles.mediaPanel}>
            <View style={styles.linkIconWrap}>
              <Ionicons name="open-outline" size={34} color={COLORS.textPrimary} />
            </View>

            <Text style={styles.mediaTitle}>External Resource</Text>
            <Text style={styles.mediaSubtext}>
              This resource opens in another site or app.
            </Text>

            {!!externalUrl && (
              <Pressable
                style={styles.primaryActionButton}
                onPress={() => Linking.openURL(externalUrl)}
              >
                <Ionicons name="open-outline" size={18} color={COLORS.textPrimary} />
                <Text style={styles.primaryActionText}>Open Resource</Text>
              </Pressable>
            )}
          </View>

          <View style={styles.panelTextBlock}>
            <Text style={styles.panelLabel}>Details</Text>
            <Text style={styles.panelText}>{contentText}</Text>
          </View>
        </View>
      );
    }

    return (
      <View style={styles.panel}>
        <Text style={styles.panelLabel}>Content</Text>
        <Text style={styles.panelText}>{contentText}</Text>
      </View>
    );
  };

  return (
    <>
      <Stack.Screen options={{ headerShown: false }} />

      <View style={styles.container}>
        <View style={styles.header}>
          <Pressable style={styles.headerIconButton} onPress={() => router.back()}>
            <Ionicons name="close" size={28} color={COLORS.textPrimary} />
          </Pressable>

          <View style={styles.headerCenter}>
            <Text style={styles.headerTitle} numberOfLines={1}>
              {parsedResource.title}
            </Text>
            <Text style={styles.headerSubtitle} numberOfLines={1}>
              {subjectLine}
            </Text>
          </View>

          <Pressable
            style={styles.headerIconButton}
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
              size={26}
              color={COLORS.textPrimary}
            />
          </Pressable>
        </View>

        <ScrollView
          style={styles.body}
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
        >
          <View style={styles.metaRow}>
            <Text style={styles.metaText}>{author}</Text>
            <Text style={styles.metaDot}>•</Text>
            <Text style={styles.metaText}>{formatDate((parsedResource as any).createdAt)}</Text>
          </View>

          {renderMainPanel()}
        </ScrollView>
      </View>
    </>
  );
}

const COLORS = {
  screenBg: '#0E0F14',
  headerBg: '#2B2140',
  panelBg: '#121319',
  panelInner: '#181922',
  textPrimary: '#F4F1FF',
  textSecondary: 'rgba(244,241,255,0.72)',
  border: 'rgba(255,255,255,0.06)',
  accent: '#4D3B70',
  buttonBg: '#2F2546',
  buttonBgPressed: '#3B2E58',
  mediaSurface: '#1A1B24',
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.screenBg,
  },

  centered: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 24,
  },

  notFoundText: {
    color: COLORS.textPrimary,
    fontSize: 18,
    fontWeight: '700',
  },

  header: {
    height: 98,
    paddingTop: 18,
    paddingHorizontal: 14,
    backgroundColor: COLORS.headerBg,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.border,
    flexDirection: 'row',
    alignItems: 'center',
  },

  headerIconButton: {
    width: 44,
    height: 44,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },

  headerCenter: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 8,
  },

  headerTitle: {
    color: COLORS.textPrimary,
    fontSize: 18,
    fontWeight: '800',
    textAlign: 'center',
  },

  headerSubtitle: {
    color: COLORS.textSecondary,
    fontSize: 12,
    fontWeight: '600',
    textAlign: 'center',
    marginTop: 2,
  },

  body: {
    flex: 1,
  },

  scrollContent: {
    paddingHorizontal: 14,
    paddingTop: 14,
    paddingBottom: 28,
  },

  metaRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
    paddingHorizontal: 4,
    flexWrap: 'wrap',
  },

  metaText: {
    color: COLORS.textSecondary,
    fontSize: 13,
    fontWeight: '500',
  },

  metaDot: {
    color: COLORS.textSecondary,
    marginHorizontal: 8,
    fontSize: 13,
  },

  panel: {
    backgroundColor: COLORS.panelBg,
    borderRadius: 16,
    minHeight: 520,
    borderWidth: 1,
    borderColor: COLORS.border,
    overflow: 'hidden',
  },

  panelLabel: {
    color: COLORS.textPrimary,
    fontSize: 15,
    fontWeight: '800',
    marginBottom: 12,
  },

  panelText: {
    color: COLORS.textPrimary,
    fontSize: 16,
    lineHeight: 30,
    fontWeight: '700',
  },

  panelTextBlock: {
    paddingHorizontal: 16,
    paddingTop: 16,
    paddingBottom: 22,
  },

  fullImage: {
    width: '100%',
    height: 320,
    backgroundColor: COLORS.mediaSurface,
  },

  mediaPanel: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 20,
    paddingTop: 28,
    paddingBottom: 26,
    backgroundColor: COLORS.panelInner,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.border,
  },

  mediaTitle: {
    color: COLORS.textPrimary,
    fontSize: 20,
    fontWeight: '800',
    marginTop: 14,
    textAlign: 'center',
  },

  mediaSubtext: {
    color: COLORS.textSecondary,
    fontSize: 14,
    lineHeight: 21,
    textAlign: 'center',
    marginTop: 8,
    marginBottom: 16,
  },

  audioIconWrap: {
    width: 76,
    height: 76,
    borderRadius: 38,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: COLORS.accent,
  },

  videoIconWrap: {
    width: 84,
    height: 84,
    borderRadius: 42,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: COLORS.accent,
  },

  pdfIconWrap: {
    width: 76,
    height: 76,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: COLORS.accent,
  },

  linkIconWrap: {
    width: 76,
    height: 76,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: COLORS.accent,
  },

  primaryActionButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    backgroundColor: COLORS.buttonBg,
    borderRadius: 999,
    paddingHorizontal: 16,
    paddingVertical: 11,
    borderWidth: 1,
    borderColor: COLORS.border,
  },

  primaryActionText: {
    color: COLORS.textPrimary,
    fontSize: 14,
    fontWeight: '700',
  },
});