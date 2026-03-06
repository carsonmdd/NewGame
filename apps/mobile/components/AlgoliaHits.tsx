import { useRouter } from 'expo-router';
import React from 'react';
import { useHits, UseHitsProps } from 'react-instantsearch-core';
import { StyleSheet, Text, View } from 'react-native';

import { ResourceCard } from '@/components/ResourceCard';
import { Resource } from '@/types/resource';
import { getStableId } from '@/utils/resourceRender';

export function AlgoliaHits(props: UseHitsProps<Resource>) {
  const { hits } = useHits(props);
  const router = useRouter();

  if (hits.length === 0) {
    return <Text style={styles.subtleText}>No resources found.</Text>;
  }

  return (
    <View style={styles.grid}>
      {hits.map((item) => (
        <ResourceCard
			key={getStableId(item)}
			item={item}
			onOpenText={(id) =>
				router.push({ pathname: '/resource/[id]', params: { id: item.objectID || item.id, resource: JSON.stringify(item)} })
			}
			onOpenPdf={(id) =>
				router.push({ pathname: '/resource/[id]', params: { id: item.objectID || item.id, resource: JSON.stringify(item)} })
			}
			onOpenExternal={(_url) =>
				router.push({ pathname: '/resource/[id]', params: { id: item.objectID || item.id, resource: JSON.stringify(item)} })
			}
		/>
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  subtleText: {
    color: 'rgba(255,255,255,0.65)',
    fontSize: 13,
    marginBottom: 8,
  },
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
});