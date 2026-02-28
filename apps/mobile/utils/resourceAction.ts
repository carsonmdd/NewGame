// apps/mobile/utils/resourceActions.ts
import type { Resource } from '@/types/resource';
import { getKind, getStableId } from '@/utils/resourceRender';
import * as Linking from 'expo-linking';
import type { Router } from 'expo-router';

export async function handleResourcePress(router: Router, item: Resource) {
  const kind = getKind(item);
  const id = getStableId(item);

  if (kind === 'IN_APP') {
    router.push({ pathname: '/resource/[id]', params: { id } });
    return;
  }

  if (kind === 'PDF') {
    router.push({ pathname: '/pdf/[id]', params: { id } });
    return;
  }

  // AUDIO / VIDEO / LINK: open external for now
  if (item.url) {
    await Linking.openURL(item.url);
  }
}