import { ExternalLink } from 'lucide-react-native';
import { useRouter } from 'expo-router';
import React from 'react';
import { TouchableOpacity, View, StyleSheet } from 'react-native';

import { Resource } from '@/types/resource';
import { Card } from './Card';
import { CustomText } from './CustomText';

type Props = {
	item: Resource;
};

export function ResourceCard({ item }: Props) {
	const router = useRouter();

	const handlePress = () => {
		router.push({
			pathname: '/resource/[id]',
			params: {
				id: item.id,
				resource: JSON.stringify(item),
			},
		});
	};

	return (
		<TouchableOpacity
			activeOpacity={0.85}
			onPress={handlePress}
			className="w-[48%] mb-4"
			style={styles.cardContainer}
		>
			<Card
				intensity={12}
				containerClassName="min-h-[190px] justify-between border-white/5 bg-white/[0.02]"
			>
				{/* Top Header - Icon is now consistently top-right */}
				<View className="flex-row justify-between items-start">
					<View className="flex-1 mr-8">
						{item.sourceType && (
							<View className="bg-accent/10 self-start px-2 py-0.5 rounded-md border border-accent/20">
								<CustomText
									variant="label"
									className="text-[8px] text-accent-bright font-bold"
									numberOfLines={1}
								>
									{item.sourceType}
								</CustomText>
							</View>
						)}
					</View>

					<View className="absolute top-0 right-0 w-7 h-7 rounded-lg bg-white/5 items-center justify-center border border-white/10">
						<ExternalLink size={12} color="rgba(255,255,255,0.4)" />
					</View>
				</View>

				{/* Bottom Content - Focus on Title */}
				<View className="mt-4">
					<CustomText variant="h3" numberOfLines={3}>
						{item.title}
					</CustomText>

					{/* Decorative accent line */}
					<View className="h-[2px] w-8 bg-accent/30 rounded-full mt-3" />

					{item.author && (
						<CustomText
							variant="label"
							className="text-[9px] mt-2 text-foreground-muted"
							numberOfLines={1}
						>
							{item.author}
						</CustomText>
					)}
				</View>
			</Card>
		</TouchableOpacity>
	);
}

const styles = StyleSheet.create({
	cardContainer: {
		// Ensure the card feels cohesive
		shadowColor: '#000',
		shadowOffset: { width: 0, height: 8 },
		shadowOpacity: 0.2,
		shadowRadius: 12,
		elevation: 5,
	},
});
