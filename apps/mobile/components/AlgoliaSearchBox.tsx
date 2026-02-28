import React, { useState, useRef } from 'react';
import { StyleSheet, TextInput, View, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useSearchBox, UseSearchBoxProps } from 'react-instantsearch-core';
import { router } from 'expo-router';

export function AlgoliaSearchBox(props: UseSearchBoxProps) {
  const { query, refine } = useSearchBox(props);
  const [inputValue, setInputValue] = useState(query);
  const inputRef = useRef<TextInput>(null);

  function setQuery(newQuery: string) {
    setInputValue(newQuery);
    refine(newQuery);
  }

  return (
    <View style={styles.searchBar}>
      <Ionicons
        name="search"
        size={18}
        color="#F9FAFB"
        style={styles.searchIcon}
      />
      <TextInput
        ref={inputRef}
        style={styles.searchInput}
        placeholder="Search with Algolia"
        placeholderTextColor="#E5E7EB"
        value={inputValue}
        onChangeText={setQuery}
        clearButtonMode="while-editing"
        autoCapitalize="none"
        autoCorrect={false}
        spellCheck={false}
        returnKeyType="search"
      />

      <TouchableOpacity
        accessibilityRole="button"
        accessibilityLabel="Open filters"
        activeOpacity={0.7}
        style={styles.filterBtn}
        onPress={() => router.push('../filter')}
      >
        <Ionicons
          name="options-outline"
          size={18}
          color="#F9FAFB"
        />
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  searchBar: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255,255,255,0.12)',
    borderRadius: 999,
    paddingHorizontal: 14,
    height: 44,
    marginBottom: 16,
  },
  searchIcon: {
    marginRight: 10,
  },
  searchInput: {
    flex: 1,
    color: '#FFFFFF',
    fontSize: 14,
  },
  filterBtn: {
    marginLeft: 8,
    padding: 6,
    borderRadius: 999,
  },
});
