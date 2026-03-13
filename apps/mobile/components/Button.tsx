import React from 'react';
import {
	Text,
	TouchableOpacity,
	TouchableOpacityProps,
	View,
	StyleSheet,
} from 'react-native';

interface ButtonProps extends TouchableOpacityProps {
	variant?: 'primary' | 'secondary' | 'ghost';
	title: string;
	icon?: React.ReactNode;
}

export function Button({
	variant = 'primary',
	title,
	icon,
	...props
}: ButtonProps) {
	if (variant === 'primary') {
		return (
			<TouchableOpacity
				activeOpacity={0.8}
				style={[styles.glow, props.style]}
				{...props}
			>
				{/* Main Button Body with Accent Color */}
				<View className="bg-accent rounded-lg overflow-hidden border border-white/20">
					{/* Manual Gradient: Darker Overlay at the bottom */}
					<View
						className="absolute inset-0 bg-black/10"
						style={{ top: '50%' }}
					/>

					{/* Content Layer */}
					<View className="py-3.5 px-6 flex-row items-center justify-center">
						{icon && <View className="mr-2.5">{icon}</View>}
						<Text className="text-white font-bold text-base tracking-tight">
							{title}
						</Text>
					</View>

					{/* Inset Shadow (Top Shine) */}
					<View style={styles.insetShadow} pointerEvents="none" />
				</View>
			</TouchableOpacity>
		);
	}

	if (variant === 'secondary') {
		return (
			<TouchableOpacity
				activeOpacity={0.7}
				className="bg-surface rounded-lg py-3.5 px-6 flex-row items-center justify-center border border-white/10"
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
			<Text className="text-foreground-muted font-semibold text-base tracking-tight">
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
		height: 1.5, // Slightly thicker for manual look
		backgroundColor: 'rgba(255,255,255,0.3)',
		borderRadius: 8,
	},
});
