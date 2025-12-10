import { Image } from 'expo-image';
import { FlatList, Text, View, Platform, StyleSheet } from 'react-native';
import React from 'react';
import { Link } from 'expo-router';

export default function Resource() {
}

const styles = StyleSheet.create({
  titleContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  stepContainer: {
    gap: 8,
    marginBottom: 8,
  },
  listContainer: {
    paddingVertical: 10,
  },
  item: {
    backgroundColor: '#e0f7fa',
    padding: 15,
    marginVertical: 6,
    borderRadius: 8,
  },
  itemText: {
    fontSize: 16,
    color: '#00796b',
  },
  reactLogo: {
    height: 178,
    width: 290,
    bottom: 0,
    left: 0,
    position: 'absolute',
  },
});
