import { Tabs } from 'expo-router';
import React from 'react';
import { BlurView } from 'expo-blur';
import { Platform, StyleSheet } from 'react-native';

import Feather from '@expo/vector-icons/Feather';
import { HapticTab } from '@/components/haptic-tab';
import { IconSymbol } from '@/components/ui/icon-symbol';
import { Colors } from '@/constants/theme';
import { useColorScheme } from '@/hooks/use-color-scheme';

export default function TabLayout() {
	const colorScheme = useColorScheme();

	return (
		<Tabs
			screenOptions={{
				tabBarActiveTintColor: Colors[colorScheme ?? 'dark'].tint,
				tabBarInactiveTintColor: Colors[colorScheme ?? 'dark'].icon,
				headerShown: false,
				tabBarButton: HapticTab,
				tabBarStyle: {
					position: 'absolute',
					borderTopWidth: 1,
					borderTopColor: 'rgba(255,255,255,0.06)',
					backgroundColor: Platform.OS === 'ios' ? 'transparent' : '#0a0a0c',
					height: 85,
					paddingBottom: 25,
					paddingTop: 10,
				},
				tabBarBackground: () =>
					Platform.OS === 'ios' ? (
						<BlurView
							intensity={30}
							tint="dark"
							style={StyleSheet.absoluteFill}
						/>
					) : null,
			}}
		>
			<Tabs.Screen
				name="index"
				options={{
					title: 'Home',
					tabBarIcon: ({ color }) => (
						<IconSymbol size={24} name="house.fill" color={color} />
					),
				}}
			/>
			<Tabs.Screen
				name="search"
				options={{
					title: 'Search',
					tabBarIcon: ({ color }) => (
						<Feather size={24} name="search" color={color} />
					),
				}}
			/>
			<Tabs.Screen
				name="saved"
				options={{
					title: 'Saved',
					tabBarIcon: ({ color }) => (
						<IconSymbol
							size={24}
							name="bookmark.fill"
							color={color}
						/>
					),
				}}
			/>
		</Tabs>
	);
}
