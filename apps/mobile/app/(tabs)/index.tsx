import { useRouter } from 'expo-router';
import React, { useEffect, useState } from 'react';
import {
	ScrollView,
	TouchableOpacity,
	View,
	ActivityIndicator,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { RefreshCcw, TrendingUp, Clock } from 'lucide-react-native';

import { resourceApi } from '@/lib/api';
import { Resource } from '@/types/resource';
import { Background } from '@/components/Background';
import { Card } from '@/components/Card';
import { CustomText } from '@/components/CustomText';
import { Button } from '@/components/Button';
import HomeCard from '@/components/HomeCard';

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
			setTrending(response.data.trending || []);
			setLatest(response.data.new || []);
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
		<Background>
			<SafeAreaView edges={['top']} className="flex-1">
				<View className="px-6 py-4 flex-row justify-between items-center">
					<View>
						<CustomText
							variant="label"
							className="text-accent tracking-[0.2em] mb-1"
						>
							DISCOVER
						</CustomText>
						<CustomText variant="h1">Home</CustomText>
					</View>
					<TouchableOpacity
						onPress={loadResources}
						className="w-10 h-10 items-center justify-center rounded-xl bg-white/5 border border-white/10"
					>
						<RefreshCcw size={18} color="rgba(255,255,255,0.6)" />
					</TouchableOpacity>
				</View>

				<ScrollView
					showsVerticalScrollIndicator={false}
					contentContainerClassName="px-6 pt-2 pb-12"
				>
					{error ? (
						<View className="py-20 items-center px-10">
							<CustomText
								variant="body"
								className="text-red-400 text-center mb-6"
							>
								{error}
							</CustomText>
							<Button
								title="Retry"
								onPress={loadResources}
								variant="secondary"
							/>
						</View>
					) : null}

					{/* Trending Section */}
					<View className="mb-10">
						<View className="flex-row items-center mb-5">
							<TrendingUp size={18} color="#5E6AD2" />
							<CustomText variant="h2" className="ml-3">
								Trending
							</CustomText>
						</View>

						{loading && trending.length === 0 ? (
							<View className="h-48 rounded-2xl bg-white/5 items-center justify-center border border-white/5">
								<ActivityIndicator color="#5E6AD2" />
							</View>
						) : (
							trending.map((item, index) => (
								<HomeCard
									key={index}
									item={item}
									handleResourcePress={handleResourcePress}
								/>
							))
						)}
					</View>

					{/* Latest Section */}
					<View className="mb-10">
						<View className="flex-row items-center mb-5">
							<Clock size={18} color="#5E6AD2" />
							<CustomText variant="h2" className="ml-3">
								Latest
							</CustomText>
						</View>

						{loading && latest.length === 0 ? (
							<View className="h-48 rounded-2xl bg-white/5 items-center justify-center border border-white/5">
								<ActivityIndicator color="#5E6AD2" />
							</View>
						) : (
							latest.map((item, index) => (
								<HomeCard
									key={index}
									item={item}
									handleResourcePress={handleResourcePress}
								/>
							))
						)}
					</View>
				</ScrollView>
			</SafeAreaView>
		</Background>
	);
}
