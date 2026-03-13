import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import React from 'react';
import { Text, TouchableOpacity, View } from 'react-native';

import { Resource } from '@/types/resource';

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
			className="bg-[#17133A] rounded-[18px] p-3 mb-3.5 w-[48%] min-h-[180px] justify-end overflow-hidden"
			activeOpacity={0.75}
			onPress={handlePress}
		>
			<View className="absolute top-2.5 right-2.5 w-[30px] h-[30px] rounded-[10px] bg-black/35 items-center justify-center">
				<Ionicons name="open-outline" size={16} color="#fff" />
			</View>

			<Text
				className="text-white text-base font-black leading-5"
				numberOfLines={2}
			>
				{item.title}
			</Text>
		</TouchableOpacity>
	);
}
