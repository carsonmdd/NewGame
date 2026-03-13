import { Ionicons } from '@expo/vector-icons';
import { Stack, useLocalSearchParams, useRouter } from 'expo-router';
import React, { useMemo } from 'react';
import {
	Linking,
	Pressable,
	ScrollView,
	Text,
	View,
} from 'react-native';

import { useSavedResources } from '@/contexts/SavedResourcesContext';
import { Resource } from '@/types/resource';
import { getDisplayKind, isYouTubeUrl } from '@/utils/resourceRender';

const COLORS = {
	textPrimary: '#F4F1FF',
};

function formatDate(dateString?: string) {
	if (!dateString) return 'Unknown date';

	const d = new Date(dateString);
	if (Number.isNaN(d.getTime())) return dateString;

	return d.toLocaleDateString();
}

function getYouTubeEmbedLabel(url?: string) {
	if (!url) return 'Open Video';
	return isYouTubeUrl(url) ? 'Open YouTube Video' : 'Open Video';
}

export default function ResourceDetailScreen() {
	const { resource } = useLocalSearchParams<{
		id: string;
		resource?: string;
	}>();

	const router = useRouter();
	const { saveResource, unsaveResource, isSaved } = useSavedResources();

	const parsedResource = useMemo(() => {
		if (!resource) return null;

		try {
			return JSON.parse(resource) as Resource;
		} catch (err) {
			console.error('Failed to parse resource param:', err);
			return null;
		}
	}, [resource]);

	if (!parsedResource) {
		return (
			<>
				<Stack.Screen options={{ headerShown: false }} />
				<View className="flex-1 bg-[#0E0F14]">
					<View className="flex-1 items-center justify-center px-6">
						<Text className="text-[#F4F1FF] text-lg font-bold">
							Resource not found.
						</Text>
					</View>
				</View>
			</>
		);
	}

	const resourceId = (parsedResource as any).objectID || parsedResource.id;
	const saved = isSaved(resourceId);
	const type = getDisplayKind(parsedResource);

	const contentText =
		parsedResource.coreKnowledge ||
		parsedResource.centralClaim ||
		parsedResource.practicalTakeaway ||
		'No content available.';

	const author = parsedResource.author || 'Unknown author';
	const source = parsedResource.source || '';
	const dateStr = parsedResource.date || parsedResource.createdAt;

	const subjectLine =
		type === 'PDF'
			? 'PDF Document'
			: type === 'IMAGE'
				? 'Image Resource'
				: type === 'VIDEO'
					? 'Video Resource'
					: type === 'AUDIO'
						? 'Audio Resource'
						: type === 'LINK'
							? 'External Resource'
							: 'Text Resource';

	const externalUrl = parsedResource.url;

	const renderSection = (label: string, content?: string) => {
		if (!content) return null;
		return (
			<View className="mb-6">
				<Text className="text-[#F4F1FF]/72 text-[12px] font-extrabold uppercase tracking-widest mb-2">{label}</Text>
				<Text className="text-[#F4F1FF] text-base leading-6 font-medium">{content}</Text>
			</View>
		);
	};

	const renderChips = (label: string, items?: string[]) => {
		if (!items || items.length === 0) return null;
		return (
			<View className="mb-6">
				<Text className="text-[#F4F1FF]/72 text-[12px] font-extrabold uppercase tracking-widest mb-2">{label}</Text>
				<View className="flex-row flex-wrap gap-2">
					{items.map((item, index) => (
						<View key={index} className="bg-[#2F2546] px-3 py-1.5 rounded-lg border border-white/6">
							<Text className="text-[#F4F1FF] text-[12px] font-semibold">{item}</Text>
						</View>
					))}
				</View>
			</View>
		);
	};

	const renderMainPanel = () => {
		return (
			<View className="bg-[#121319] rounded-2xl min-h-[520px] border border-white/6 overflow-hidden">
				{(type === 'VIDEO' ||
					type === 'AUDIO' ||
					type === 'PDF' ||
					type === 'LINK') && (
					<View className="items-center justify-center px-5 pt-7 pb-6.5 bg-[#181922] border-b border-white/6">
						{type === 'VIDEO' && (
							<View className="w-[84px] h-[84px] rounded-[42px] items-center justify-center bg-[#4D3B70]">
								<Ionicons
									name="play-circle-outline"
									size={44}
									color={COLORS.textPrimary}
								/>
							</View>
						)}
						{type === 'AUDIO' && (
							<View className="w-[76px] h-[76px] rounded-[38px] items-center justify-center bg-[#4D3B70]">
								<Ionicons
									name="musical-notes-outline"
									size={34}
									color={COLORS.textPrimary}
								/>
							</View>
						)}
						{type === 'PDF' && (
							<View className="w-[76px] h-[76px] rounded-[20px] items-center justify-center bg-[#4D3B70]">
								<Ionicons
									name="document-text-outline"
									size={38}
									color={COLORS.textPrimary}
								/>
							</View>
						)}
						{type === 'LINK' && (
							<View className="w-[76px] h-[76px] rounded-[20px] items-center justify-center bg-[#4D3B70]">
								<Ionicons
									name="open-outline"
									size={34}
									color={COLORS.textPrimary}
								/>
							</View>
						)}

						<Text className="text-[#F4F1FF] text-xl font-extrabold mt-3.5 text-center">{subjectLine}</Text>

						{externalUrl && (
							<Pressable
								className="flex-row items-center gap-2 bg-[#2F2546] rounded-full px-4 py-[11px] border border-white/6"
								onPress={() => Linking.openURL(externalUrl)}
							>
								<Ionicons
									name="open-outline"
									size={18}
									color={COLORS.textPrimary}
								/>
								<Text className="text-[#F4F1FF] text-[14px] font-bold">
									{type === 'VIDEO'
										? getYouTubeEmbedLabel(externalUrl)
										: type === 'PDF'
											? 'Open PDF'
											: 'Open Resource'}
								</Text>
							</Pressable>
						)}
					</View>
				)}

				<View className="px-4 pt-4 pb-5.5">
					{renderSection(
						'Central Claim',
						parsedResource.centralClaim,
					)}
					{renderSection('Core Knowledge', contentText)}
					{renderSection(
						'Practical Takeaway',
						parsedResource.practicalTakeaway,
					)}
					{renderSection(
						'Topic Position',
						parsedResource.topicPosition,
					)}
					{renderSection(
						'Open Questions',
						parsedResource.openQuestions,
					)}
					{renderSection('Audience', parsedResource.audience)}
					{renderSection(
						'Decision Moment',
						parsedResource.decisionMoment,
					)}
					{renderSection(
						'Credibility Notes',
						parsedResource.credibilityNotes,
					)}
					{renderChips('Keywords', parsedResource.keywords)}
					{renderChips(
						'Adjacent Topics',
						parsedResource.adjacentTopics,
					)}

					{(parsedResource.syntheticQuery1 ||
						parsedResource.syntheticQuery2 ||
						parsedResource.syntheticQuery3) && (
						<View className="mb-6">
							<Text className="text-[#F4F1FF]/72 text-[12px] font-extrabold uppercase tracking-widest mb-2">
								Synthetic Queries
							</Text>
							{renderSection('', parsedResource.syntheticQuery1)}
							{renderSection('', parsedResource.syntheticQuery2)}
							{renderSection('', parsedResource.syntheticQuery3)}
						</View>
					)}

					{renderSection(
						'Source Info',
						`${source}${parsedResource.license ? ` (${parsedResource.license})` : ''}`,
					)}
				</View>
			</View>
		);
	};

	return (
		<>
			<Stack.Screen options={{ headerShown: false }} />

			<View className="flex-1 bg-[#0E0F14]">
				<View className="h-[98px] pt-4.5 px-3.5 bg-[#2B2140] border-b border-white/6 flex-row items-center">
					<Pressable
						className="w-11 h-11 rounded-xl items-center justify-center"
						onPress={() => router.back()}
					>
						<Ionicons
							name="close"
							size={28}
							color={COLORS.textPrimary}
						/>
					</Pressable>

					<View className="flex-1 items-center justify-center px-2">
						<Text className="text-[#F4F1FF] text-lg font-extrabold text-center" numberOfLines={1}>
							{parsedResource.title}
						</Text>
						<Text className="text-[#F4F1FF]/72 text-[12px] font-semibold text-center mt-0.5" numberOfLines={1}>
							{subjectLine}
						</Text>
					</View>

					<Pressable
						className="w-11 h-11 rounded-xl items-center justify-center"
						onPress={() => {
							if (saved) {
								unsaveResource(resourceId);
							} else {
								saveResource(parsedResource);
							}
						}}
					>
						<Ionicons
							name={saved ? 'bookmark' : 'bookmark-outline'}
							size={26}
							color={COLORS.textPrimary}
						/>
					</Pressable>
				</View>

				<ScrollView
					className="flex-1"
					contentContainerClassName="px-3.5 pt-3.5 pb-7"
					showsVerticalScrollIndicator={false}
				>
					<View className="flex-row items-center mb-3 px-1 flex-wrap">
						<Text className="text-[#F4F1FF]/72 text-[13px] font-medium">{author}</Text>
						{!!source && (
							<>
								<Text className="text-[#F4F1FF]/72 mx-2 text-[13px]">•</Text>
								<Text className="text-[#F4F1FF]/72 text-[13px] font-medium">{source}</Text>
							</>
						)}
						<Text className="text-[#F4F1FF]/72 mx-2 text-[13px]">•</Text>
						<Text className="text-[#F4F1FF]/72 text-[13px] font-medium">
							{formatDate(dateStr)}
						</Text>
						{parsedResource.evergreen && (
							<>
								<Text className="text-[#F4F1FF]/72 mx-2 text-[13px]">•</Text>
								<View className="flex-row items-center bg-[#4ADE80]/10 px-2 py-1 rounded-md gap-1">
									<Ionicons
										name="leaf-outline"
										size={12}
										color="#4ADE80"
									/>
									<Text className="text-[#4ADE80] text-[11px] font-bold">
										Evergreen
									</Text>
								</View>
							</>
						)}
					</View>

					{renderMainPanel()}
				</ScrollView>
			</View>
		</>
	);
}
