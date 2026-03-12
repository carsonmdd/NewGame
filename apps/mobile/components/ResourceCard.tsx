import { Ionicons } from '@expo/vector-icons';
import { useAudioPlayer } from 'expo-audio';
import { Image } from 'expo-image';
import React from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';

import { Resource } from '@/types/resource';
import {
  getDisplayKind,
  getStableId,
  getYouTubeThumb,
  isYouTubeUrl,
} from '@/utils/resourceRender';

type Props = {
  item: Resource;
  onOpenText: (id: string) => void;
  onOpenPdf: (id: string) => void;
  onOpenExternal: (url: string) => void;
};

function AudioButton({ url }: { url: string }) {
  const player = useAudioPlayer({ uri: url });

  return (
    <TouchableOpacity
      style={styles.audioButton}
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
        color="#fff"
      />
      <Text style={styles.audioButtonText}>
        {player.playing ? 'Pause' : 'Play'}
      </Text>
    </TouchableOpacity>
  );
}

export function ResourceCard({
  item,
  onOpenText,
  onOpenPdf,
  onOpenExternal,
}: Props) {
  const kind = getDisplayKind(item);
  const id = getStableId(item);

  let previewUrl: string | null = null;

  if (kind === 'IMAGE' && item.url) {
    previewUrl = item.url;
  } else if (kind === 'VIDEO' && item.url && isYouTubeUrl(item.url)) {
    previewUrl = getYouTubeThumb(item.url);
  }

  const handlePress = () => {
    onOpenText(id);
    
    if (kind === 'TEXT') {
      onOpenText(id);
      return;
    }

    if (kind === 'PDF') {
      onOpenPdf(id);
      return;
    }

    onOpenText(id);
  };

  return (
    <TouchableOpacity
      style={styles.card}
      activeOpacity={0.75}
      onPress={kind === 'AUDIO' ? undefined : handlePress}
    >
      {previewUrl ? (
        <Image source={previewUrl} style={styles.preview} contentFit="cover" />
      ) : null}

      <View style={styles.iconBadge}>
        {kind === 'TEXT' && <Ionicons name="document-text" size={16} color="#fff" />}
        {kind === 'PDF' && <Ionicons name="document" size={16} color="#fff" />}
        {kind === 'AUDIO' && <Ionicons name="musical-notes" size={16} color="#fff" />}
        {kind === 'VIDEO' && <Ionicons name="logo-youtube" size={16} color="#fff" />}
        {kind === 'IMAGE' && <Ionicons name="image" size={16} color="#fff" />}
        {kind === 'LINK' && <Ionicons name="open-outline" size={16} color="#fff" />}
      </View>

      <Text style={styles.cardTitle} numberOfLines={2}>
        {item.title}
      </Text>

      {kind === 'AUDIO' && item.url ? (
        <AudioButton url={item.url} />
      ) : (
        <Text style={styles.cardMeta} numberOfLines={1}>
          {kind}
        </Text>
      )}
    </TouchableOpacity>
  );
}

const CARD = '#17133A';

const styles = StyleSheet.create({
  card: {
    backgroundColor: CARD,
    borderRadius: 18,
    padding: 12,
    marginBottom: 14,
    width: '48%',
    minHeight: 180,
    justifyContent: 'flex-end',
    overflow: 'hidden',
  },
  preview: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    height: 96,
  },
  iconBadge: {
    position: 'absolute',
    top: 10,
    right: 10,
    width: 30,
    height: 30,
    borderRadius: 10,
    backgroundColor: 'rgba(0,0,0,0.35)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  cardTitle: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '900',
    lineHeight: 20,
  },
  cardMeta: {
    marginTop: 6,
    color: 'rgba(255,255,255,0.75)',
    fontSize: 12,
    fontWeight: '700',
  },
  audioButton: {
    marginTop: 10,
    flexDirection: 'row',
    alignItems: 'center',
    alignSelf: 'flex-start',
    backgroundColor: 'rgba(255,255,255,0.14)',
    paddingHorizontal: 10,
    paddingVertical: 8,
    borderRadius: 999,
    gap: 6,
  },
  audioButtonText: {
    color: '#fff',
    fontSize: 12,
    fontWeight: '700',
  },
});