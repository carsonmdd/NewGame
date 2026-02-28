import { Resource, ResourceCategory } from '@/types/resource';

export type Kind = 'IN_APP' | 'VIDEO' | 'PDF' | 'AUDIO' | 'LINK';

const AUDIO_EXTS = ['.mp3', '.wav', '.m4a', '.aac', '.ogg'];

export const isPdfUrl = (url: string) =>
  url.toLowerCase().split('?')[0].endsWith('.pdf');

export const isAudioUrl = (url: string) =>
  AUDIO_EXTS.some((e) => url.toLowerCase().includes(e));

export const isYouTubeUrl = (url: string) => /youtu\.be|youtube\.com/.test(url);

export function getKind(item: Resource): Kind {
  const url = (item.url ?? '').trim();
  if (url) {
    if (isPdfUrl(url)) return 'PDF';
    if (isAudioUrl(url)) return 'AUDIO';
  }
  if (item.resourceType === ResourceCategory.VIDEO) return 'VIDEO';
  if (url) return 'LINK';
  return 'IN_APP';
}

export function getYouTubeId(url: string) {
  try {
    const u = new URL(url);
    if (u.hostname.includes('youtu.be')) return u.pathname.replace('/', '');
    const v = u.searchParams.get('v');
    if (v) return v;
    const parts = u.pathname.split('/');
    const embedIdx = parts.indexOf('embed');
    if (embedIdx >= 0 && parts[embedIdx + 1]) return parts[embedIdx + 1];
  } catch {}
  return null;
}

export function getYouTubeThumb(url: string) {
  const id = getYouTubeId(url);
  return id ? `https://img.youtube.com/vi/${id}/hqdefault.jpg` : null;
}

export function getStableId(item: Resource) {
  // Algolia gives objectID; you also have id
  return item.objectID || item.id;
}