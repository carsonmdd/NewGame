import React from 'react';
import { TouchableOpacity, View } from 'react-native';
import { Card } from './Card';
import { CustomText } from './CustomText';
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
			<Card
				intensity={15}
				containerClassName="h-48 justify-end p-6 border-white/5"
			>
				<CustomText variant="label" className="text-accent-bright mb-2">
					{item.sourceType || 'TRENDING'}
				</CustomText>
				<CustomText
					variant="h3"
					className="text-lg font-bold leading-tight"
					numberOfLines={2}
				>
					{item.title}
				</CustomText>
				<View className="flex-row items-center mt-4">
					<View className="w-6 h-6 rounded-full bg-accent/20 items-center justify-center mr-2">
						<User size={12} color="#5E6AD2" />
					</View>
					<CustomText
						variant="body"
						className="text-foreground-muted text-xs"
					>
						{item.author || 'Unknown Author'}
					</CustomText>
				</View>
			</Card>
		</TouchableOpacity>
	);
};

export default HomeCard;
