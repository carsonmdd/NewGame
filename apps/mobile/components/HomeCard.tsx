import React from 'react';
import { TouchableOpacity, View } from 'react-native';
import { LinearCard } from './ui/linear/LinearCard';
import { LinearText } from './ui/linear/LinearText';
import { User } from 'lucide-react-native';
import { Resource } from '@/types/resource';

type Props = {
	item: Resource;
	handleResourcePress: (item: Resource) => void;
};

const HomeCard = ({ item, handleResourcePress }: Props) => {
	return (
		<TouchableOpacity
			key={item.id}
			activeOpacity={0.85}
			onPress={() => handleResourcePress(item)}
			className="mb-5"
		>
			<LinearCard
				intensity={15}
				containerClassName="h-48 justify-end p-6 border-white/5"
			>
				<LinearText variant="label" className="text-accent/80 mb-2">
					{item.sourceType || 'TRENDING'}
				</LinearText>
				<LinearText
					variant="h3"
					className="text-lg font-bold leading-tight"
					numberOfLines={2}
				>
					{item.title}
				</LinearText>
				<View className="flex-row items-center mt-4">
					<View className="w-6 h-6 rounded-full bg-accent/20 items-center justify-center mr-2">
						<User size={12} color="#5E6AD2" />
					</View>
					<LinearText
						variant="body"
						className="text-foreground-muted text-xs"
					>
						{item.author || 'Unknown Author'}
					</LinearText>
				</View>
			</LinearCard>
		</TouchableOpacity>
	);
};

export default HomeCard;
