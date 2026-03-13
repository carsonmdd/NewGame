import { ChevronLeft, Bookmark, Globe, User, Calendar, Flag, Lightbulb, Construction, HelpCircle, Link as LinkIcon } from 'lucide-react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import React, { useMemo } from 'react';
import {
	ScrollView,
	TouchableOpacity,
	View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { useSavedResources } from '@/contexts/SavedResourcesContext';
import { Resource } from '@/types/resource';
import { LinearBackground } from '@/components/ui/linear/LinearBackground';
import { LinearCard } from '@/components/ui/linear/LinearCard';
import { LinearText } from '@/components/ui/linear/LinearText';
import { LinearButton } from '@/components/ui/linear/LinearButton';

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
			<LinearBackground>
				<SafeAreaView className="flex-1 items-center justify-center">
					<LinearText variant="body-large" className="text-foreground-muted mb-6">Resource not found</LinearText>
					<LinearButton
						title="Go Back"
						onPress={() => router.back()}
						variant="secondary"
					/>
				</SafeAreaView>
			</LinearBackground>
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
		<LinearBackground>
			<SafeAreaView edges={['top']} className="z-10">
				<View className="flex-row justify-between items-center px-6 py-4">
					<TouchableOpacity
						onPress={() => router.back()}
						className="w-11 h-11 items-center justify-center rounded-xl bg-white/5 border border-white/10"
					>
						<ChevronLeft size={22} color="white" />
					</TouchableOpacity>
					<TouchableOpacity
						onPress={handleSaveToggle}
						className={`w-11 h-11 items-center justify-center rounded-xl ${currentlySaved ? 'bg-accent/20 border-accent/40' : 'bg-white/5 border-white/10'}`}
					>
						<Bookmark
							size={20}
							fill={currentlySaved ? '#5E6AD2' : 'none'}
							color={currentlySaved ? '#5E6AD2' : 'white'}
						/>
					</TouchableOpacity>
				</View>
			</SafeAreaView>

			<ScrollView
				className="flex-1"
				contentContainerClassName="px-6 pb-20 pt-2"
				showsVerticalScrollIndicator={false}
			>
				{/* Header Section */}
				<View className="mb-10">
					<LinearText variant="label" className="mb-3 text-accent tracking-[0.2em]">
						{resource.sourceType || 'RESOURCE'}
					</LinearText>
					<LinearText variant="h1" className="mb-6 leading-tight">
						{resource.title}
					</LinearText>

					<View className="flex-row flex-wrap items-center gap-y-3">
						<View className="flex-row items-center mr-6 bg-white/5 px-3 py-1.5 rounded-lg border border-white/5">
							<User size={14} color="#8A8F98" />
							<LinearText variant="body" className="text-foreground-muted text-sm ml-2 font-medium">
								{resource.author || 'Unknown Author'}
							</LinearText>
						</View>
						<View className="flex-row items-center bg-white/5 px-3 py-1.5 rounded-lg border border-white/5">
							<Globe size={14} color="#8A8F98" />
							<LinearText variant="body" className="text-foreground-muted text-sm ml-2 font-medium">
								{resource.source || 'Unknown Source'}
							</LinearText>
						</View>
					</View>

					{resource.date && (
						<View className="flex-row items-center mt-5">
							<Calendar size={12} color="rgba(255,255,255,0.4)" />
							<LinearText variant="label" className="ml-2 lowercase tracking-normal">
								Published: {new Date(resource.date).toLocaleDateString()}
							</LinearText>
						</View>
					)}
				</View>

				{/* Main Content Sections */}
				<DetailSection
					title="Central Claim"
					icon={<Flag size={18} color="#5E6AD2" />}
					content={resource.centralClaim}
				/>

				<DetailSection
					title="Core Knowledge"
					icon={<Lightbulb size={18} color="#5E6AD2" />}
					content={resource.coreKnowledge}
				/>

				<DetailSection
					title="Practical Takeaway"
					icon={<Construction size={18} color="#5E6AD2" />}
					content={resource.practicalTakeaway}
				/>

				{resource.openQuestions && (
					<DetailSection
						title="Open Questions"
						icon={<HelpCircle size={18} color="#5E6AD2" />}
						content={resource.openQuestions}
					/>
				)}

				{resource.keywords && resource.keywords.length > 0 && (
					<View className="mt-8">
						<LinearText variant="label" className="mb-4 tracking-widest text-foreground-subtle">
							Keywords
						</LinearText>
						<View className="flex-row flex-wrap gap-2.5">
							{resource.keywords.map((keyword, index) => (
								<View
									key={index}
									className="bg-accent/10 px-4 py-2 rounded-full border border-accent/20"
								>
									<LinearText variant="body" className="text-accent text-xs font-semibold tracking-tight">
										{keyword}
									</LinearText>
								</View>
							))}
						</View>
					</View>
				)}

				{/* Original Link */}
				{resource.url && (
					<View className="mt-12">
						<LinearButton
							title="View Original Source"
							icon={<LinkIcon size={18} color="white" />}
							onPress={() => {}}
						/>
					</View>
				)}
			</ScrollView>
		</LinearBackground>
	);
}

function DetailSection({
	title,
	icon,
	content,
}: {
	title: string;
	icon: React.ReactNode;
	content?: string;
}) {
	if (!content) return null;

	return (
		<View className="mb-10">
			<View className="flex-row items-center mb-4">
				<View className="w-9 h-9 items-center justify-center rounded-xl bg-accent/10 border border-accent/20 mr-3.5">
					{icon}
				</View>
				<LinearText variant="label" className="text-foreground-subtle">
					{title}
				</LinearText>
			</View>
			<LinearCard
				intensity={10}
				containerClassName="p-6 border-white/5 bg-white/[0.03]"
			>
				<LinearText variant="body" className="text-foreground/90 leading-relaxed font-medium">
					{content}
				</LinearText>
			</LinearCard>
		</View>
	);
}
