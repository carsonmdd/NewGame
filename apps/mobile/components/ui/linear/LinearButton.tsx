import { LinearGradient } from 'expo-linear-gradient';
import React from 'react';
import {
	Text,
	TouchableOpacity,
	TouchableOpacityProps,
	View,
	StyleSheet,
} from 'react-native';

interface LinearButtonProps extends TouchableOpacityProps {
	variant?: 'primary' | 'secondary' | 'ghost';
	title: string;
	icon?: React.ReactNode;
}

export function LinearButton({
	variant = 'primary',
	title,
	icon,
	...props
}: LinearButtonProps) {
	if (variant === 'primary') {
		return (
			<TouchableOpacity
				activeOpacity={0.8}
				style={[styles.glow, props.style]}
				{...props}
			>
				<LinearGradient
					colors={['#5E6AD2', '#4F46E5']}
					className="rounded-lg py-3.5 px-6 flex-row items-center justify-center border border-white/20"
				>
					{icon && <View className="mr-2.5">{icon}</View>}
					<Text className="text-white font-bold text-base tracking-tight">
						{title}
					</Text>
				</LinearGradient>

				{/* Inset Shadow Effect */}
				<View style={styles.insetShadow} />
			</TouchableOpacity>
		);
	}

	if (variant === 'secondary') {
		return (
			<TouchableOpacity
				activeOpacity={0.7}
				className="bg-surface rounded-lg py-3.5 px-6 flex-row items-center justify-center border border-border-default"
				style={props.style}
				{...props}
			>
				{icon && <View className="mr-2.5">{icon}</View>}
				<Text className="text-foreground font-semibold text-base tracking-tight">
					{title}
				</Text>
			</TouchableOpacity>
		);
	}

	return (
		<TouchableOpacity
			activeOpacity={0.6}
			className="py-3.5 px-6 flex-row items-center justify-center"
			style={props.style}
			{...props}
		>
			{icon && <View className="mr-2.5">{icon}</View>}
			<Text className="text-foreground-muted hover:text-foreground font-semibold text-base tracking-tight">
				{title}
			</Text>
		</TouchableOpacity>
	);
}

const styles = StyleSheet.create({
	glow: {
		shadowColor: '#5E6AD2',
		shadowOffset: { width: 0, height: 4 },
		shadowOpacity: 0.4,
		shadowRadius: 10,
		elevation: 8,
	},
	insetShadow: {
		position: 'absolute',
		top: 1,
		left: 1,
		right: 1,
		height: 1,
		backgroundColor: 'rgba(255,255,255,0.2)',
		borderRadius: 8,
	},
});
