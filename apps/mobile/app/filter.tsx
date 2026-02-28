import { Ionicons } from '@expo/vector-icons';
import React from 'react';
import { ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { router } from 'expo-router';

/**
 * Filter screen
 * - Opened from the Search tab
 * - "X" closes via router.back()
 *
 * Behavior:
 * - Sort by = single select (radio)
 * - Type + Category = multi select (checkbox)
 * - Apply / Clear are local UI behaviors for now
 */

export default function FilterScreen() {
  // Sort by: single select
  const [sortBy, setSortBy] = React.useState<'Most Recent' | 'Relevant' | 'Most Viewed'>(
    'Most Recent'
  );

  // Type: multi select
  const [types, setTypes] = React.useState<string[]>([]);

  // Category: multi select
  const [categories, setCategories] = React.useState<string[]>([]);

  const toggleMulti = (
    value: string,
    selected: string[],
    setSelected: React.Dispatch<React.SetStateAction<string[]>>
  ) => {
    setSelected((prev) => (prev.includes(value) ? prev.filter((x) => x !== value) : [...prev, value]));
  };

  const clearAll = () => {
    setSortBy('Most Recent');
    setTypes([]);
    setCategories([]);
  };

  const applyAndClose = () => {
    // UI-only for now 
    router.back();
  };

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Filter Results</Text>
        <TouchableOpacity
          accessibilityRole="button"
          accessibilityLabel="Close filters"
          onPress={() => router.back()}
          style={styles.closeBtn}
          activeOpacity={0.7}
        >
          <Ionicons name="close" size={20} color="#F9FAFB" />
        </TouchableOpacity>
      </View>

      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        {/* Sort by (single select / radio) */}
        <Text style={styles.sectionTitle}>Sort by</Text>
        <View style={styles.sectionBox}>
          <RadioRow
            label="Most Recent"
            selected={sortBy === 'Most Recent'}
            onPress={() => setSortBy('Most Recent')}
          />
          <RadioRow
            label="Relevant"
            selected={sortBy === 'Relevant'}
            onPress={() => setSortBy('Relevant')}
          />
          <RadioRow
            label="Most Viewed"
            selected={sortBy === 'Most Viewed'}
            onPress={() => setSortBy('Most Viewed')}
          />
        </View>

        {/* Filter by */}
        <Text style={[styles.sectionTitle, { marginTop: 18 }]}>Filter by</Text>

        {/* Type (multi select / checkbox) */}
        <Text style={styles.subSectionTitle}>Type</Text>
        <View style={styles.sectionBox}>
          <CheckboxRow
            label="Document"
            checked={types.includes('Document')}
            onPress={() => toggleMulti('Document', types, setTypes)}
          />
          <CheckboxRow
            label="Video"
            checked={types.includes('Video')}
            onPress={() => toggleMulti('Video', types, setTypes)}
          />
          <CheckboxRow
            label="Audio"
            checked={types.includes('Audio')}
            onPress={() => toggleMulti('Audio', types, setTypes)}
          />
          <CheckboxRow
            label="Other"
            checked={types.includes('Other')}
            onPress={() => toggleMulti('Other', types, setTypes)}
          />
        </View>

        {/* Category (multi select / checkbox) */}
        <Text style={[styles.subSectionTitle, { marginTop: 14 }]}>Category</Text>
        <View style={styles.sectionBox}>
          <CheckboxRow
            label="Development Tools/Tech"
            checked={categories.includes('Development Tools/Tech')}
            onPress={() => toggleMulti('Development Tools/Tech', categories, setCategories)}
          />
          <CheckboxRow
            label="Education & Career"
            checked={categories.includes('Education & Career')}
            onPress={() => toggleMulti('Education & Career', categories, setCategories)}
          />
          <CheckboxRow
            label="Business"
            checked={categories.includes('Business')}
            onPress={() => toggleMulti('Business', categories, setCategories)}
          />
          <CheckboxRow
            label="Industry Insights"
            checked={categories.includes('Industry Insights')}
            onPress={() => toggleMulti('Industry Insights', categories, setCategories)}
          />
        </View>

        {/* Bottom buttons */}
        <View style={styles.footerBtns}>
          <TouchableOpacity
            activeOpacity={0.7}
            style={[styles.btn, styles.btnOutline]}
            onPress={clearAll}
          >
            <Text style={styles.btnText}>Clear Filters</Text>
          </TouchableOpacity>

          <TouchableOpacity
            activeOpacity={0.7}
            style={[styles.btn, styles.btnSolid]}
            onPress={applyAndClose}
          >
            <Text style={[styles.btnText, { color: '#0B0B10' }]}>Apply</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </View>
  );
}

/** Multi-select row */
function CheckboxRow({
  label,
  checked = false,
  onPress,
}: {
  label: string;
  checked?: boolean;
  onPress: () => void;
}) {
  return (
    <TouchableOpacity style={styles.row} activeOpacity={0.7} onPress={onPress}>
      <Text style={styles.rowLabel}>{label}</Text>
      <Ionicons
        name={checked ? 'checkbox' : 'square-outline'}
        size={18}
        color={checked ? '#F9FAFB' : '#9CA3AF'}
      />
    </TouchableOpacity>
  );
}

/** Single-select row (radio) */
function RadioRow({
  label,
  selected = false,
  onPress,
}: {
  label: string;
  selected?: boolean;
  onPress: () => void;
}) {
  return (
    <TouchableOpacity style={styles.row} activeOpacity={0.7} onPress={onPress}>
      <Text style={styles.rowLabel}>{label}</Text>
      <Ionicons
        name={selected ? 'radio-button-on' : 'radio-button-off'}
        size={18}
        color={selected ? '#F9FAFB' : '#9CA3AF'}
      />
    </TouchableOpacity>
  );
}

const BG = '#050509';
const CARD = '#0F0F14';
const BORDER = '#2B2B36';

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: BG,
  },
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
  headerTitle: {
    color: '#F9FAFB',
    fontSize: 16,
    fontWeight: '700',
  },
  closeBtn: {
    padding: 8,
    borderRadius: 999,
  },
  content: {
    padding: 16,
    paddingBottom: 24,
  },
  sectionTitle: {
    color: '#F9FAFB',
    fontSize: 14,
    fontWeight: '700',
    marginBottom: 10,
  },
  subSectionTitle: {
    color: '#E5E7EB',
    fontSize: 13,
    fontWeight: '700',
    marginBottom: 8,
  },
  sectionBox: {
    backgroundColor: CARD,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: BORDER,
    paddingHorizontal: 12,
    paddingVertical: 10,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 8,
  },
  rowLabel: {
    color: '#E5E7EB',
    fontSize: 13,
  },
  footerBtns: {
    flexDirection: 'row',
    gap: 10,
    marginTop: 18,
  },
  btn: {
    flex: 1,
    height: 40,
    borderRadius: 999,
    alignItems: 'center',
    justifyContent: 'center',
  },
  btnOutline: {
    borderWidth: 1,
    borderColor: '#F9FAFB',
    backgroundColor: 'transparent',
  },
  btnSolid: {
    backgroundColor: '#F9FAFB',
  },
  btnText: {
    color: '#F9FAFB',
    fontSize: 13,
    fontWeight: '700',
  },
});
