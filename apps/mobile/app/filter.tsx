import { Ionicons } from '@expo/vector-icons';
import React, { useMemo, useState } from 'react';
import { ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import {
  useClearRefinements,
  useCurrentRefinements,
  useRefinementList,
  useStats,
} from 'react-instantsearch-core';
import { useNavigation } from '@react-navigation/native';
import { getSearchSortMode, setSearchSortMode } from '@/lib/searchSort';

const BG = '#050509';
const CARD = '#0F0F14';
const BORDER = '#2B2B36';
const TEXT = '#F9FAFB';
const MUTED = '#9CA3AF';

const SORT_ITEMS = [
  { label: 'Relevant', value: 'relevant' as const },
  { label: 'Most Recent', value: 'recent' as const },
];

// Your preferred ordering/labels (display), but will refine using Algolia’s real values.
const RESOURCE_TYPE_PREF = [
  { label: 'Article', pref: 'ARTICLE' },
  { label: 'Video', pref: 'VIDEO' },
  { label: 'Documentation', pref: 'DOCUMENTATION' },
  { label: 'Course', pref: 'COURSE' },
];

const DIFFICULTY_PREF = [
  { label: 'Beginner', pref: 'BEGINNER' },
  { label: 'Intermediate', pref: 'INTERMEDIATE' },
  { label: 'Advanced', pref: 'ADVANCED' },
];


// Case-insensitive facet item lookup
function findFacetItemByPref(items: any[], pref: string) {
  const p = pref.toLowerCase();
  return items.find((it) => String(it.value).toLowerCase() === p || String(it.label).toLowerCase() === p);
}


export default function FilterScreen() {
  const [currentSort, setCurrentSort] = useState<'relevant' | 'recent'>(
	getSearchSortMode()
);
  
  const type = useRefinementList({ attribute: 'resourceType' });
  const diff = useRefinementList({ attribute: 'difficulty' });

  const { canRefine: canClear, refine: clear } = useClearRefinements();
  const { items: currentRefinements } = useCurrentRefinements();
  const { nbHits } = useStats();

  const hasActiveSort = currentSort !== 'relevant';
  const canClearAnything = canClear || hasActiveSort;

  const totalRefinements = useMemo(
    () => currentRefinements.reduce((acc, g) => acc + g.refinements.length, 0),
    [currentRefinements]
  );

  const clearAll = () => {
    clear();
    setCurrentSort('relevant');
	setSearchSortMode('relevant');
  };

  const navigation = useNavigation();

  const seeResults = () => navigation.goBack();

  // Build rows using Algolia’s *actual* facet values, but keep preferred order + labels.
  const typeRows = useMemo(() => {
    return RESOURCE_TYPE_PREF.map((p) => {
      const item = findFacetItemByPref(type.items, p.pref);
      return { display: p.label, item };
    }).filter((r) => r.item); // hide rows that don’t exist in Algolia facets
  }, [type.items]);

  const diffRows = useMemo(() => {
    return DIFFICULTY_PREF.map((p) => {
      const item = findFacetItemByPref(diff.items, p.pref);
      return { display: p.label, item };
    }).filter((r) => r.item);
  }, [diff.items]);

  return (
    <View style={styles.container}>
      {/* Header (no close button) */}
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Filters</Text>
        {totalRefinements > 0 ? (
          <View style={styles.badge}>
            <Text style={styles.badgeText}>{totalRefinements}</Text>
          </View>
        ) : null}
      </View>

      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        {/* Sort by */}
        <Text style={styles.sectionTitle}>Sort by</Text>
        <View style={styles.sectionBox}>
          {SORT_ITEMS.map((o) => (
            <Row
              key={o.value}
              label={o.label}
              selected={currentSort === o.value}
              onPress={() => {
				setCurrentSort(o.value);
				setSearchSortMode(o.value)
			  }}
              variant="radio"
            />
          ))}
        </View>

        {/* Filter by */}
        <Text style={[styles.sectionTitle, { marginTop: 18 }]}>Filter by</Text>

        {/* Type */}
        <Text style={styles.subSectionTitle}>Type</Text>
        <View style={styles.sectionBox}>
          {typeRows.length === 0 ? (
            <Text style={styles.emptyText}>
              No resources found.
            </Text>
          ) : (
            typeRows.map(({ display, item }) => (
              <Row
                key={item.value}
                label={display}
                selected={!!item.isRefined}
                rightText={typeof item.count === 'number' ? String(item.count) : undefined}
                onPress={() => type.refine(item.value)} // refine using EXACT Algolia value
                variant="checkbox"
              />
            ))
          )}
        </View>

        {/* Difficulty */}
        <Text style={[styles.subSectionTitle, { marginTop: 14 }]}>Difficulty</Text>
        <View style={styles.sectionBox}>
          {diffRows.length === 0 ? (
            <Text style={styles.emptyText}>
              No resources found.
            </Text>
          ) : (
            diffRows.map(({ display, item }) => (
              <Row
                key={item.value}
                label={display}
                selected={!!item.isRefined}
                rightText={typeof item.count === 'number' ? String(item.count) : undefined}
                onPress={() => diff.refine(item.value)} // refine using EXACT Algolia value
                variant="checkbox"
              />
            ))
          )}
        </View>

        {/* Bottom buttons */}
        <View style={styles.footerBtns}>
          <TouchableOpacity
            activeOpacity={0.8}
            style={[styles.btn, styles.btnOutline, !canClearAnything && styles.btnDisabled]}
            onPress={clearAll}
            disabled={!canClearAnything}
          >
            <Text style={styles.btnText}>Clear all</Text>
          </TouchableOpacity>

          <TouchableOpacity activeOpacity={0.8} style={styles.btnSolidWrap} onPress={seeResults}>
            <Text style={[styles.btnText, { color: '#0B0B10' }]}>
              See results{typeof nbHits === 'number' ? ` (${nbHits})` : ''}
            </Text>
          </TouchableOpacity>
        </View>

      </ScrollView>
    </View>
  );
}

function Row({
  label,
  selected,
  rightText,
  onPress,
  variant,
}: {
  label: string;
  selected: boolean;
  rightText?: string;
  onPress: () => void;
  variant: 'checkbox' | 'radio';
}) {
  const iconName =
    variant === 'checkbox'
      ? selected
        ? 'checkbox'
        : 'square-outline'
      : selected
      ? 'radio-button-on'
      : 'radio-button-off';

  return (
    <TouchableOpacity style={[styles.row, selected && styles.rowSelected]} activeOpacity={0.7} onPress={onPress}>
      <Text style={[styles.rowLabel, selected && styles.rowLabelSelected]}>{label}</Text>

      <View style={styles.rowRight}>
        {rightText ? (
          <View style={styles.countPill}>
            <Text style={styles.countPillText}>{rightText}</Text>
          </View>
        ) : null}

        <Ionicons name={iconName as any} size={18} color={selected ? TEXT : MUTED} />
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: BG },

  header: {
    paddingTop: 14,
    paddingHorizontal: 16,
    paddingBottom: 10,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: BORDER,
  },
  headerTitle: { color: TEXT, fontSize: 16, fontWeight: '800' },

  badge: {
    minWidth: 24,
    height: 24,
    paddingHorizontal: 8,
    borderRadius: 999,
    backgroundColor: '#252b33',
    alignItems: 'center',
    justifyContent: 'center',
  },
  badgeText: { color: '#fff', fontWeight: '900', fontSize: 12 },

  content: { padding: 16, paddingBottom: 24 },

  sectionTitle: { color: TEXT, fontSize: 14, fontWeight: '800', marginBottom: 10 },
  subSectionTitle: { color: '#E5E7EB', fontSize: 13, fontWeight: '800', marginBottom: 8 },

  sectionBox: {
    backgroundColor: CARD,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: BORDER,
    paddingHorizontal: 12,
    paddingVertical: 10,
  },

  emptyText: {
    color: 'rgba(255,255,255,0.55)',
    fontSize: 12,
    lineHeight: 16,
    paddingVertical: 6,
  },

  row: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 10,
    paddingHorizontal: 6,
    borderRadius: 10,
  },
  rowSelected: { backgroundColor: 'rgba(255,255,255,0.06)' },
  rowLabel: { color: '#E5E7EB', fontSize: 13 },
  rowLabelSelected: { fontWeight: '900', color: TEXT },

  rowRight: { flexDirection: 'row', alignItems: 'center', gap: 8 },

  countPill: {
    backgroundColor: '#252b33',
    borderRadius: 999,
    paddingHorizontal: 8,
    paddingVertical: 3,
  },
  countPillText: { color: '#fff', fontWeight: '900', fontSize: 11 },

  footerBtns: { flexDirection: 'row', gap: 10, marginTop: 18 },

  btn: {
    flex: 1,
    height: 40,
    borderRadius: 999,
    alignItems: 'center',
    justifyContent: 'center',
  },
  btnOutline: { borderWidth: 1, borderColor: TEXT, backgroundColor: 'transparent' },
  btnDisabled: { opacity: 0.35 },

  btnSolidWrap: {
    flex: 1,
    height: 40,
    borderRadius: 999,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: TEXT,
  },

  btnText: { color: TEXT, fontSize: 13, fontWeight: '800' },

});