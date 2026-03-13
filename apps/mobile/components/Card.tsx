import { BlurView } from 'expo-blur';
import { LinearGradient } from 'expo-linear-gradient';
import React from 'react';
import { Platform, StyleSheet, View, ViewProps } from 'react-native';

interface CardProps extends ViewProps {
	children: React.ReactNode;
	intensity?: number;
	containerClassName?: string;
}

export function Card({
	children,
	intensity = 20,
	containerClassName = '',
	style,
	...props
}: CardProps) {
	const Container = Platform.OS === 'ios' ? BlurView : View;

	return (
		<View
			className={`rounded-2xl overflow-hidden border border-border-default bg-surface ${containerClassName}`}
			style={[styles.cardShadow, style]}
			{...props}
		>
			<Container
				intensity={intensity}
				tint="dark"
				style={StyleSheet.absoluteFill}
			/>

			{/* Top Edge Highlight */}
			<LinearGradient
				colors={['rgba(255,255,255,0.1)', 'transparent']}
				start={[0, 0]}
				end={[0, 1]}
				style={styles.highlight}
			/>

			<View className="p-4 flex-1">{children}</View>
		</View>
	);
}

const styles = StyleSheet.create({
	cardShadow: {
		shadowColor: '#000',
		shadowOffset: { width: 0, height: 4 },
		shadowOpacity: 0.3,
		shadowRadius: 12,
		elevation: 8,
	},
	highlight: {
		position: 'absolute',
		top: 0,
		left: 0,
		right: 0,
		height: 1,
	},
});
