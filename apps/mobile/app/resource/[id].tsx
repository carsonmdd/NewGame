import { Ionicons } from '@expo/vector-icons';
import { Image } from 'expo-image';
import { Stack, useLocalSearchParams, useRouter } from 'expo-router';
import React, { useMemo } from 'react';
import {
	Linking,
	Pressable,
	ScrollView,
	StyleSheet,
	Text,
	View,
} from 'react-native';

import { useSavedResources } from '@/contexts/SavedResourcesContext';
import { Resource } from '@/types/resource';
import { getDisplayKind, isYouTubeUrl } from '@/utils/resourceRender';

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
				<View style={styles.container}>
					<View style={styles.centered}>
						<Text style={styles.notFoundText}>
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
			<View style={styles.section}>
				<Text style={styles.sectionLabel}>{label}</Text>
				<Text style={styles.sectionText}>{content}</Text>
			</View>
		);
	};

	const renderChips = (label: string, items?: string[]) => {
		if (!items || items.length === 0) return null;
		return (
			<View style={styles.section}>
				<Text style={styles.sectionLabel}>{label}</Text>
				<View style={styles.chipRow}>
					{items.map((item, index) => (
						<View key={index} style={styles.chip}>
							<Text style={styles.chipText}>{item}</Text>
						</View>
					))}
				</View>
			</View>
		);
	};

	const renderMainPanel = () => {
		return (
			<View style={styles.panel}>
				{(type === 'VIDEO' ||
					type === 'AUDIO' ||
					type === 'PDF' ||
					type === 'LINK') && (
					<View style={styles.mediaPanel}>
						{type === 'VIDEO' && (
							<View style={styles.videoIconWrap}>
								<Ionicons
									name="play-circle-outline"
									size={44}
									color={COLORS.textPrimary}
								/>
							</View>
						)}
						{type === 'AUDIO' && (
							<View style={styles.audioIconWrap}>
								<Ionicons
									name="musical-notes-outline"
									size={34}
									color={COLORS.textPrimary}
								/>
							</View>
						)}
						{type === 'PDF' && (
							<View style={styles.pdfIconWrap}>
								<Ionicons
									name="document-text-outline"
									size={38}
									color={COLORS.textPrimary}
								/>
							</View>
						)}
						{type === 'LINK' && (
							<View style={styles.linkIconWrap}>
								<Ionicons
									name="open-outline"
									size={34}
									color={COLORS.textPrimary}
								/>
							</View>
						)}

						<Text style={styles.mediaTitle}>{subjectLine}</Text>

						{externalUrl && (
							<Pressable
								style={styles.primaryActionButton}
								onPress={() => Linking.openURL(externalUrl)}
							>
								<Ionicons
									name="open-outline"
									size={18}
									color={COLORS.textPrimary}
								/>
								<Text style={styles.primaryActionText}>
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

				<View style={styles.panelTextBlock}>
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
						<View style={styles.section}>
							<Text style={styles.sectionLabel}>
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

			<View style={styles.container}>
				<View style={styles.header}>
					<Pressable
						style={styles.headerIconButton}
						onPress={() => router.back()}
					>
						<Ionicons
							name="close"
							size={28}
							color={COLORS.textPrimary}
						/>
					</Pressable>

					<View style={styles.headerCenter}>
						<Text style={styles.headerTitle} numberOfLines={1}>
							{parsedResource.title}
						</Text>
						<Text style={styles.headerSubtitle} numberOfLines={1}>
							{subjectLine}
						</Text>
					</View>

					<Pressable
						style={styles.headerIconButton}
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
					style={styles.body}
					contentContainerStyle={styles.scrollContent}
					showsVerticalScrollIndicator={false}
				>
					<View style={styles.metaRow}>
						<Text style={styles.metaText}>{author}</Text>
						{!!source && (
							<>
								<Text style={styles.metaDot}>•</Text>
								<Text style={styles.metaText}>{source}</Text>
							</>
						)}
						<Text style={styles.metaDot}>•</Text>
						<Text style={styles.metaText}>
							{formatDate(dateStr)}
						</Text>
						{parsedResource.evergreen && (
							<>
								<Text style={styles.metaDot}>•</Text>
								<View style={styles.evergreenBadge}>
									<Ionicons
										name="leaf-outline"
										size={12}
										color="#4ADE80"
									/>
									<Text style={styles.evergreenText}>
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

const COLORS = {
	screenBg: '#0E0F14',
	headerBg: '#2B2140',
	panelBg: '#121319',
	panelInner: '#181922',
	textPrimary: '#F4F1FF',
	textSecondary: 'rgba(244,241,255,0.72)',
	border: 'rgba(255,255,255,0.06)',
	accent: '#4D3B70',
	buttonBg: '#2F2546',
	buttonBgPressed: '#3B2E58',
	mediaSurface: '#1A1B24',
};

const styles = StyleSheet.create({
	container: {
		flex: 1,
		backgroundColor: COLORS.screenBg,
	},

	centered: {
		flex: 1,
		alignItems: 'center',
		justifyContent: 'center',
		paddingHorizontal: 24,
	},

	notFoundText: {
		color: COLORS.textPrimary,
		fontSize: 18,
		fontWeight: '700',
	},

	header: {
		height: 98,
		paddingTop: 18,
		paddingHorizontal: 14,
		backgroundColor: COLORS.headerBg,
		borderBottomWidth: 1,
		borderBottomColor: COLORS.border,
		flexDirection: 'row',
		alignItems: 'center',
	},

	headerIconButton: {
		width: 44,
		height: 44,
		borderRadius: 12,
		alignItems: 'center',
		justifyContent: 'center',
	},

	headerCenter: {
		flex: 1,
		alignItems: 'center',
		justifyContent: 'center',
		paddingHorizontal: 8,
	},

	headerTitle: {
		color: COLORS.textPrimary,
		fontSize: 18,
		fontWeight: '800',
		textAlign: 'center',
	},

	headerSubtitle: {
		color: COLORS.textSecondary,
		fontSize: 12,
		fontWeight: '600',
		textAlign: 'center',
		marginTop: 2,
	},

	body: {
		flex: 1,
	},

	scrollContent: {
		paddingHorizontal: 14,
		paddingTop: 14,
		paddingBottom: 28,
	},

	metaRow: {
		flexDirection: 'row',
		alignItems: 'center',
		marginBottom: 12,
		paddingHorizontal: 4,
		flexWrap: 'wrap',
	},

	metaText: {
		color: COLORS.textSecondary,
		fontSize: 13,
		fontWeight: '500',
	},

	metaDot: {
		color: COLORS.textSecondary,
		marginHorizontal: 8,
		fontSize: 13,
	},

	panel: {
		backgroundColor: COLORS.panelBg,
		borderRadius: 16,
		minHeight: 520,
		borderWidth: 1,
		borderColor: COLORS.border,
		overflow: 'hidden',
	},

	panelLabel: {
		color: COLORS.textPrimary,
		fontSize: 15,
		fontWeight: '800',
		marginBottom: 12,
	},

	panelText: {
		color: COLORS.textPrimary,
		fontSize: 16,
		lineHeight: 30,
		fontWeight: '700',
	},

	panelTextBlock: {
		paddingHorizontal: 16,
		paddingTop: 16,
		paddingBottom: 22,
	},

	fullImage: {
		width: '100%',
		height: 320,
		backgroundColor: COLORS.mediaSurface,
	},

	mediaPanel: {
		alignItems: 'center',
		justifyContent: 'center',
		paddingHorizontal: 20,
		paddingTop: 28,
		paddingBottom: 26,
		backgroundColor: COLORS.panelInner,
		borderBottomWidth: 1,
		borderBottomColor: COLORS.border,
	},

	mediaTitle: {
		color: COLORS.textPrimary,
		fontSize: 20,
		fontWeight: '800',
		marginTop: 14,
		textAlign: 'center',
	},

	mediaSubtext: {
		color: COLORS.textSecondary,
		fontSize: 14,
		lineHeight: 21,
		textAlign: 'center',
		marginTop: 8,
		marginBottom: 16,
	},

	audioIconWrap: {
		width: 76,
		height: 76,
		borderRadius: 38,
		alignItems: 'center',
		justifyContent: 'center',
		backgroundColor: COLORS.accent,
	},

	videoIconWrap: {
		width: 84,
		height: 84,
		borderRadius: 42,
		alignItems: 'center',
		justifyContent: 'center',
		backgroundColor: COLORS.accent,
	},

	pdfIconWrap: {
		width: 76,
		height: 76,
		borderRadius: 20,
		alignItems: 'center',
		justifyContent: 'center',
		backgroundColor: COLORS.accent,
	},

	linkIconWrap: {
		width: 76,
		height: 76,
		borderRadius: 20,
		alignItems: 'center',
		justifyContent: 'center',
		backgroundColor: COLORS.accent,
	},

	primaryActionButton: {
		flexDirection: 'row',
		alignItems: 'center',
		gap: 8,
		backgroundColor: COLORS.buttonBg,
		borderRadius: 999,
		paddingHorizontal: 16,
		paddingVertical: 11,
		borderWidth: 1,
		borderColor: COLORS.border,
	},

	primaryActionText: {
		color: COLORS.textPrimary,
		fontSize: 14,
		fontWeight: '700',
	},

	section: {
		marginBottom: 24,
	},

	sectionLabel: {
		color: COLORS.textSecondary,
		fontSize: 12,
		fontWeight: '800',
		textTransform: 'uppercase',
		letterSpacing: 1,
		marginBottom: 8,
	},

	sectionText: {
		color: COLORS.textPrimary,
		fontSize: 16,
		lineHeight: 24,
		fontWeight: '500',
	},

	chipRow: {
		flexDirection: 'row',
		flexWrap: 'wrap',
		gap: 8,
	},

	chip: {
		backgroundColor: COLORS.buttonBg,
		paddingHorizontal: 12,
		paddingVertical: 6,
		borderRadius: 8,
		borderWidth: 1,
		borderColor: COLORS.border,
	},

	chipText: {
		color: COLORS.textPrimary,
		fontSize: 12,
		fontWeight: '600',
	},

	evergreenBadge: {
		flexDirection: 'row',
		alignItems: 'center',
		backgroundColor: 'rgba(74, 222, 128, 0.1)',
		paddingHorizontal: 8,
		paddingVertical: 4,
		borderRadius: 6,
		gap: 4,
	},

	evergreenText: {
		color: '#4ADE80',
		fontSize: 11,
		fontWeight: '700',
	},
});
