import { useRouter } from 'expo-router';
import React, { useEffect, useState } from 'react';
import {
	ScrollView,
	Text,
	TouchableOpacity,
	View,
} from 'react-native';

import { resourceApi } from '@/lib/api';
import { Resource } from '@/types/resource';

export default function HomeScreen() {
	const [trending, setTrending] = useState<Resource[]>([]);
	const [latest, setLatest] = useState<Resource[]>([]);
	const [loading, setLoading] = useState(true);
	const [error, setError] = useState('');
	const router = useRouter();

	const loadResources = async () => {
		try {
			setLoading(true);
			setError('');
			const response = await resourceApi.discover();
			setTrending(response.data.trending);
			setLatest(response.data.new);
		} catch (e) {
			setError('Failed to load resources.');
		} finally {
			setLoading(false);
		}
	};

	useEffect(() => {
		loadResources();
	}, []);

	const handleResourcePress = (item: Resource) => {
		router.push({
			pathname: '/resource/[id]',
			params: {
				id: item.id,
				resource: JSON.stringify(item),
			},
		});
	};

	return (
		<View className="flex-1 bg-[#0A0A0A]">
			<ScrollView
				showsVerticalScrollIndicator={false}
				contentContainerClassName="px-5 pt-[18px] pb-8"
			>
				<View className="flex-row justify-between items-center mb-5">
					<Text className="text-white text-2xl font-bold">Home</Text>
				</View>

				{error ? (
					<View className="py-10 items-center">
						<Text className="text-red-400 mb-4">{error}</Text>
						<TouchableOpacity
							onPress={loadResources}
							className="px-6 py-2 bg-white/10 rounded-full"
						>
							<Text className="text-white font-bold">Retry</Text>
						</TouchableOpacity>
					</View>
				) : null}

				<View className="mb-6">
					<View className="flex-row justify-between items-center mb-3">
						<Text className="text-white text-lg font-bold">Trending</Text>
					</View>

					{loading && trending.length === 0 ? (
						<View className="h-40 bg-[#161616] rounded-[20px] animate-pulse" />
					) : (
						trending.map((item) => (
							<TouchableOpacity
								key={item.id}
								activeOpacity={0.85}
								onPress={() => handleResourcePress(item)}
								className="h-[185px] rounded-[20px] bg-[#161616] mb-4 overflow-hidden relative"
							>
								<View className="absolute inset-0 bg-[#2B2B2B]" />
								<View className="flex-1 justify-end px-[18px] pb-[18px]">
									<Text
										className="text-white text-[17px] font-bold leading-[22px]"
										numberOfLines={2}
									>
										{item.title}
									</Text>
								</View>
							</TouchableOpacity>
						))
					)}
				</View>

				<View className="mb-6">
					<View className="flex-row justify-between items-center mb-3">
						<Text className="text-white text-lg font-bold">Latest</Text>
					</View>

					{loading && latest.length === 0 ? (
						<View className="h-40 bg-[#161616] rounded-[20px] animate-pulse" />
					) : (
						latest.map((item) => (
							<TouchableOpacity
								key={item.id}
								activeOpacity={0.85}
								onPress={() => handleResourcePress(item)}
								className="h-[185px] rounded-[20px] bg-[#161616] mb-4 overflow-hidden relative"
							>
								<View className="absolute inset-0 bg-[#2B2B2B]" />
								<View className="flex-1 justify-end px-[18px] pb-[18px]">
									<Text
										className="text-white text-[17px] font-bold leading-[22px]"
										numberOfLines={2}
									>
										{item.title}
									</Text>
								</View>
							</TouchableOpacity>
						))
					)}
				</View>
			</ScrollView>
		</View>
	);
}
