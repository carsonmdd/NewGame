import React, { useMemo, useState } from 'react';
import { Alert, Image, Pressable, StyleSheet, Text, View } from 'react-native';
import * as Linking from 'expo-linking';
import { Ionicons } from '@expo/vector-icons';
import { Audio } from 'expo-av';

import type { Resource } from '@/types/resource';
import { getRenderKind, getYouTubeThumb } from '@/utils/resourceRender';

export default function ResourceCard({
  resource,
  onOpenInApp,
  onOpenPdf,
}: {
  resource: Resource;
  onOpenInApp: (id: string) => void;
  onOpenPdf: (id: string) => void;
}) {
  const kind = getRenderKind(resource);

  const thumb = useMemo(() => {
    if (kind === 'YOUTUBE') return getYouTubeThumb(resource.url);
    return null;
  }, [kind, resource.url]);

  const [sound, setSound] = useState<Audio.Sound | null>(null);
  const [playing, setPlaying] = useState(false);

  const onPress = async () => {
    if (kind === 'IN_APP_TEXT') return onOpenInApp(resource.id);
    if (kind === 'PDF') return onOpenPdf(resource.id);

    if ((kind === 'YOUTUBE' || kind === 'LINK') && resource.url) {
      await Linking.openURL(resource.url);
      return;
    }

    if (kind === 'AUDIO') {
      try {
        if (!resource.url) {
          Alert.alert('Audio missing', 'No audio URL found for this resource.');
          return;
        }

        if (!sound) {
          const { sound: newSound } = await Audio.Sound.createAsync(
            { uri: resource.url },
            { shouldPlay: true }
          );
          setSound(newSound);
          setPlaying(true);
          return;
        }

        if (playing) {
          await sound.pauseAsync();
          setPlaying(false);
        } else {
          await sound.playAsync();
          setPlaying(true);
        }
      } catch (e) {
        console.error(e);
        Alert.alert('Audio error', 'Could not play this audio.');
      }
    }
  };

  React.useEffect(() => {
    return () => {
      sound?.unloadAsync();
    };
  }, [sound]);

  return (
    <Pressable style={styles.card} onPress={onPress}>
      {thumb ? <Image source={{ uri: thumb }} style={styles.thumb} /> : null}

      <View style={styles.row}>
        <View style={{ flex: 1 }}>
          <Text style={styles.title} numberOfLines={2}>{resource.title}</Text>
          <Text style={styles.desc} numberOfLines={2}>{resource.description}</Text>
        </View>

        <View style={styles.iconBadge}>
          {kind === 'IN_APP_TEXT' && <Ionicons name="document-text" size={18} color="#fff" />}
          {kind === 'PDF' && <Ionicons name="document" size={18} color="#fff" />}
          {kind === 'YOUTUBE' && <Ionicons name="logo-youtube" size={18} color="#fff" />}
          {kind === 'LINK' && <Ionicons name="open-outline" size={18} color="#fff" />}
          {kind === 'AUDIO' && (
            <Ionicons name={playing ? 'pause' : 'play'} size={18} color="#fff" />
          )}
        </View>
      </View>

      <Text style={styles.hint}>
        {kind === 'IN_APP_TEXT' && 'Open'}
        {kind === 'PDF' && 'Open PDF'}
        {kind === 'YOUTUBE' && 'Open YouTube'}
        {kind === 'LINK' && 'Open link'}
        {kind === 'AUDIO' && (playing ? 'Tap to pause' : 'Tap to play')}
      </Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  card: { backgroundColor: '#111827', borderRadius: 16, padding: 12, marginBottom: 12 },
  thumb: { width: '100%', height: 170, borderRadius: 12, marginBottom: 10 },
  row: { flexDirection: 'row', alignItems: 'center', gap: 10 },
  title: { color: '#F9FAFB', fontSize: 16, fontWeight: '700' },
  desc: { color: '#9CA3AF', fontSize: 13, marginTop: 2 },
  iconBadge: {
    width: 36, height: 36, borderRadius: 10,
    alignItems: 'center', justifyContent: 'center',
    backgroundColor: '#7C3AED',
  },
  hint: { color: '#9CA3AF', fontSize: 12, marginTop: 8 },
});