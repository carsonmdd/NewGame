import { useRouter } from 'expo-router';
import React, { useEffect, useState } from 'react';
import {
	ScrollView,
	TouchableOpacity,
	View,
	ActivityIndicator,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { RefreshCcw, TrendingUp, Clock, User } from 'lucide-react-native';

import { resourceApi } from '@/lib/api';
import { Resource } from '@/types/resource';
import { LinearBackground } from '@/components/ui/linear/LinearBackground';
import { LinearCard } from '@/components/ui/linear/LinearCard';
import { LinearText } from '@/components/ui/linear/LinearText';
import { LinearButton } from '@/components/ui/linear/LinearButton';

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
		<LinearBackground>
			<SafeAreaView edges={['top']} className="flex-1">
				<View className="px-6 py-4 flex-row justify-between items-center">
					<View>
						<LinearText
							variant="label"
							className="text-accent tracking-[0.2em] mb-1"
						>
							DISCOVER
						</LinearText>
						<LinearText variant="h2">Home</LinearText>
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
							<LinearText
								variant="body"
								className="text-red-400 text-center mb-6"
							>
								{error}
							</LinearText>
							<LinearButton
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
							<LinearText variant="h3" className="ml-3">
								Trending
							</LinearText>
						</View>

						{loading && trending.length === 0 ? (
							<View className="h-48 rounded-2xl bg-white/5 items-center justify-center border border-white/5">
								<ActivityIndicator color="#5E6AD2" />
							</View>
						) : (
							trending.map((item) => (
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
										<LinearText
											variant="label"
											className="text-accent/80 mb-2"
										>
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
												<User
													size={12}
													color="#5E6AD2"
												/>
											</View>
											<LinearText
												variant="body"
												className="text-foreground-muted text-xs"
											>
												{item.author ||
													'Unknown Author'}
											</LinearText>
										</View>
									</LinearCard>
								</TouchableOpacity>
							))
						)}
					</View>

					{/* Latest Section */}
					<View className="mb-10">
						<View className="flex-row items-center mb-5">
							<Clock size={18} color="#5E6AD2" />
							<LinearText variant="h3" className="ml-3">
								Latest
							</LinearText>
						</View>

						{loading && latest.length === 0 ? (
							<View className="h-48 rounded-2xl bg-white/5 items-center justify-center border border-white/5">
								<ActivityIndicator color="#5E6AD2" />
							</View>
						) : (
							latest.map((item) => (
								<TouchableOpacity
									key={item.id}
									activeOpacity={0.85}
									onPress={() => handleResourcePress(item)}
									className="mb-5"
								>
									<LinearCard
										intensity={10}
										containerClassName="h-40 justify-end p-6 border-white/5"
									>
										<LinearText
											variant="label"
											className="text-foreground-subtle mb-2"
										>
											{item.sourceType || 'LATEST'}
										</LinearText>
										<LinearText
											variant="h3"
											className="text-base font-bold leading-tight"
											numberOfLines={2}
										>
											{item.title}
										</LinearText>
									</LinearCard>
								</TouchableOpacity>
							))
						)}
					</View>
				</ScrollView>
			</SafeAreaView>
		</LinearBackground>
	);
}
