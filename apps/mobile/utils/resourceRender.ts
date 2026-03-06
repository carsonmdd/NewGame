import { Resource, ResourceCategory } from '@/types/resource';

export type ResourceDisplayKind = 'TEXT' | 'IMAGE' | 'PDF' | 'AUDIO' | 'VIDEO' | 'LINK';

const IMAGE_EXTS = ['.png', '.jpg', '.jpeg', '.webp', '.gif'];
const AUDIO_EXTS = ['.mp3', '.wav', '.m4a', '.aac', '.ogg'];

export const isPdfUrl = (url: string) =>
  url.toLowerCase().split('?')[0].endsWith('.pdf');

export const isAudioUrl = (url: string) =>
  AUDIO_EXTS.some((ext) => url.toLowerCase().includes(ext));

export const isImageUrl = (url: string) =>
  IMAGE_EXTS.some((ext) => url.toLowerCase().includes(ext));

export const isYouTubeUrl = (url: string) =>
  /youtu\.be|youtube\.com/.test(url);

export function getYouTubeId(url: string) {
  try {
    const u = new URL(url);
    if (u.hostname.includes('youtu.be')) return u.pathname.replace('/', '');
    const v = u.searchParams.get('v');
    if (v) return v;
  } catch {}
  return null;
}

export function getYouTubeThumb(url: string) {
  const id = getYouTubeId(url);
  return id ? `https://img.youtube.com/vi/${id}/hqdefault.jpg` : null;
}

export function getDisplayKind(item: Resource): ResourceDisplayKind {
  const url = (item.url ?? '').trim();

  if (url) {
    if (isImageUrl(url)) return 'IMAGE';
    if (isPdfUrl(url)) return 'PDF';
    if (isAudioUrl(url)) return 'AUDIO';
  }

  if (item.resourceType === ResourceCategory.VIDEO) return 'VIDEO';
  if (url) return 'LINK';
  return 'TEXT';
}

export function getStableId(item: Resource) {
  return item.objectID || item.id;
}