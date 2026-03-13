import { ExternalLink } from 'lucide-react-native';
import { useRouter } from 'expo-router';
import React from 'react';
import { TouchableOpacity, View } from 'react-native';

import { Resource } from '@/types/resource';
import { LinearCard } from './ui/linear/LinearCard';
import { LinearText } from './ui/linear/LinearText';

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
		>
			<LinearCard
				intensity={15}
				containerClassName="min-h-[180px] justify-end p-4 border-white/5"
			>
				<View className="absolute top-3 right-3 w-8 h-8 rounded-xl bg-white/5 items-center justify-center border border-white/10">
					<ExternalLink size={14} color="rgba(255,255,255,0.6)" />
				</View>

				{item.sourceType && (
					<LinearText
						variant="label"
						className="text-[9px] mb-2 text-accent/80"
					>
						{item.sourceType}
					</LinearText>
				)}

				<LinearText
					variant="h3"
					className="text-[15px] font-bold tracking-tight text-foreground leading-snug"
					numberOfLines={2}
				>
					{item.title}
				</LinearText>
			</LinearCard>
		</TouchableOpacity>
	);
}
