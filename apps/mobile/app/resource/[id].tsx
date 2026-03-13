import { Ionicons } from '@expo/vector-icons';
import { useLocalSearchParams, useRouter } from 'expo-router';
import React, { useMemo } from 'react';
import {
	ScrollView,
	Text,
	TouchableOpacity,
	View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { useSavedResources } from '@/contexts/SavedResourcesContext';
import { Resource } from '@/types/resource';

export default function ResourceDetailScreen() {
	const { resource: resourceParam } = useLocalSearchParams<{
		resource: string;
	}>();
	const router = useRouter();
	const { saveResource, unsaveResource, isSaved } = useSavedResources();

	const resource = useMemo(() => {
		if (!resourceParam) return null;
		try {
			return JSON.parse(resourceParam) as Resource;
		} catch (e) {
			console.error('Failed to parse resource', e);
			return null;
		}
	}, [resourceParam]);

	if (!resource) {
		return (
			<SafeAreaView className="flex-1 bg-[#0A0A0A] items-center justify-center">
				<Text className="text-white">Resource not found</Text>
				<TouchableOpacity
					onPress={() => router.back()}
					className="mt-4 px-6 py-2 bg-[#17133A] rounded-full"
				>
					<Text className="text-white font-bold">Go Back</Text>
				</TouchableOpacity>
			</SafeAreaView>
		);
	}

	const id = resource.id;
	const currentlySaved = isSaved(id);

	const handleSaveToggle = () => {
		if (currentlySaved) {
			unsaveResource(id);
		} else {
			saveResource(resource);
		}
	};

	return (
		<View className="flex-1 bg-[#0A0A0A]">
			<SafeAreaView edges={['top']} className="z-10 bg-[#0A0A0A]">
				<View className="flex-row justify-between items-center px-5 py-3">
					<TouchableOpacity
						onPress={() => router.back()}
						className="w-10 h-10 items-center justify-center rounded-full bg-white/10"
					>
						<Ionicons name="chevron-back" size={24} color="white" />
					</TouchableOpacity>
					<TouchableOpacity
						onPress={handleSaveToggle}
						className="w-10 h-10 items-center justify-center rounded-full bg-white/10"
					>
						<Ionicons
							name={currentlySaved ? 'bookmark' : 'bookmark-outline'}
							size={22}
							color={currentlySaved ? '#4E46E5' : 'white'}
						/>
					</TouchableOpacity>
				</View>
			</SafeAreaView>

			<ScrollView
				className="flex-1"
				contentContainerClassName="px-6 pb-12 pt-2"
				showsVerticalScrollIndicator={false}
			>
				{/* Header Section */}
				<View className="mb-8">
					<Text className="text-white text-[28px] font-black leading-[34px] mb-4">
						{resource.title}
					</Text>

					<View className="flex-row flex-wrap items-center gap-y-2">
						<View className="flex-row items-center mr-4">
							<Ionicons name="person-outline" size={16} color="#94A3B8" />
							<Text className="text-[#94A3B8] text-sm ml-1.5 font-medium">
								{resource.author || 'Unknown Author'}
							</Text>
						</View>
						<View className="flex-row items-center">
							<Ionicons name="globe-outline" size={16} color="#94A3B8" />
							<Text className="text-[#94A3B8] text-sm ml-1.5 font-medium">
								{resource.source || 'Unknown Source'}
							</Text>
						</View>
					</View>

					{resource.date && (
						<Text className="text-[#64748B] text-xs mt-3 font-medium uppercase tracking-wider">
							Published: {new Date(resource.date).toLocaleDateString()}
						</Text>
					)}
				</View>

				{/* Quick Stats/Metadata */}
				<View className="flex-row flex-wrap gap-2 mb-8">
					<View className="bg-[#17133A] px-3 py-1.5 rounded-lg border border-white/5">
						<Text className="text-[#A5B4FC] text-[11px] font-bold uppercase">
							{resource.sourceType || 'General'}
						</Text>
					</View>
					{resource.evergreen === 'true' && (
						<View className="bg-[#064E3B] px-3 py-1.5 rounded-lg border border-[#059669]/20">
							<Text className="text-[#34D399] text-[11px] font-bold uppercase">
								Evergreen
							</Text>
						</View>
					)}
				</View>

				{/* Main Content Sections */}
				<DetailSection
					title="Central Claim"
					icon="flag-outline"
					content={resource.centralClaim}
				/>

				<DetailSection
					title="Core Knowledge"
					icon="bulb-outline"
					content={resource.coreKnowledge}
				/>

				<DetailSection
					title="Practical Takeaway"
					icon="construct-outline"
					content={resource.practicalTakeaway}
				/>

				{resource.openQuestions && (
					<DetailSection
						title="Open Questions"
						icon="help-circle-outline"
						content={resource.openQuestions}
					/>
				)}

				{resource.keywords && resource.keywords.length > 0 && (
					<View className="mt-4">
						<Text className="text-white/40 text-[11px] font-bold uppercase tracking-widest mb-3">
							Keywords
						</Text>
						<View className="flex-row flex-wrap gap-2">
							{resource.keywords.map((keyword, index) => (
								<View
									key={index}
									className="bg-white/5 px-3 py-1 rounded-full border border-white/5"
								>
									<Text className="text-[#94A3B8] text-xs font-medium">
										{keyword}
									</Text>
								</View>
							))}
						</View>
					</View>
				)}

				{/* Original Link */}
				{resource.url && (
					<TouchableOpacity
						className="mt-10 bg-white/5 py-4 rounded-2xl items-center justify-center border border-white/10"
						activeOpacity={0.7}
					>
						<View className="flex-row items-center">
							<Ionicons name="link-outline" size={18} color="white" />
							<Text className="text-white font-bold ml-2">
								View Original Source
							</Text>
						</View>
					</TouchableOpacity>
				)}
			</ScrollView>
		</View>
	);
}

function DetailSection({
	title,
	icon,
	content,
}: {
	title: string;
	icon: any;
	content?: string;
}) {
	if (!content) return null;

	return (
		<View className="mb-8">
			<View className="flex-row items-center mb-3">
				<View className="w-8 h-8 items-center justify-center rounded-lg bg-[#4E46E5]/10 mr-2.5">
					<Ionicons name={icon} size={18} color="#4E46E5" />
				</View>
				<Text className="text-white/40 text-[11px] font-bold uppercase tracking-widest">
					{title}
				</Text>
			</View>
			<View className="bg-[#161616] p-5 rounded-[20px] border border-white/5">
				<Text className="text-[#E2E8F0] text-[15px] leading-[24px] font-medium">
					{content}
				</Text>
			</View>
		</View>
	);
}
