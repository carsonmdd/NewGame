import { LinearGradient } from 'expo-linear-gradient';
import React, { useEffect } from 'react';
import { StyleSheet, View } from 'react-native';
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
	initialTop?: number | string;
	initialLeft?: number | string;
	initialBottom?: number | string;
	initialRight?: number | string;
	opacity: number;
	duration: number;
	delay?: number;
};

const AmbientBlob = ({
	color,
	size,
	initialTop,
	initialLeft,
	initialBottom,
	initialRight,
	opacity,
	duration,
	delay = 0,
}: BlobProps) => {
	const translateY = useSharedValue(0);
	const rotate = useSharedValue(0);

	useEffect(() => {
		const startAnimation = () => {
			translateY.value = withRepeat(
				withSequence(
					withTiming(-20, { duration: duration / 2 }),
					withTiming(0, { duration: duration / 2 }),
				),
				-1,
				true,
			);
			rotate.value = withRepeat(
				withSequence(
					withTiming(1, { duration: duration / 2 }),
					withTiming(0, { duration: duration / 2 }),
				),
				-1,
				true,
			);
		};

		if (delay > 0) {
			const timeout = setTimeout(startAnimation, delay);
			return () => clearTimeout(timeout);
		} else {
			startAnimation();
		}
	}, [duration, delay, translateY, rotate]);

	const animatedStyle = useAnimatedStyle(() => ({
		transform: [
			{ translateY: translateY.value },
			{ rotate: `${rotate.value}deg` },
		],
	}));

	return (
		<Animated.View
			style={[
				{
					position: 'absolute',
					width: size,
					height: size,
					borderRadius: size / 2,
					backgroundColor: color,
					opacity: opacity,
					top: initialTop,
					left: initialLeft,
					bottom: initialBottom,
					right: initialRight,
				},
				animatedStyle,
			]}
			pointerEvents="none"
		>
			<LinearGradient
				colors={[color, 'transparent']}
				style={{ flex: 1, borderRadius: size / 2 }}
				start={[0.5, 0.5]}
				end={[1, 1]}
			/>
		</Animated.View>
	);
};

export function Background({ children }: { children: React.ReactNode }) {
	return (
		<View className="flex-1 bg-background-deep">
			{/* Base Radial-like Gradient Layer */}
			<LinearGradient
				colors={['#0a0a0f', '#050506', '#020203']}
				locations={[0, 0.5, 1]}
				style={StyleSheet.absoluteFill}
			/>

			{/* Grid Simulation - Very subtle */}
			<View
				style={[StyleSheet.absoluteFill, { opacity: 0.05 }]}
				pointerEvents="none"
			></View>

			{/* Animated Ambient Blobs */}
			<View style={StyleSheet.absoluteFill} pointerEvents="none">
				{/* Top Leftish: accent-blue/10 */}
				<AmbientBlob
					color="#5E6AD2"
					size={600}
					initialTop="-10%"
					initialLeft="10%"
					opacity={0.1}
					duration={15000}
				/>

				{/* Bottom Rightish: purple-500/5 */}
				<AmbientBlob
					color="#A855F7"
					size={500}
					initialBottom="-10%"
					initialRight="5%"
					opacity={0.05}
					duration={12000}
					delay={4000}
				/>

				{/* Middle Rightish: indigo-500/5 */}
				<AmbientBlob
					color="#6366F1"
					size={400}
					initialTop="30%"
					initialRight="-5%"
					opacity={0.05}
					duration={18000}
					delay={8000}
				/>
			</View>

			{/* Content Layer */}
			<View style={{ flex: 1 }}>{children}</View>
		</View>
	);
}
