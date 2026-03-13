import { LinearGradient } from 'expo-linear-gradient';
import React, { useEffect } from 'react';
import { StyleSheet, View, useWindowDimensions } from 'react-native';
import Animated, {
	useAnimatedStyle,
	useSharedValue,
	withRepeat,
	withSequence,
	withTiming,
} from 'react-native-reanimated';

type BlobProps = {
	color: string;
	size: number;
	initialX: number;
	initialY: number;
	duration?: number;
};

const FloatingBlob = ({
	color,
	size,
	initialX,
	initialY,
	duration = 10000,
}: BlobProps) => {
	const translateX = useSharedValue(0);
	const translateY = useSharedValue(0);

	useEffect(() => {
		translateX.value = withRepeat(
			withSequence(
				withTiming(40, { duration: duration / 2 }),
				withTiming(-40, { duration: duration / 2 })
			),
			-1,
			true
		);
		translateY.value = withRepeat(
			withSequence(
				withTiming(-50, { duration: duration / 1.5 }),
				withTiming(50, { duration: duration / 1.5 })
			),
			-1,
			true
		);
	}, []);

	const animatedStyle = useAnimatedStyle(() => ({
		transform: [
			{ translateX: translateX.value },
			{ translateY: translateY.value },
		],
	}));

	return (
		<Animated.View
			style={[
				{
					position: 'absolute',
					width: size,
					height: size,
					left: initialX,
					top: initialY,
					opacity: 0.1,
				},
				animatedStyle,
			]}
			pointerEvents="none"
		>
			<LinearGradient
				colors={[color, 'transparent']}
				start={[0.5, 0.5]}
				end={[1, 1]}
				style={{ flex: 1, borderRadius: size / 2 }}
			/>
		</Animated.View>
	);
};

export function LinearBackground({ children }: { children: React.ReactNode }) {
	const { width, height } = useWindowDimensions();

	return (
		<View className="flex-1 bg-background-deep">
			{/* Base Gradient Layer */}
			<LinearGradient
				colors={['#0a0a0f', '#050506', '#020203']}
				locations={[0, 0.5, 1]}
				style={StyleSheet.absoluteFill}
			/>

			{/* Animated Blobs */}
			<View style={StyleSheet.absoluteFill} pointerEvents="none">
				<FloatingBlob
					color="#5E6AD2"
					size={width * 1.5}
					initialX={-width * 0.4}
					initialY={-height * 0.3}
					duration={12000}
				/>
				<FloatingBlob
					color="#818CF8"
					size={width * 1.2}
					initialX={width * 0.5}
					initialY={height * 0.2}
					duration={15000}
				/>
				<FloatingBlob
					color="#4F46E5"
					size={width * 1.4}
					initialX={-width * 0.5}
					initialY={height * 0.6}
					duration={18000}
				/>
			</View>

			{/* Content Layer */}
			<View style={{ flex: 1 }}>{children}</View>
		</View>
	);
}
